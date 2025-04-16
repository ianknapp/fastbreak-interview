import { NextResponse } from 'next/server';
import { fetchHornetsPlayers, fetchPlayerStatsBySeason } from '@/lib/api/nba';
import { Stats, PlayerWithStats } from '@/types/nba';
import { NBAPlayer, NBAStats } from '@balldontlie/sdk';

// Statistical categories we're interested in
const statCategories = ['pts', 'reb', 'ast', 'stl', 'blk', 'fg_pct', 'fg3_pct', 'ft_pct'];

// Define interfaces for type safety
interface LeaderboardEntry {
  id: number;
  name: string;
  position: string;
  value: number;
}

// Calculate average stats from game-by-game stats
function calculateAverageStats(gameStats: NBAStats[]): Stats {
  if (!gameStats || gameStats.length === 0) {
    return {
      pts: 0,
      reb: 0,
      ast: 0,
      stl: 0,
      blk: 0,
      fg_pct: 0,
      fg3_pct: 0,
      ft_pct: 0
    };
  }

  // Initialize totals
  const totals = {
    pts: 0,
    reb: 0,
    ast: 0,
    stl: 0,
    blk: 0,
    fgm: 0,
    fga: 0,
    fg3m: 0,
    fg3a: 0,
    ftm: 0,
    fta: 0,
    games: 0
  };

  // Sum up stats from all games
  gameStats.forEach(game => {
    // Only count games where the player actually played (has minutes)
    if (game.min && game.min !== "0:00" && game.min !== "") {
      totals.pts += game.pts || 0;
      totals.reb += game.reb || 0;
      totals.ast += game.ast || 0;
      totals.stl += game.stl || 0;
      totals.blk += game.blk || 0;
      totals.fgm += game.fgm || 0;
      totals.fga += game.fga || 0;
      totals.fg3m += game.fg3m || 0;
      totals.fg3a += game.fg3a || 0;
      totals.ftm += game.ftm || 0;
      totals.fta += game.fta || 0;
      totals.games++;
    }
  });

  // Calculate percentages and averages
  return {
    pts: totals.games > 0 ? totals.pts / totals.games : 0,
    reb: totals.games > 0 ? totals.reb / totals.games : 0,
    ast: totals.games > 0 ? totals.ast / totals.games : 0,
    stl: totals.games > 0 ? totals.stl / totals.games : 0,
    blk: totals.games > 0 ? totals.blk / totals.games : 0,
    fg_pct: totals.fga > 0 ? totals.fgm / totals.fga : 0,
    fg3_pct: totals.fg3a > 0 ? totals.fg3m / totals.fg3a : 0,
    ft_pct: totals.fta > 0 ? totals.ftm / totals.fta : 0
  };
}

// Helper function to get top players by category
function getTopPlayersByCategory(
  players: PlayerWithStats[], 
  category: keyof Stats, 
  limit: number = 5
): LeaderboardEntry[] {
  return [...players]
    .sort((a, b) => (b.stats[category] as number) - (a.stats[category] as number))
    .slice(0, limit)
    .map(player => ({
      id: player.id,
      name: `${player.first_name} ${player.last_name}`,
      position: player.position,
      value: player.stats[category]
    }));
}

// Transform data for dashboard consumption in one pass
function transformForDashboard(players: PlayerWithStats[]) {
  // Initialize data structures
  const leaderboards: Record<string, LeaderboardEntry[]> = {};
  statCategories.forEach(category => { leaderboards[category] = []; });
  
  const shootingEfficiency = players.map(player => ({
    id: player.id,
    name: `${player.first_name} ${player.last_name}`,
    fg_pct: player.stats.fg_pct,
    fg3_pct: player.stats.fg3_pct
  })).sort((a, b) => b.fg_pct - a.fg_pct);
  
  const pointsDistribution = players.map(player => ({
    id: player.id,
    name: `${player.first_name} ${player.last_name}`,
    points: player.stats.pts
  })).sort((a, b) => b.points - a.points);
  
  // Create player data for radar charts
  const fullPlayerData = players.map(player => ({
    id: player.id,
    name: `${player.first_name} ${player.last_name}`,
    position: player.position,
    stats: player.stats
  }));
  
  // Calculate leaderboards for each category
  statCategories.forEach(category => {
    leaderboards[category] = getTopPlayersByCategory(players, category as keyof Stats);
  });
  
  return {
    leaderboards,
    shootingEfficiency,
    pointsDistribution,
    players: fullPlayerData
  };
}

