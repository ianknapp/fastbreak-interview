'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface ShootingData {
  id: number;
  name: string;
  fg_pct: number;
  fg3_pct: number;
}

export default function ShootingEfficiency({ data }: { data: ShootingData[] }) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!data || !chartRef.current) return;
    
    // Clear previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Sort data by FG percentage
    const sortedData = [...data].sort((a, b) => b.fg_pct - a.fg_pct).slice(0, 10);
    
    const playerNames = sortedData.map(player => player.name);
    const fgPercentages = sortedData.map(player => player.fg_pct * 100);
    const fg3Percentages = sortedData.map(player => player.fg3_pct * 100);
    
    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: playerNames,
        datasets: [
          {
            label: 'FG%',
            data: fgPercentages,
            backgroundColor: 'rgba(29, 140, 170, 0.8)', // Hornets teal
            borderColor: 'rgba(29, 140, 170, 1)',
            borderWidth: 1
          },
          {
            label: '3PT%',
            data: fg3Percentages,
            backgroundColor: 'rgba(32, 23, 71, 0.8)', // Hornets purple
            borderColor: 'rgba(32, 23, 71, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Shooting Efficiency',
            color: 'white'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = typeof context.raw === 'number' ? context.raw : 0;
                return `${context.dataset.label}: ${value.toFixed(1)}%`;
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
          x: {
            min: 0,
            max: 100,
            title: {
              display: true,
              text: 'Percentage',
              color: 'white'
            },
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
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