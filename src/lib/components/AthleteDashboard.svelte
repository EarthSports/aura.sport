<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';

    // This component receives the selected athlete's data as a "prop"
    export let athlete: any;

    // --- DATA ---
    let readinessScore = 88;
    
    let vo2max = { 
        value: 52.5, 
        rating: 'Excellent',
        fitnessAge: 20,
    };

    let wearableData = {
        source: 'Whoop',
        recovery: 92,
        sleep: 89,
        strain: 14.5
    };

    // Data for the new Performance Management Chart
    let performanceManagementData = {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
        fitness: [60, 65, 70, 72, 75, 80, 82, 85], // Chronic Training Load (CTL)
        fatigue: [80, 75, 90, 60, 85, 95, 70, 65], // Acute Training Load (ATL)
        form: [-20, -10, -20, 12, -10, -15, 12, 20]  // Training Stress Balance (TSB)
    };

    let recentWorkouts = [
        { id: 1, title: 'Total Body Strength', date: 'Yesterday', load: 120 },
        { id: 2, title: 'Tempo Run', date: '2 days ago', load: 95 },
        { id: 3, title: 'Mobility & Recovery', date: '3 days ago', load: 30 }
    ];

    // --- CHART LOGIC ---
    let pmcChartCanvas: HTMLCanvasElement;

    onMount(() => {
        if (pmcChartCanvas) {
            new Chart(pmcChartCanvas, {
                type: 'line',
                data: {
                    labels: performanceManagementData.labels,
                    datasets: [
                        { 
                            label: 'Fitness (CTL)', 
                            data: performanceManagementData.fitness, 
                            borderColor: '#39c0c4', // Cyan
                            backgroundColor: '#39c0c430',
                            fill: true,
                            tension: 0.4
                        },
                        { 
                            label: 'Fatigue (ATL)', 
                            data: performanceManagementData.fatigue, 
                            borderColor: '#f87171', // Red
                            tension: 0.4
                        },
                        { 
                            label: 'Form (TSB)', 
                            data: performanceManagementData.form, 
                            type: 'bar',
                            backgroundColor: (context) => {
                                const value = context.raw as number;
                                return value >= 0 ? '#34d39980' : '#fbbf2480'; // Green for positive, Yellow for negative
                            },
                            yAxisID: 'y1'
                        },
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { position: 'bottom', labels: { color: '#9ca3af' } } 
                    },
                    scales: { 
                        y: { position: 'left', ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
                        y1: { position: 'right', ticks: { color: '#9ca3af' }, grid: { drawOnChartArea: false } }
                    }
                }
            });
        }
    });

    function getReadinessColor(score: number) {
        if (score > 85) return 'text-green-400';
        if (score > 65) return 'text-yellow-400';
        return 'text-red-400';
    }

    function getVo2MaxColor(rating: string) {
        switch(rating.toLowerCase()) {
            case 'excellent': return 'text-purple-400';
            case 'good': return 'text-green-400';
            case 'fair': return 'text-yellow-400';
            default: return 'text-red-400';
        }
    }
</script>

<div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    <!-- Left Column -->
    <div class="lg:col-span-1 flex flex-col gap-6">
        <!-- Readiness Score Card -->
        <div class="bg-gray-900 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <h3 class="text-lg font-semibold text-white mb-2">Readiness</h3>
            <div class="relative w-32 h-32">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                    <path class="stroke-current text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="3"></path>
                    <path class="stroke-current {getReadinessColor(readinessScore)}" stroke-dasharray="{readinessScore}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="3" stroke-linecap="round"></path>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-4xl font-bold {getReadinessColor(readinessScore)}">{readinessScore}</span>
                </div>
            </div>
            <p class="text-sm text-gray-400 mt-3">Ready for a high-intensity session.</p>
        </div>

        <!-- VO2 Max Dial Card -->
        <div class="bg-gray-900 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <h3 class="text-lg font-semibold text-white mb-2">Est. VO2 Max</h3>
            <div class="relative w-32 h-32">
                 <svg class="w-full h-full" viewBox="0 0 36 36">
                    <path class="stroke-current text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke-width="3"></path>
                    <path class="stroke-current {getVo2MaxColor(vo2max.rating)}"
                        stroke-dasharray="{(vo2max.value / 70) * 100} 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke-width="3"
                        stroke-linecap="round"
                    ></path>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-4xl font-bold {getVo2MaxColor(vo2max.rating)}">{vo2max.value.toFixed(0)}</span>
                    <span class="text-xs text-gray-400">ml/kg/min</span>
                </div>
            </div>
            <p class="text-sm font-semibold {getVo2MaxColor(vo2max.rating)} mt-3">{vo2max.rating}</p>
            <p class="text-xs text-gray-400">Fitness Age: {vo2max.fitnessAge}</p>
        </div>
    </div>

    <!-- Right Column -->
    <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Performance Management Chart -->
        <div class="bg-gray-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-3">Performance Management</h3>
            <div class="h-64">
                <canvas bind:this={pmcChartCanvas}></canvas>
            </div>
        </div>

        <!-- Daily Log Card -->
        <div class="bg-gray-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-3">Daily Log</h3>
            <div class="grid grid-cols-3 gap-4">
                <button class="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-center"><i class="fas fa-heartbeat fa-2x text-red-400"></i><p class="mt-2 text-sm font-semibold text-white">Log Wellness</p></button>
                <button class="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-center"><i class="fas fa-utensils fa-2x text-yellow-400"></i><p class="mt-2 text-sm font-semibold text-white">Log Nutrition</p></button>
                <button class="bg-cyan-600 hover:bg-cyan-500 p-4 rounded-lg text-center"><i class="fas fa-dumbbell fa-2x text-white"></i><p class="mt-2 text-sm font-semibold text-white">Start Live Workout</p></button>
            </div>
        </div>
    </div>

    <!-- Full Width Row: Recent Workouts -->
    <div class="lg:col-span-3">
        <div class="bg-gray-900 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-3">Recent Workouts</h3>
            <div class="space-y-3">
                {#each recentWorkouts as workout}
                    <div class="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <p class="font-semibold text-white">{workout.title}</p>
                            <p class="text-xs text-gray-400">{workout.date}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-semibold text-cyan-400">{workout.load}</p>
                            <p class="text-xs text-gray-500">Training Load</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
