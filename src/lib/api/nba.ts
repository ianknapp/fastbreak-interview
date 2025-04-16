import { BalldontlieAPI } from "@balldontlie/sdk";

const API_KEY = process.env.BALLDONTLIE_API_KEY || '0cae7c5c-c68a-4ef8-b530-90caa739f109';
const HORNETS_TEAM_ID = 4; // Hardcoded Hornets team ID to avoid unnecessary API calls
const CURRENT_SEASON = 2024; // NBA seasons are labeled by the year they start (2023-2024 season)

// Initialize the SDK with API key
const api = new BalldontlieAPI({ apiKey: API_KEY });

// Get all Hornets players
export async function fetchHornetsPlayers() {
  try {
    const response = await api.nba.getPlayers({
      team_ids: [HORNETS_TEAM_ID],
      per_page: 100
    });
    
    console.log(`✅ Success: Retrieved ${response.data.length || 0} Hornets players`);
    return response;
  } catch (error) {
    console.error('❌ Error fetching Hornets players:', error);
    throw error;
  }
}

// Fetch stats for hornets player in a specific season
export async function fetchPlayerStatsBySeason(playerId: number, season: number = CURRENT_SEASON) {  
  try {
    const response = await api.nba.getStats({
      player_ids: [playerId],
      seasons: [season],
      per_page: 100
    });
    
    console.log(`✅ Player ${playerId}: Found ${response.data.length || 0} stat records for season ${season}`);
    return response;
  } catch (error) {
    // Handle errors gracefully - if we can't get stats for a player, return empty array
    console.error(`❌ Error fetching stats for player ${playerId}:`, error);
    return { data: [] };
  }
}

