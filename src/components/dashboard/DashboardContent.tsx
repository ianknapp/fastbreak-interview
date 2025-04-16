'use client';

import React, { useEffect, useState } from 'react';
import PlayerLeaderboard from './PlayerLeaderboard';
import ShootingEfficiency from './ShootingEfficiency';
import PointsDistribution from './PointsDistribution';
import PerformanceRadarChart from './PerformanceRadarChart';

// Define TypeScript interfaces for the data structure
interface PlayerStats {
  id: number;
  name: string;
  position: string;
  stats: {
    pts: number;
    reb: number;
    ast: number;
    stl: number;
    blk: number;
    fg_pct: number;
    fg3_pct: number;
    ft_pct: number;
  };
}

interface LeaderboardPlayer {
  id: number;
  name: string;
  position: string;
  value: number;
}

interface ShootingData {
  id: number;
  name: string;
  fg_pct: number;
  fg3_pct: number;
}

interface PointsData {
  id: number;
  name: string;
  points: number;
}

interface StatsData {
  leaderboards: Record<string, LeaderboardPlayer[]>;
  shootingEfficiency: ShootingData[];
  pointsDistribution: PointsData[];
  players: PlayerStats[];
}

export default function DashboardContent() {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        // Fetch data from our API endpoint
        const response = await fetch('/api/nba/stats');
        
        if (!response.ok) {
          throw new Error(`Error fetching stats: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setStatsData(data);
        
        // Set default selected player to the first player in the list
        if (data.players && data.players.length > 0) {
          setSelectedPlayer(data.players[0]);
        }
      } catch (err: unknown) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  const handlePlayerSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const playerId = Number(event.target.value);
    if (statsData) {
      const player = statsData.players.find(p => p.id === playerId);
      if (player) {
        setSelectedPlayer(player);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading statistics...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading statistics: {error}
      </div>
    );
  }

  if (!statsData) {
    return <div className="text-center py-10">No data available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Player Leaderboard */}
      <div className="bg-black bg-opacity-80 rounded-lg shadow-lg">
        <PlayerLeaderboard leaderboards={statsData.leaderboards} />
      </div>

      {/* Shooting Efficiency */}
      <div className="bg-black bg-opacity-80 rounded-lg shadow-lg">
        <ShootingEfficiency data={statsData.shootingEfficiency} />
      </div>

      {/* Points Distribution */}
      <div className="bg-black bg-opacity-80 rounded-lg shadow-lg">
        <PointsDistribution data={statsData.pointsDistribution} />
      </div>

      {/* Performance Radar Chart */}
      <div className="bg-black bg-opacity-80 rounded-lg shadow-lg p-4">
        <div className="mb-4">
          <label htmlFor="player-select" className="block text-sm font-medium text-gray-200 mb-1">
            Select Player:
          </label>
          <select
            id="player-select"
            className="block w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
            value={selectedPlayer?.id || ''}
            onChange={handlePlayerSelect}
          >
            {statsData.players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
        {selectedPlayer && <PerformanceRadarChart player={selectedPlayer} />}
      </div>
    </div>
  );
} 