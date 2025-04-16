import { BalldontlieAPI } from "@balldontlie/sdk";

const BASE_URL = 'https://api.balldontlie.io/v1';
const API_KEY = process.env.BALLDONTLIE_API_KEY || '0cae7c5c-c68a-4ef8-b530-90caa739f109';
const HORNETS_TEAM_ID = 4; // Hardcoded Hornets team ID to avoid unnecessary API calls
const CURRENT_SEASON = 2024; // NBA seasons are labeled by the year they start (2023-2024 season)

const headers = {
  'Authorization': API_KEY
};

// Initialize the SDK with API key
const api = new BalldontlieAPI({ apiKey: API_KEY });

// Simplified teams API to just get all teams
export async function fetchTeams() {
  const response = await fetch(
    `${BASE_URL}/teams`,
    { headers }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }
  
  return response.json();
}

// Function to get the Hornets team ID
export async function getHornetsId() {
  try {
    const { data } = await fetchTeams();
    const hornets = data.find((team: { name: string; full_name: string | string[]; }) => 
      team.name === 'Hornets' || team.full_name.includes('Hornets')
    );
    
    if (!hornets) {
      throw new Error('Hornets team not found');
    }
    
    return hornets.id;
  } catch (error) {
    console.error('Error finding Hornets team ID:', error);
    throw error;
  }
}

// Simplified players API with only the parameters we need
export async function fetchPlayers(page = 1, per_page = 25, team_ids?: number[]) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('per_page', per_page.toString());
  
  // Add team_ids if provided
  if (team_ids && team_ids.length > 0) {
    team_ids.forEach(id => {
      params.append('team_ids[]', id.toString());
    });
  }
  
  const response = await fetch(
    `${BASE_URL}/players?${params.toString()}`,
    { headers }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch players');
  }
  
  return response.json();
}

// This function is used in the stats route.ts file
export async function fetchPlayerStats(playerId: number) {
  const response = await fetch(
    `${BASE_URL}/season_averages?player_ids[]=${playerId}`,
    { headers }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stats for player ${playerId}`);
  }
  
  return response.json();
}

// Get all Hornets players
export async function fetchHornetsPlayers() {
  console.log('📡 FETCH REQUEST FOR HORNETS PLAYERS (using SDK):');
  console.log(`🏀 Team ID: ${HORNETS_TEAM_ID} (Charlotte Hornets)`);
  
  try {
    // Get all players for Hornets team
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

// Fetch stats for a player in a specific season
export async function fetchPlayerStatsBySeason(playerId: number, season: number = CURRENT_SEASON) {
  console.log(`📡 FETCH STATS FOR PLAYER ${playerId} (using SDK):`);
  console.log(`🏆 Season: ${season}`);
  
  try {
    // Get player stats for the specified season
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

// Fetch stats for multiple player IDs at once
export async function fetchPlayersStats(playerIds: number[]) {
  if (!playerIds.length) return { data: [] };
  
  // Create URL with all player IDs (up to 25 at a time)
  const playerIdsParam = playerIds.map(id => `player_ids[]=${id}`).join('&');
  const url = `${BASE_URL}/season_averages?${playerIdsParam}`;
  
  // Log the exact request details
  console.log('📡 FETCH REQUEST:');
  console.log(`📍 URL: ${url}`);
  console.log(`🔑 API Key: ${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length - 4)}`);
  console.log(`📦 Player IDs: ${JSON.stringify(playerIds)}`);
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    console.error(`❌ Error Response: ${response.status} ${response.statusText}`);
    throw new Error('Failed to fetch player stats');
  }
  
  const data = await response.json();
  console.log(`✅ Success Response: Retrieved stats for ${data.data?.length || 0} players`);
  
  return data;
}