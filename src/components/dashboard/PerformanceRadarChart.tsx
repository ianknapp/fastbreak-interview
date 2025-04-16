'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

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

export default function PerformanceRadarChart({ player }: { player: PlayerStats }) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!player || !player.stats || !chartRef.current) return;
    
    // Clear previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const stats = player.stats;
    
    // Create dataset for radar chart with normalized values
    // We'll create two separate datasets - one for regular stats and one for percentages
    const regularStats = [
      Math.min(stats.pts, 20),  // Cap points at 20
      Math.min(stats.reb, 20),  // Cap rebounds at 20
      Math.min(stats.ast, 20),  // Cap assists at 20
      Math.min(stats.stl, 20),  // Cap steals at 20
      Math.min(stats.blk, 20),  // Cap blocks at 20
    ];
    
    const percentageStats = [
      stats.fg_pct * 100,
      stats.fg3_pct * 100,
      stats.ft_pct * 100
    ];
    
    // Labels for each type of stat
    const regularLabels = ['Points', 'Rebounds', 'Assists', 'Steals', 'Blocks'];
    const percentageLabels = ['FG%', '3PT%', 'FT%'];
    
    // Combine the datasets
    const data = {
      labels: [...regularLabels, ...percentageLabels],
      datasets: [
        {
          label: player.name,
          data: [...regularStats, ...percentageStats],
          backgroundColor: 'rgba(29, 140, 170, 0.2)', // Hornets teal
          borderColor: 'rgba(29, 140, 170, 1)',
          pointBackgroundColor: 'rgba(32, 23, 71, 1)', // Hornets purple
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(29, 140, 170, 1)'
        }
      ]
    };
    
    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              display: true,
              color: 'rgba(255, 255, 255, 0.2)'
            },
            suggestedMin: 0,
            suggestedMax: 100, // Max for percentages is 100
            pointLabels: {
              color: 'white',
              font: {
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)'
            },
            ticks: {
              color: 'white',
              backdropColor: 'transparent',
              // Custom callback to show tick values
              callback: function(tickValue: string | number) {
                // Convert to number and only show multiples of 5
                const value = Number(tickValue);
                return !isNaN(value) && value % 5 === 0 ? value : '';
              }
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: `${player.name} Performance Overview`,
            color: 'white'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                if (typeof context.raw !== 'number') return '';
                
                const index = context.dataIndex;
                const value = context.raw;
                const labels = context.chart.data.labels;
                const label = labels && Array.isArray(labels) && index < labels.length 
                  ? String(labels[index]) 
                  : '';
                
                // Format based on the category
                if (label && typeof label === 'string' && label.includes('%')) {
                  return `${label}: ${value.toFixed(1)}%`;
                }
                return `${label}: ${value.toFixed(1)}`;
              }
            }
          },
          legend: {
            labels: {
              color: 'white'
            }
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [player]);
  
  if (!player || !player.stats) {
    return <div>No player data available</div>;
  }
  
  return (
    <div className="h-[400px] bg-black rounded-lg p-4">
      <canvas ref={chartRef} />
    </div>
  );
} 