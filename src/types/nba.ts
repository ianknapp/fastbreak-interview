import { NBAPlayer, NBAStats, NBATeam } from '@balldontlie/sdk';

// Re-export the SDK types for use in our application
export type Player = NBAPlayer;
export type GameStats = NBAStats;
export type Team = NBATeam;

// Create our own Stats type for average statistics
export interface Stats {
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
}

// Extend Player type with stats
export interface PlayerWithStats extends NBAPlayer {
  stats: Stats;
}

// Season type
export interface Season {
  season: number;
}