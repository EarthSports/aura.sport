<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { Zap, Utensils, Bed, ClipboardList, Video, ChevronRight, Users, User, HeartPulse } from 'lucide-svelte';
	import { analysisView } from '$lib/stores/viewStore'; // Import the store

	// --- MOCK DATA ---
	const athlete = { name: 'Alfie' };

	// --- Individual Data ---
	const dailyTimeline = [
		{ time: '07:00', type: 'Biometrics', title: 'Wake Up & Record HR', icon: HeartPulse, color: 'blue' },
		{ time: '07:30', type: 'Nutrition', title: 'Breakfast', icon: Utensils, color: 'pink' },
		{ time: '17:00', type: 'Training', title: 'Strength: Lower Body', icon: Zap, color: 'cyan' },
		{ time: '21:30', type: 'Recovery', title: 'Pre-Bed Routine', icon: Bed, color: 'purple' },
	];
	const weeklyLoad = { planned: 1850, completed: 1230, projection: 1950 };
	const weeklyLoadPercentage = Math.min((weeklyLoad.completed / weeklyLoad.planned) * 100, 100);
	const focusItems = [
		{ type: 'Feedback', title: 'Work On: Tackling Technique', link: '/atp' },
		{ type: 'Video', title: 'New Clip: Breakdown Entry', link: '/video-analysis' },
	];

	// --- Team Data ---
	const teamKPIs = {
		compliance: { value: 92, trend: 3 },
		readiness: { value: 7.8, trend: -0.2 },
		athletesToWatch: [
			{ name: 'Harry Allies', reason: 'Low Readiness (5.5)' },
			{ name: 'Ben Earl', reason: 'High Load Spike (+25%)' },
		]
	};

	let zoneChartCanvas: HTMLCanvasElement;
	let readinessChartCanvas: HTMLCanvasElement;
	let zoneChart: Chart;
	let readinessChart: Chart;

	function renderCharts() {
		// Destroy existing charts if they exist
		if (zoneChart) zoneChart.destroy();
		if (readinessChart) readinessChart.destroy();

		// Individual Zone Chart
		if (zoneChartCanvas) {
			zoneChart = new Chart(zoneChartCanvas, {
				type: 'bar',
				data: {
					labels: ['Zone 1/2', 'Zone 3', 'Zone 4', 'Zone 5'],
					datasets: [{
						label: 'Time in Zone', data: [120, 45, 25, 8],
						backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'],
						borderWidth: 0, borderRadius: 4,
					}]
				},
				options: {
					indexAxis: 'y', responsive: true, maintainAspectRatio: false,
					plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.raw} minutes` } } },
					scales: {
						x: { grid: { color: '#374151' }, ticks: { color: '#9ca3af' }, title: { display: true, text: 'Minutes', color: '#9ca3af'} },
						y: { grid: { display: false }, ticks: { color: '#9ca3af' } }
					}
				}
			});
		}

		// Team Readiness Chart
		if (readinessChartCanvas) {
			readinessChart = new Chart(readinessChartCanvas, {
				type: 'line',
				data: {
					labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					datasets: [{
						label: 'Team Readiness Trend', data: [7.5, 8.0, 7.2, 8.5, 8.1, 7.8, 9.0],
						borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.2)',
						fill: true, tension: 0.4
					}]
				},
				options: {
					responsive: true, maintainAspectRatio: false,
					plugins: { legend: { display: false } },
					scales: {
						y: { beginAtZero: false, min: 5, max: 10, grid: { color: '#374151' }, ticks: { color: '#9ca3af' } },
						x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
					}
				}
			});
		}
	}

	onMount(() => {
		renderCharts();
	});

	$: {
		// Re-render charts when the view changes to ensure correct canvas is targeted
		if (readinessChartCanvas || zoneChartCanvas) {
			renderCharts();
		}
	}

</script>

<div class="text-white space-y-8">
	<!-- TEAM VIEW -->
	{#if $analysisView === 'team'}
		<div class="space-y-8">
			<!-- KPI Widgets -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div class="bg-gray-800 p-6 rounded-xl">
					<h4 class="text-sm font-medium text-gray-400">Compliance Score</h4>
					<p class="text-3xl font-bold text-green-400 mt-2">{teamKPIs.compliance.value}%</p>
				</div>
				<div class="bg-gray-800 p-6 rounded-xl">
					<h4 class="text-sm font-medium text-gray-400">Avg. Readiness (7d)</h4>
					<p class="text-3xl font-bold text-yellow-400 mt-2">{teamKPIs.readiness.value}</p>
				</div>
				<div class="bg-gray-800 p-6 rounded-xl">
					<h4 class="text-sm font-medium text-gray-400">Athletes to Watch</h4>
					<p class="text-3xl font-bold text-red-400 mt-2">{teamKPIs.athletesToWatch.length}</p>
				</div>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div class="lg:col-span-2 bg-gray-800 p-6 rounded-xl">
					<h3 class="text-xl font-semibold text-white mb-4">Team Readiness Trend</h3>
					<div class="h-80">
						<canvas bind:this={readinessChartCanvas}></canvas>
					</div>
				</div>
				<div class="bg-gray-800 p-6 rounded-xl">
					<h3 class="text-xl font-semibold text-white mb-4">Athletes to Watch</h3>
					<div class="space-y-3">
						{#each teamKPIs.athletesToWatch as athlete}
							<div class="bg-gray-900/50 p-4 rounded-lg">
								<p class="font-bold text-white">{athlete.name}</p>
								<p class="text-sm text-red-400">{athlete.reason}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- INDIVIDUAL VIEW -->
	{#if $analysisView === 'individual'}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Left Column: Daily Timeline & Focus -->
			<div class="lg:col-span-2 space-y-8">
				<!-- Today's Plan -->
				<div class="bg-gray-800 rounded-xl p-6">
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
				<!-- Key Focus Areas -->
				<div class="bg-gray-800 rounded-xl p-6">
					<h2 class="text-2xl font-bold mb-4">Key Focus Areas</h2>
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
			<!-- Right Column: Weekly Load & Zone Distribution -->
			<div class="lg:col-span-1 space-y-8">
				<!-- This Week's Load -->
				<div class="bg-gray-800 rounded-xl p-6">
					<h2 class="text-2xl font-bold mb-4">This Week's Load</h2>
					<div class="relative w-48 h-48 mx-auto">
						<svg class="w-full h-full" viewBox="0 0 36 36">
							<path class="text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
							<path class="text-cyan-500" stroke-dasharray="{weeklyLoadPercentage}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
						</svg>
						<div class="absolute inset-0 flex flex-col items-center justify-center">
							<span class="text-3xl font-bold">{weeklyLoad.completed}</span>
							<span class="text-gray-400">/ {weeklyLoad.planned} AU</span>
						</div>
					</div>
					<p class="text-center text-sm text-gray-400 mt-4">Projected to hit <span class="font-bold text-white">{weeklyLoad.projection} AU</span> this week.</p>
				</div>
				<!-- Zone Distribution -->
				<div class="bg-gray-800 rounded-xl p-6">
					<h2 class="text-2xl font-bold mb-4">Weekly Zone Distribution</h2>
					<div class="h-48">
						<canvas bind:this={zoneChartCanvas}></canvas>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
