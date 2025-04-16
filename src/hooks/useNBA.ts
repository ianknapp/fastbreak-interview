import { useState, useEffect } from 'react';
import { Player, Stats } from '@/types/nba';

export function usePlayerSearch(search: string, page = 1) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/nba/players?search=${search}&page=${page}`
        );
        const data = await response.json();
        setPlayers(data.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching players:', error);
        setError('Failed to fetch players');
      } finally {
        setLoading(false);
      }
    };

    if (search) {
      fetchData();
    } else {
      setPlayers([]);
    }
  }, [search, page]);

  return { players, loading, error };
}

export function usePlayerStats(playerId: number | null, season?: number) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!playerId) return;
      
      setLoading(true);
      try {
        const seasonParam = season ? `&season=${season}` : '';
        const response = await fetch(
          `/api/nba/stats?playerId=${playerId}${seasonParam}`
        );
        const data = await response.json();
        setStats(data.data[0] || null);
        setError(null);
      } catch (error) {
        console.error('Error fetching player stats:', error);
        setError('Failed to fetch player stats');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playerId, season]);

  return { stats, loading, error };
}