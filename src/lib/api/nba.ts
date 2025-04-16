const BASE_URL = 'https://api.balldontlie.io/v1';
const API_KEY = '0cae7c5c-c68a-4ef8-b530-90caa739f109';

const headers = {
  'Authorization': API_KEY
};

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