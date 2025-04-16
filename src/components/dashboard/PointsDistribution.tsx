'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface PointsData {
  id: number;
  name: string;
  points: number;
}

export default function PointsDistribution({ data }: { data: PointsData[] }) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!data || !chartRef.current) return;
    
    // Clear previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Sort and limit to top 15 players by points
    const sortedData = [...data].sort((a, b) => b.points - a.points).slice(0, 15);
    
    const playerNames = sortedData.map(player => player.name);
    const playerPoints = sortedData.map(player => player.points);
    
    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: playerNames,
        datasets: [
          {
            label: 'Points Per Game',
            data: playerPoints,
            backgroundColor: 'rgba(29, 140, 170, 0.8)', // Hornets teal
            borderColor: 'rgba(29, 140, 170, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Points Per Game by Player',
            color: 'white'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = typeof context.raw === 'number' ? context.raw : 0;
                return `${value.toFixed(1)} PPG`;
              }
            }
          },
          legend: {
            labels: {
              color: 'white'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Points Per Game',
              color: 'white'
            },
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
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
  }, [data]);
  
  return (
    <div className="h-[400px] bg-black rounded-lg p-4">
      <canvas ref={chartRef} />
    </div>
  );
} 