export async function GET() {
  try {
    console.log('🏀 Starting API request for Hornets player stats (2024 season) with SDK');
    
    // 1. Fetch all Hornets players
    console.log('📊 Fetching Hornets players...');
    const playersResponse = await fetchHornetsPlayers();
    const players = playersResponse.data || [];
    console.log(`✅ Found ${players.length} Hornets players`);
    
    if (players.length === 0) {
      console.log('⚠️ No Hornets players found, returning empty data');
      return NextResponse.json({
        leaderboards: {},
        shootingEfficiency: [],
        pointsDistribution: [],
        players: []
      });
    }
    
    // 2. Extract player IDs
    const playerIds = players.map((player: NBAPlayer) => player.id);
    console.log(`🔍 Will fetch stats individually for ${playerIds.length} players`);
    
    // 3. Fetch stats for each player individually with batching to avoid rate limiting
    console.log('📊 Starting individual player stat requests with SDK...');
    const playersWithGameStats: Record<number, NBAStats[]> = {};
    
    // Process players in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < playerIds.length; i += batchSize) {
      const batch = playerIds.slice(i, i + batchSize);
      console.log(`🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(playerIds.length/batchSize)}`);
      
      // Process each batch sequentially, but make requests within batch in parallel
      const batchResults = await Promise.all(
        batch.map((playerId: number) => fetchPlayerStatsBySeason(playerId))
      );
      
      // Collect game stats for each player
      batchResults.forEach((result, index) => {
        const playerId = batch[index];
        if (result.data && result.data.length > 0) {
          playersWithGameStats[playerId] = result.data;
          console.log(`📋 Player ${playerId}: Collected ${result.data.length} game records`);
        }
      });
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < playerIds.length) {
        console.log('⏱️ Waiting 500ms between batches...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    const totalStatsCount = Object.values(playersWithGameStats).reduce(
      (count, games) => count + games.length, 0
    );
    console.log(`✅ Retrieved ${totalStatsCount} total game stats for ${Object.keys(playersWithGameStats).length} players`);
    
    // 4. Convert game stats to average stats and merge with player data
    const playersWithStats: PlayerWithStats[] = [];
    
    for (const player of players) {
      const gameStats = playersWithGameStats[player.id];
      if (!gameStats || gameStats.length === 0) continue;
      
      // Calculate average stats from game stats
      const avgStats = calculateAverageStats(gameStats);
      playersWithStats.push({ ...player, stats: avgStats });
    }
    
    console.log(`🔄 Successfully calculated average stats for ${playersWithStats.length} players`);
    
    if (playersWithStats.length === 0) {
      console.log('⚠️ No players with stats found, returning empty data');
      return NextResponse.json({
        leaderboards: {},
        shootingEfficiency: [],
        pointsDistribution: [],
        players: []
      });
    }
    
    // Log players that have no stats
    const playersWithoutStats = players.filter(
      (player: NBAPlayer) => !playersWithGameStats[player.id] || playersWithGameStats[player.id].length === 0
    );
    
    if (playersWithoutStats.length > 0) {
      console.log('⚠️ Players without stats:', playersWithoutStats.map((p: NBAPlayer) => `${p.first_name} ${p.last_name} (ID: ${p.id})`));
    }
    
    // 5. Transform data for dashboard in one operation
    const dashboardData = transformForDashboard(playersWithStats);
    console.log('✅ Dashboard data prepared successfully');
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('❌ Error in player-stats API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and transform player stats' },
      { status: 500 }
    );
  }
}