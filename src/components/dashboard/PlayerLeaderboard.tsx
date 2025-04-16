'use client';

import { useState } from 'react';

interface LeaderboardPlayer {
  id: number;
  name: string;
  position: string;
  value: number;
}

type StatLabels = {
  [key: string]: string;
};

const statLabels: StatLabels = {
  pts: 'Points',
  reb: 'Rebounds',
  ast: 'Assists',
  stl: 'Steals',
  blk: 'Blocks',
  fg_pct: 'FG%',
  fg3_pct: '3PT%',
  ft_pct: 'FT%'
};

export default function PlayerLeaderboard({ leaderboards }: { leaderboards: Record<string, LeaderboardPlayer[]> }) {
  const [selectedStat, setSelectedStat] = useState('pts');
  
  const formatValue = (stat: string, value: number) => {
    if (stat.includes('pct')) {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toFixed(1);
  };
  
  return (
    <div className="bg-black rounded-lg p-4 text-white">
      <div className="mb-4">
        <label htmlFor="stat-select" className="block text-sm font-medium text-gray-200 mb-1">
          Select Statistic:
        </label>
        <select
          id="stat-select"
          className="block w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
          value={selectedStat}
          onChange={(e) => setSelectedStat(e.target.value)}
        >
          {Object.entries(statLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Player</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{statLabels[selectedStat]}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {leaderboards[selectedStat]?.map((player, index) => (
              <tr key={player.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-100">{index + 1}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{player.name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{player.position}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">{formatValue(selectedStat, player.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}