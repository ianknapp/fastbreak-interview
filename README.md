# Charlotte Hornets Stats Dashboard

A modern, interactive web application for viewing and analyzing Charlotte Hornets player statistics and team performance metrics.

## Features

- **Authentication**: Secure login system powered by Auth0
- **Interactive Dashboard**: Visualizes key Hornets player and team statistics
- **Responsive Design**: Optimized for both desktop and mobile viewing
- **Real-time Data**: Fetches current season stats from the NBA API

### Dashboard Components

1. **Player Leaderboard**
   - Top 5 players across various statistical categories
   - Sortable by points, rebounds, assists, steals, blocks, and shooting percentages
   - Dropdown menu for selecting different stat categories

2. **Shooting Efficiency Chart**
   - Horizontal bar chart comparing field goal and 3-point percentages
   - Visual comparison of the team's top 10 shooters

3. **Points Distribution Chart**
   - Bar chart displaying average points per game for all players
   - Clearly visualizes the team's scoring hierarchy

4. **Player Performance Radar Chart**
   - Comprehensive visualization of a player's all-around performance
   - Player selection dropdown for comparing different team members
   - Displays points, rebounds, assists, steals, blocks, and shooting percentages

## Technology Stack

- **Frontend**: React.js with Next.js framework
- **Authentication**: Auth0 integration
- **Styling**: Tailwind CSS
- **Data Visualization**: Chart.js
- **API Integration**: Custom API endpoints connecting to BallDontLie NBA API
- **TypeScript**: For type safety and improved developer experience

## Project Structure

- `src/app`: Next.js app router pages and layouts
- `src/components`: React components, including dashboard visualizations
- `src/lib/api`: API utility functions for fetching NBA data
- `src/types`: TypeScript type definitions
- `src/hooks`: Custom React hooks for data fetching
- `public`: Static assets including team logo and images

## API Architecture

The dashboard consumes data from custom API endpoints that fetch and transform NBA statistics:

- `/api/nba/stats`: Fetches and processes all Hornets player statistics
  - Retrieves data from the BallDontLie API
  - Calculates player averages and leaderboards
  - Optimizes data format for frontend visualization

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   AUTH0_SECRET='your-auth0-secret'
   AUTH0_BASE_URL='http://localhost:3000'
   AUTH0_ISSUER_BASE_URL='your-auth0-domain'
   AUTH0_CLIENT_ID='your-auth0-client-id'
   AUTH0_CLIENT_SECRET='your-auth0-client-secret'
   BALLDONTLIE_API_KEY='your-balldontlie-api-key'
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application is optimized for deployment on Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Vercel
3. Configure the environment variables
4. Deploy

## Credits

- Player statistics provided by [BallDontLie API](https://www.balldontlie.io)
- Charlotte Hornets logo and branding used for educational purposes
