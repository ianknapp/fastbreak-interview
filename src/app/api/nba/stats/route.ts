import { NextResponse } from 'next/server';
import { fetchPlayers, getHornetsId } from '@/lib/api/nba';
import { Player, Stats } from '@/types/nba';

// Statistical categories we're interested in
const statCategories = ['pts', 'reb', 'ast', 'stl', 'blk', 'fg_pct', 'fg3_pct', 'ft_pct'];

// Helper function to get top players by category
function getTopPlayersByCategory(
  players: (Player & { stats?: Stats })[], 
  category: keyof Stats, 
  limit: number = 5
) {
  return [...players]
    .filter(player => player.stats && player.stats[category] !== undefined && player.stats[category] !== null)
    .sort((a, b) => (b.stats![category] as number) - (a.stats![category] as number))
    .slice(0, limit)
    .map(player => ({
      id: player.id,
      name: `${player.first_name} ${player.last_name}`,
      position: player.position,
      value: player.stats![category]
    }));
}

// Prepare aggregated statistics for the dashboard
function transformPlayersData(players: (Player & { stats?: Stats })[]) {
  // 1. Top players by each statistical category
  const leaderboards: Record<string, Array<{id: number; name: string; position: string; value: number}>> = {};
  statCategories.forEach(category => {
    leaderboards[category] = getTopPlayersByCategory(players, category as keyof Stats);
  });

  // 2. Shooting efficiency data
  const shootingEfficiency = players
    .filter(player => player.stats)
    .map(player => ({
      id: player.id,
      name: `${player.first_name} ${player.last_name}`,
      fg_pct: player.stats!.fg_pct,
      fg3_pct: player.stats!.fg3_pct
    }))
    .sort((a, b) => b.fg_pct - a.fg_pct);

  // 3. Points distribution data
  const pointsDistribution = players
    .filter(player => player.stats)
    .map(player => ({
      id: player.id,
      name: `${player.first_name} ${player.last_name}`,
      points: player.stats!.pts
    }))
    .sort((a, b) => b.points - a.points);

  // 4. Full player data for radar charts and selections
  const fullPlayerData = players
    .filter(player => player.stats)
    .map(player => ({
      id: player.id,
      name: `${player.first_name} ${player.last_name}`,
      position: player.position,
      stats: player.stats
    }));

  return {
    leaderboards,
    shootingEfficiency,
    pointsDistribution,
    players: fullPlayerData
  };
}

export async function GET() {
  try {
    // 1. Get Hornets team ID
    const hornetsId = await getHornetsId();
    
    // 2. Fetch all Hornets players
    const playersResponse = await fetchPlayers(1, 100, [hornetsId]);
    const players = playersResponse.data;
    
    // 3. Fetch stats for each player
    const playersWithStats = await Promise.all(
      players.map(async (player: Player) => {
        try {
          const BASE_URL = 'https://api.balldontlie.io/v1';
          const API_KEY = process.env.BALLDONTLIE_API_KEY;
          
          const response = await fetch(
            `${BASE_URL}/season_averages?player_ids[]=${player.id}`,
            { headers: { 'Authorization': API_KEY || '' } }
          );
          
          if (!response.ok) {
            throw new Error(`Failed to fetch stats for player ${player.id}`);
          }
          
          const data = await response.json();
          return {
            ...player,
            stats: data.data && data.data[0] ? data.data[0] : undefined
          };
        } catch (error) {
          console.error(`Error fetching stats for player ${player.id}:`, error);
          return player; // Return player without stats if there's an error
        }
      })
    );
    
    // 4. Transform the data for dashboard consumption
    const transformedData = transformPlayersData(playersWithStats);
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error in player-stats API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and transform player stats' },
      { status: 500 }
    );
  }
}