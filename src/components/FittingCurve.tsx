import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface FittingCurveProps {
    accuracy: number[];
}

const CDEFGAB = "CDEFGAB";

// 三次样条插值：生成平滑曲线经过所有点
function splineInterpolate(points: { x: number; y: number }[], numPoints: number = 100): { x: number; y: number }[] {
    if (points.length < 2) return points;
    
    const result: { x: number; y: number }[] = [];
    const n = points.length;
    
    // 自然三次样条插值
    // 解三对角矩阵
    const h: number[] = [];
    for (let i = 0; i < n - 1; i++) {
        h.push(points[i + 1].x - points[i].x);
    }
    
    const alpha: number[] = [0];
    for (let i = 1; i < n - 1; i++) {
        alpha.push(3 / h[i] * (points[i + 1].y - points[i].y) - 3 / h[i - 1] * (points[i].y - points[i - 1].y));
    }
    
    const l: number[] = [1];
    const mu: number[] = [0];
    const z: number[] = [0];
    
    for (let i = 1; i < n - 1; i++) {
        l.push(2 * (points[i + 1].x - points[i - 1].x) - h[i - 1] * mu[i - 1]);
        mu.push(h[i] / l[i]);
        z.push((alpha[i] - h[i - 1] * z[i - 1]) / l[i]);
    }
    
    l.push(1);
    z.push(0);
    
    const c: number[] = new Array(n).fill(0);
    const b: number[] = new Array(n).fill(0);
    const d: number[] = new Array(n).fill(0);
    
    for (let j = n - 2; j >= 0; j--) {
        c[j] = z[j] - mu[j] * c[j + 1];
        b[j] = (points[j + 1].y - points[j].y) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3;
        d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
    }
    
    // 生成插值点
    const xMin = points[0].x;
    const xMax = points[n - 1].x;
    const step = (xMax - xMin) / (numPoints - 1);
    
    for (let i = 0; i < numPoints; i++) {
        const x = xMin + i * step;
        
        // 找到对应的区间
        let j = 0;
        for (let k = 0; k < n - 1; k++) {
            if (x >= points[k].x && x <= points[k + 1].x) {
                j = k;
                break;
            }
        }
        
        // 计算样条值
        const dx = x - points[j].x;
        const y = points[j].y + b[j] * dx + c[j] * dx * dx + d[j] * dx * dx * dx;
        result.push({ x, y });
    }
    
    return result;
}

export default function FittingCurve({ accuracy }: FittingCurveProps) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const labelsRef = useRef<string[]>([]);

    // 初始化图表（只执行一次）
    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        chartInstanceRef.current = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: '样条曲线',
                        data: [],
                        borderColor: 'rgba(239, 68, 68, 1)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        showLine: true,
                        fill: false,
                        order: 1,
                    },
                    {
                        label: '实际准确率',
                        data: [],
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        showLine: false,
                        order: 2,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false, // 禁用动画，防止跳动
                plugins: {
                    title: {
                        display: true,
                        text: '音准准确率样条曲线',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const x = context.parsed.x;
                                const y = context.parsed.y;
                                if (y === null) return '';
                                const note = x !== null && x >= 0 && x < labelsRef.current.length ? labelsRef.current[Math.round(x)] : '';
                                return `${note}: ${y.toFixed(2)}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        min: -0.5,
                        max: 6.5,
                        title: {
                            display: true,
                            text: '音符'
                        },
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                const idx = Math.round(value as number);
                                if (idx >= 0 && idx < labelsRef.current.length) {
                                    return labelsRef.current[idx];
                                }
                                return null;
                            }
                        },
                        grid: {
                            display: true
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '准确率 (%)'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, []);

    // 数据更新（不重建图表）
    useEffect(() => {
        const chart = chartInstanceRef.current;
        if (!chart || accuracy.length === 0) return;

        const labels = CDEFGAB.split('').slice(0, accuracy.length);
        labelsRef.current = labels;
        
        const originalData = accuracy.map((acc, index) => ({
            x: index,
            y: acc
        }));

        const splinePoints = splineInterpolate(originalData, 100);

        // 更新数据
        chart.data.datasets[0].data = splinePoints;
        chart.data.datasets[1].data = originalData;
        
        // 更新 x 轴范围
        if (chart.options.scales?.x) {
            chart.options.scales.x.max = accuracy.length - 0.5;
        }

        chart.update('none'); // 'none' 模式不动画，立即更新
    }, [accuracy]);

    return (
        <div className="w-full max-w-2xl">
            <div className="w-full h-80">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}
