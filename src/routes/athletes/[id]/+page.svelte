<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { ChevronRight, Zap, Utensils, Bed, HeartPulse, ClipboardList, Video } from 'lucide-svelte';

	// --- MOCK DATA ---
	// In a real app, the athlete's ID would come from the URL parameter
	const athlete = { name: "Alfie's" };

	const performanceData = {
		readiness: 88,
		vo2Max: 53,
		fitness: [65, 70, 75, 80, 85, 90, 88],
		fatigue: [10, 12, 15, 8, 5, 10, 12],
		form: [-15, -12, -10, 0, 5, -2, -5]
	};

    const dailyTimeline = [
		{ time: '07:00', type: 'Biometrics', title: 'Wake Up & Record HR', icon: HeartPulse, color: 'blue' },
		{ time: '07:30', type: 'Nutrition', title: 'Breakfast', icon: Utensils, color: 'pink' },
		{ time: '17:00', type: 'Training', title: 'Strength: Lower Body', icon: Zap, color: 'cyan' },
		{ time: '21:30', type: 'Recovery', title: 'Pre-Bed Routine', icon: Bed, color: 'purple' },
	];

	const focusItems = [
		{ type: 'Feedback', title: 'Work On: Tackling Technique', link: '/atp' },
		{ type: 'Video', title: 'New Clip: Breakdown Entry', link: '/video-analysis' },
	];

	const recentWorkouts = [
		{ name: 'Total Body Strength', date: 'Yesterday', load: 120 },
		{ name: 'Tempo Run', date: '2 days ago', load: 95 }
	];

	let performanceChartCanvas: HTMLCanvasElement;
	let performanceChart: Chart;

	onMount(() => {
		if (performanceChartCanvas) {
			performanceChart = new Chart(performanceChartCanvas, {
				type: 'bar',
				data: {
					labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
					datasets: [
						{ label: 'Fitness (CTL)', data: performanceData.fitness, backgroundColor: 'rgba(57, 192, 196, 0.6)', borderColor: '#39c0c4', type: 'bar', order: 2 },
						{ label: 'Fatigue (ATL)', data: performanceData.fatigue, backgroundColor: 'rgba(239, 68, 68, 0.6)', borderColor: '#ef4444', type: 'bar', order: 3 },
						{ label: 'Form (TSB)', data: performanceData.form, borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.2)', type: 'line', fill: true, tension: 0.4, order: 1, yAxisID: 'y1' }
					]
				},
				options: {
					responsive: true, maintainAspectRatio: false,
					plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af' } } },
					scales: {
						x: { grid: { color: '#374151' }, ticks: { color: '#9ca3af' } },
						y: { grid: { color: '#374151' }, ticks: { color: '#9ca3af' }, title: { display: true, text: 'Load', color: '#9ca3af' } },
						y1: { position: 'right', grid: { display: false }, ticks: { color: '#9ca3af' }, title: { display: true, text: 'Form', color: '#9ca3af' } }
					}
				}
			});
		}
	});
</script>

<div class="space-y-8">
    <!-- Top Row: Daily Plan & Metrics -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Today's Plan -->
        <div class="lg:col-span-2 bg-gray-800 rounded-xl p-6">
            <h2 class="text-2xl font-bold mb-4">Today's Plan for {athlete.name}</h2>
            <div class="space-y-4">
                {#each dailyTimeline as item}
                    <div class="flex items-center gap-4">
                        <div class="w-12 text-sm font-semibold text-gray-400 text-right">{item.time}</div>
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-{item.color}-500/20 flex-shrink-0">
                            <svelte:component this={item.icon} class="text-{item.color}-400" size={20} />
                        </div>
                        <div>
                            <p class="font-bold text-white">{item.title}</p>
                            <p class="text-sm text-gray-400">{item.description}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Readiness -->
        <div class="bg-gray-800 rounded-xl p-6 text-center flex flex-col justify-center">
            <h3 class="text-lg font-semibold text-gray-400">Readiness</h3>
            <div class="relative w-32 h-32 mx-auto my-4">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                    <path class="text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                    <path class="text-green-500" stroke-dasharray="{performanceData.readiness}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-4xl font-bold">{performanceData.readiness}</span>
                </div>
            </div>
            <p class="text-sm text-gray-300">Ready for a high-intensity session.</p>
        </div>
    </div>

    <!-- Second Row: Performance Chart & Focus Areas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-gray-800 rounded-xl p-6 h-96">
            <h3 class="text-xl font-semibold text-white mb-4">Performance Management</h3>
            <div class="h-full pb-10">
                <canvas bind:this={performanceChartCanvas}></canvas>
            </div>
        </div>

        <div class="space-y-8">
             <div class="bg-gray-800 rounded-xl p-6">
                <h3 class="text-xl font-semibold text-white mb-4">Daily Log</h3>
                <div class="grid grid-cols-3 gap-4">
                    <button class="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition-colors"><HeartPulse class="mx-auto mb-2" /> Wellness</button>
                    <button class="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition-colors"><Utensils class="mx-auto mb-2" /> Nutrition</button>
                    <button class="bg-cyan-600 hover:bg-cyan-700 p-4 rounded-lg text-center transition-colors"><Zap class="mx-auto mb-2" /> Workout</button>
                </div>
            </div>
            <div class="bg-gray-800 rounded-xl p-6">
                <h3 class="text-xl font-semibold text-white mb-4">Key Focus Areas</h3>
                <div class="space-y-3">
                    {#each focusItems as item}
                        <a href={item.link} class="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/60 transition-colors">
                            <div class="flex items-center gap-4">
                                <svelte:component this={item.type === 'Feedback' ? ClipboardList : Video} class="text-cyan-400" size={24} />
                                <div>
                                    <p class="font-semibold text-white">{item.title}</p>
                                    <p class="text-xs text-gray-400">From your {item.type}</p>
                                </div>
                            </div>
                            <ChevronRight class="text-gray-500" />
                        </a>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
