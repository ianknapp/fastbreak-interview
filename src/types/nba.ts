export interface Player {
    stats: unknown;
    id: number;
    first_name: string;
    last_name: string;
    position: string;
    height_feet: number | null;
    height_inches: number | null;
    weight_pounds: number | null;
    team: Team;
  }
  
  export interface Team {
    id: number;
    abbreviation: string;
    city: string;
    conference: string;
    division: string;
    full_name: string;
    name: string;
  }
  
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
  
  export interface GameStats extends Stats {
    player_id: number;
    game_id: number;
    min: string;
    team_id: number;
  }
  
  export interface Season {
    season: number;
  }