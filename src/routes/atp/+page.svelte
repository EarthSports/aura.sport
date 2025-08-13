<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Chart from 'chart.js/auto';
	import { Calendar, FileDown, Bot, X, Users, User, ChevronDown, Video, Upload, BrainCircuit, ChevronsUpDown, Lightbulb, PlusCircle, Brain, Zap, Utensils, HeartPulse, Wind, ClipboardList, Bed, Sun } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	// --- MOCK DATA & MODELS ---
	const mockAthletes = [
		{ id: 1, name: 'Max Hooper', position: 'Fly-half', group: 'Backs', status: 'Full Training' },
		{ id: 2, name: 'William Jordan-Willis', position: 'Back Row', group: 'Forwards', status: 'Full Training' },
		{ id: 3, name: 'Harry Allies', position: 'Prop', group: 'Forwards', status: 'Rehab' },
		{ id: 4, name: 'Henry Sui', position: 'Centre', group: 'Backs', status: 'Prehab' },
		{ id: 5, name: 'Frederick Lomas', position: 'Back Row', group: 'Forwards', status: 'Full Training' },
		{ id: 6, name: 'Caspar Dalby-Welsh', position: 'Back Row', group: 'Forwards', status: 'Full Training' },
		{ id: 7, name: 'Charlie Day', position: 'Centre', group: 'Backs', status: 'Extra Skills' }
	];

	const mockFeedback = {
		3: {
			athleteName: 'Harry Allies',
			superStrength: 'Ball Carry & Contact',
			superStrengthSuggestion: 'Develop your ability to make effective decisions post-contact. Focus on offloading skills in tight spaces to create opportunities for teammates.',
			workOn: 'Tackling Technique',
			workOnSuggestion: 'Focus on your footwork and shoulder contact in 1-on-1 tackling drills. Aim for consistency in your tackle height and wrapping the arms securely.'
		}
	};


	const generateSessionsForWeek = (week, athlete) => {
		// This now represents the GENERIC team plan
		let baseSessions = [
            { id: `team-mon-${week?.week}`, day: 'Monday PM', time: '17:00 - 18:30', type: 'Strength', focus: 'Team Lower Body Strength', nutritionFocus: 'High Protein & Calorie Surplus', exercises: [] },
            { id: `team-tue-${week?.week}`, day: 'Tuesday', time: '09:00 - 10:30', type: 'Conditioning', focus: 'Team Conditioning', nutritionFocus: 'Carb Loading & Hydration', exercises: [] },
            { id: `team-wed-${week?.week}`, day: 'Wednesday', time: 'N/A', type: 'Rest', focus: 'Active Recovery', nutritionFocus: 'Recovery & Micronutrients', exercises: [] },
            { id: `team-thu-${week?.week}`, day: 'Thursday PM', time: '17:00 - 18:30', type: 'Strength', focus: 'Team Upper Body Strength', nutritionFocus: 'High Protein & Calorie Surplus', exercises: [] },
            { id: `team-fri-${week?.week}`, day: 'Friday', time: '10:00 - 11:30', type: 'Pitch Session', focus: 'Team Practice', nutritionFocus: 'Pre-Game Fueling', exercises: [] },
            { id: `team-sat-${week?.week}`, day: 'Saturday PM', time: '14:00', type: 'Match Day', focus: week?.event || 'Internal Game', nutritionFocus: 'Match Day Fueling & Recovery', exercises: [] },
            { id: `team-sun-${week?.week}`, day: 'Sunday', time: 'N/A', type: 'Rest', focus: 'Full Rest', nutritionFocus: 'Recovery & Hydration', exercises: [] },
        ];

		if (!athlete) return baseSessions;
        let individualized = baseSessions.map(s => ({ ...s }));
        // Basic individualization can still happen here, but the main changes will come from the AI planner
        if (athlete.status === 'Rehab') {
            individualized = individualized.map(s => s.type === 'Strength' ? { ...s, type: 'Rehab', focus: 'Physio-led Rehab Circuit', tag: 'Rehab'} : s);
        }
        return individualized;
	}

	const generateATPData = () => {
		let weeks = [];
		const phases = [ { name: 'Prep Phase', duration: 8, color: 'rgba(59, 130, 246, 0.1)', borderColor: '#3B82F6' }, { name: 'Rugby Development', duration: 12, color: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' }, { name: 'Competition', duration: 20, color: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444' }, { name: 'Peaking', duration: 4, color: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B' }, { name: 'Recovery', duration: 4, color: 'rgba(107, 114, 128, 0.1)', borderColor: '#6B7280' }, { name: 'R & R', duration: 4, color: 'rgba(168, 85, 247, 0.1)', borderColor: '#A855F7' } ];
		const events = [ { week: 7, name: 'Pre-Season Friendly' }, { week: 15, name: 'Saracens (A)' }, { week: 16, name: 'Harlequins (H)' }, { week: 24, name: 'Academy Finals Day' }, { week: 35, name: '7s Tournament' } ];
		let weekCounter = 1;
		let lastLoad = { all: 300, forwards: 320, backs: 280 };
		let form = { all: -5, forwards: -6, backs: -4 };
		phases.forEach(phase => {
			for (let i = 1; i <= phase.duration; i++) {
				let plannedLoad = {};
				['all', 'forwards', 'backs'].forEach(group => {
					let load = lastLoad[group];
					if (i % 4 === 0) load *= (0.65 + Math.random() * 0.1); else load *= (1.05 + Math.random() * 0.05);
					if(group === 'forwards') load *= 1.05; if(group === 'backs') load *= 0.95;
					plannedLoad[group] = Math.round(load);
					form[group] += (lastLoad[group] / 100) - (plannedLoad[group] / 80);
				});
				weeks.push({ week: weekCounter, period: phase.name, plannedLoad, actualLoad: { all: Math.random() > 0.3 ? Math.round(plannedLoad.all * (0.9 + Math.random() * 0.2)) : null, forwards: Math.random() > 0.3 ? Math.round(plannedLoad.forwards * (0.9 + Math.random() * 0.2)) : null, backs: Math.random() > 0.3 ? Math.round(plannedLoad.backs * (0.9 + Math.random() * 0.2)) : null, }, form: { all: Math.round(form.all), forwards: Math.round(form.forwards), backs: Math.round(form.backs) }, event: events.find(e => e.week === weekCounter)?.name || null, });
				lastLoad = plannedLoad;
				weekCounter++;
			}
		});
		return { weeks, phases };
	};

	const atpData = generateATPData();
	let chartCanvas: HTMLCanvasElement;
	let chart: Chart;
	let selectedWeek = null;
	let filter = 'all';
	let modalView = 'squad';
	let selectedAthleteId = mockAthletes[0].id;
	let showIdpModal = false;
	let showFeedbackModal = false;
	let showDayDetailModal = false;
	let selectedDaySession = null;
	let idpGoal = '';

	$: selectedAthlete = mockAthletes.find(a => a.id === selectedAthleteId);
	$: athleteFeedback = mockFeedback[selectedAthleteId];
	
    let weeklySessionsStore = {};
	$: {
		if (selectedWeek) {
			if (!weeklySessionsStore[selectedWeek.week]) weeklySessionsStore[selectedWeek.week] = {};
			if (!weeklySessionsStore[selectedWeek.week]['squad']) weeklySessionsStore[selectedWeek.week]['squad'] = generateSessionsForWeek(selectedWeek, null);
			if (!weeklySessionsStore[selectedWeek.week][selectedAthleteId]) weeklySessionsStore[selectedWeek.week][selectedAthleteId] = generateSessionsForWeek(selectedWeek, selectedAthlete);
		}
	}
	$: weeklySessions = selectedWeek ? (modalView === 'squad' ? weeklySessionsStore[selectedWeek.week]['squad'] : weeklySessionsStore[selectedWeek.week][selectedAthleteId]) : [];

	const getTagColor = (tag) => {
        switch(tag) {
            case 'Rehab': return 'bg-red-500'; case 'Prehab': return 'bg-yellow-500'; case 'Extra': return 'bg-blue-500';
			case 'Speed': return 'bg-green-500'; case 'Cognitive': return 'bg-purple-500'; case 'Power': return 'bg-orange-500';
			case 'Hypertrophy': return 'bg-blue-500'; case 'Nutrition': return 'bg-pink-500'; case 'Eccentric': return 'bg-teal-500';
			case 'Endurance': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    }
	const getPeriodColor = (period) => atpData.phases.find(p => p.name === period)?.borderColor || '#6B7280';
	function handleWeekClick(week) { selectedWeek = week; }
	function handleKeydown(event: KeyboardEvent, week) { if (event.key === 'Enter' || event.key === ' ') { handleWeekClick(week); } }
	
	function viewDayDetail(session) {
		selectedDaySession = session;
		showDayDetailModal = true;
	}

	function applyMesoCycle(type) {
		if (!selectedWeek) return;
		let newSchedule = [];
		if (type === 'hypertrophy') {
			newSchedule = [
				{ id: `idp-hyper1-w${selectedWeek.week}`, day: 'Monday PM', time: '17:00 - 18:30', type: 'Strength', focus: 'Hypertrophy: Lower Body', nutritionFocus: 'High Protein & Calorie Surplus', tag: 'Hypertrophy', exercises: [] },
				{ id: `idp-hyper2-w${selectedWeek.week}`, day: 'Tuesday', time: '17:00 - 18:30', type: 'Strength', focus: 'Hypertrophy: Upper Body (Push)', nutritionFocus: 'High Protein & Calorie Surplus', tag: 'Hypertrophy', exercises: [] },
				{ ...weeklySessions.find(s => s.day.startsWith('Wednesday')) },
				{ id: `idp-hyper3-w${selectedWeek.week}`, day: 'Thursday PM', time: '17:00 - 18:30', type: 'Strength', focus: 'Hypertrophy: Upper Body (Pull)', nutritionFocus: 'High Protein & Calorie Surplus', tag: 'Hypertrophy', exercises: [] },
				{ ...weeklySessions.find(s => s.day.startsWith('Friday')) },
				{ ...weeklySessions.find(s => s.day.startsWith('Saturday')) },
				{ ...weeklySessions.find(s => s.day.startsWith('Sunday')), focus: 'Rest & Nutrition Focus', tag: 'Nutrition' },
			];
		}
		weeklySessionsStore[selectedWeek.week][selectedAthleteId] = newSchedule;
		showIdpModal = false;
	}

	function renderChart() {
		if (chart) chart.destroy();
		const chartData = { labels: atpData.weeks.map(w => `W${w.week}`), datasets: [ { type: 'bar', label: 'Actual Load', data: atpData.weeks.map(w => w.actualLoad[filter]), backgroundColor: '#0e7490', borderColor: '#0891b2', borderWidth: 1, order: 3, barPercentage: 0.6 }, { type: 'bar', label: 'Planned Load', data: atpData.weeks.map(w => w.plannedLoad[filter]), backgroundColor: '#374151', borderColor: '#4b5563', borderWidth: 1, order: 4, barPercentage: 0.6 }, { label: 'Form (TSB)', type: 'line', data: atpData.weeks.map(w => w.form[filter]), borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.1)', tension: 0.4, yAxisID: 'y1', order: 1, fill: true } ] };
		const options = { responsive: true, maintainAspectRatio: false, onClick: (evt, elements) => { if (elements.length > 0) handleWeekClick(atpData.weeks[elements[0].index]); }, plugins: { legend: { position: 'top', labels: { color: '#9ca3af', boxWidth: 12, padding: 20 } }, tooltip: { mode: 'index', intersect: false, backgroundColor: '#1f2937', titleColor: '#e5e7eb', bodyColor: '#d1d5db' }, }, scales: { x: { ticks: { color: '#9ca3af', autoSkip: true, maxTicksLimit: 26 }, grid: { display: false } }, y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Load (AU)', color: '#9ca3af' }, ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }, y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Form (TSB)', color: '#9ca3af' }, ticks: { color: '#9ca3af' }, grid: { display: false } } } };
		chart = new Chart(chartCanvas, { type: 'bar', data: chartData, options });
	}

	onMount(() => { renderChart(); });
	$: if (chartCanvas) renderChart();

	$: dailyTimeline = selectedDaySession ? [
		{ time: '07:00', type: 'Biometrics', title: 'Wake Up & Record HR', description: 'Record your resting heart rate upon waking.', color: 'blue' },
		{ time: '07:30', type: 'Nutrition', title: 'Breakfast', description: 'Fuel for the day ahead. Focus on complex carbs and protein.', color: 'pink' },
		{ time: '08:00', type: 'Hydration', title: 'Hydration', description: 'Drink 500ml of water.', color: 'cyan' },
		{ time: selectedDaySession.time, type: 'Training', title: selectedDaySession.type, description: selectedDaySession.focus, color: getTagColor(selectedDaySession.tag || selectedDaySession.type) },
		{ time: '12:30', type: 'Nutrition', title: 'Lunch', description: 'Balanced meal to refuel and recover.', color: 'pink' },
		{ time: '16:00', type: 'Nutrition', title: 'Snack', description: 'High-protein snack to support muscle repair.', color: 'pink' },
		{ time: '19:00', type: 'Nutrition', title: 'Dinner', description: 'Final meal of the day. Focus on protein and vegetables.', color: 'pink' },
		{ time: '21:00', type: 'Recovery', title: 'Pre-Bed Routine', description: 'Mobility, reading, and no screens.', color: 'purple' },
		{ time: '21:30', type: 'Nutrition', title: 'Pre-Bed Nutrition', description: 'Casein protein shake or cottage cheese.', color: 'pink' },
	].sort((a, b) => a.time.localeCompare(b.time)) : [];

</script>

<div class="bg-gray-900 text-white min-h-screen font-sans p-4 lg:p-8">
	<div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6 h-[92vh] flex flex-col backdrop-blur-sm">
		<div class="flex flex-wrap justify-between items-center mb-4 flex-shrink-0 gap-4">
			<h2 class="text-3xl font-bold text-white">Annual Training Plan: U18s 2025-2026</h2>
			<div class="flex items-center gap-2">
				<div class="relative">
					<select bind:value={filter} class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 pl-4 pr-8 rounded-lg appearance-none cursor-pointer">
						<option value="all">All Squad</option><option value="forwards">Forwards</option><option value="backs">Backs</option>
					</select>
					<div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><ChevronDown size={16} /></div>
				</div>
				<button class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"><Bot class="mr-2" size={16} /> AI Plan Builder</button>
			</div>
		</div>
		<div class="flex-shrink-0 h-80 md:h-96 mb-6"><canvas bind:this={chartCanvas}></canvas></div>
		<div class="overflow-y-auto flex-grow bg-gray-900/50 rounded-lg">
			<table class="w-full text-left">
				<thead class="bg-gray-800 sticky top-0 z-10">
					<tr class="text-sm font-semibold text-gray-400">
						<th class="p-3">Week</th><th class="p-3">Period</th><th class="p-3">Planned Load</th>
						<th class="p-3">Actual Load</th><th class="p-3">Form (TSB)</th><th class="p-3">Event</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					{#each atpData.weeks as week (week.week)}
						<tr class="hover:bg-gray-800/60 cursor-pointer" on:click={() => handleWeekClick(week)} on:keydown={(e) => handleKeydown(e, week)} role="button" tabindex="0">
							<td class="p-3 font-medium text-white">{week.week}</td>
							<td class="p-3"><span class="px-3 py-1 text-xs font-semibold rounded-full text-white" style="background-color: {getPeriodColor(week.period)}">{week.period}</span></td>
							<td class="p-3 text-gray-300">{week.plannedLoad[filter]}</td>
							<td class="p-3 text-cyan-400">{week.actualLoad[filter] || '-'}</td>
							<td class="p-3 font-mono {week.form[filter] >= 0 ? 'text-green-400' : 'text-yellow-400'}">{week.form[filter]}</td>
							<td class="p-3 text-yellow-400 text-xs">{week.event || ''}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Week Detail Modal -->
	{#if selectedWeek}
		<div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" on:click={() => (selectedWeek = null)} on:keydown={(e) => e.key === 'Escape' && (selectedWeek = null)} role="dialog" aria-modal="true">
			<div class="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-3xl border border-gray-700 flex flex-col" on:click|stopPropagation role="document">
				<div class="flex justify-between items-center mb-2"><h3 class="text-2xl font-bold text-white">Week {selectedWeek.week}: {selectedWeek.period}</h3><button on:click={() => (selectedWeek = null)} class="text-gray-400 hover:text-white"><X size={24} /></button></div>
				<div class="flex items-center border-b border-gray-700 mb-4">
                    <button on:click={() => modalView = 'squad'} class="px-4 py-2 text-sm font-medium flex items-center gap-2 {modalView === 'squad' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}"><Users size={16}/> Squad Plan</button>
                    <button on:click={() => modalView = 'individual'} class="px-4 py-2 text-sm font-medium flex items-center gap-2 {modalView === 'individual' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}"><User size={16}/> Individual Plan</button>
                </div>
				{#if modalView === 'individual'}
                    <div class="mb-4 flex justify-between items-center gap-2">
						<select bind:value={selectedAthleteId} class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2">
							{#each mockAthletes as a (a.id)}<option value={a.id}>{a.name} ({a.position}) - {a.status}</option>{/each}
						</select>
						{#if athleteFeedback}
						<button on:click={() => showFeedbackModal = true} class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 flex-shrink-0">
							<ClipboardList size={16}/> View Feedback
						</button>
						{/if}
						<button on:click={() => showIdpModal = true} class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 flex-shrink-0">
							<PlusCircle size={16}/> Plan with AI
						</button>
					</div>
                {/if}
				<div class="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {#each weeklySessions as session (session.id)}
                        <div class="bg-gray-900/80 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-700/60" on:click={() => viewDayDetail(session)} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && viewDayDetail(session)} role="button" tabindex="0">
                            <div>
                                <p class="font-bold text-white flex items-center gap-2">{session.day}: <span class="font-normal text-cyan-400">{session.type}</span> {#if session.tag}<span class="text-xs px-2 py-0.5 rounded-full text-white {getTagColor(session.tag)}">{session.tag}</span>{/if}</p>
                                <p class="text-sm text-gray-400">Nutrition Focus: <span class="text-pink-400">{session.nutritionFocus}</span></p>
                            </div>
							<ChevronDown class="-rotate-90 text-gray-500" />
                        </div>
                    {/each}
                </div>
			</div>
		</div>
	{/if}

	<!-- AI Meso-cycle Planner Modal -->
	{#if showIdpModal}
		<div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" on:click={() => showIdpModal = false} role="dialog" aria-modal="true">
			<div class="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl border border-gray-700" on:click|stopPropagation>
				<div class="flex justify-between items-center mb-4">
					<h3 class="text-2xl font-bold text-white">AI Meso-cycle Planner</h3>
					<button on:click={() => showIdpModal = false} class="text-gray-400 hover:text-white"><X size={24} /></button>
				</div>
				<div class="mb-4">
					<label for="idp-goal" class="block text-sm font-medium text-gray-300 mb-2">What is the primary goal for this meso-cycle?</label>
					<select id="idp-goal" bind:value={idpGoal} class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2">
						<option disabled value="">Select a goal...</option>
						<option value="hypertrophy">Hypertrophy & Weight Gain</option>
						<option value="power-speed">Power & Explosive Speed</option>
						<option value="deceleration-agility">Deceleration & Agility (Eccentric Strength)</option>
						<option value="endurance">Endurance Engine (VO2max/Threshold)</option>
						<option value="rehab">Rehab & Tendon Health (Isometrics)</option>
						<option value="cognitive">Cognitive Skills (Mind Gym)</option>
					</select>
				</div>
				{#if idpGoal === 'hypertrophy'}
				<div class="bg-gray-900/50 p-4 rounded-lg">
					<h4 class="font-bold text-yellow-300 mb-2 flex items-center gap-2"><Bot size=20 /> AI Proposed Integrated Plan</h4>
					<p class="text-sm text-gray-300 mb-4">This plan combines a 3-day hypertrophy-focused lifting schedule with the required nutritional support.</p>
					<div class="border border-gray-700 rounded-lg p-3 mb-3">
						<div class="mb-3">
							<h5 class="font-semibold text-white flex items-center gap-2"><Utensils size=16/> Nutrition Protocol</h5>
							<p class="text-xs text-gray-400">To support muscle growth, the following targets are recommended:</p>
							<ul class="text-sm space-y-1 text-pink-400 mt-2">
								<li><strong>Calorie Target:</strong> 3,500 kcal/day (+500 surplus)</li>
								<li><strong>Protein Target:</strong> 180g/day (2.2g/kg)</li>
							</ul>
						</div>
						<div>
							<h5 class="font-semibold text-white">Training Schedule</h5>
							<p class="text-xs text-gray-400">Weekly schedule is adjusted for recovery and growth.</p>
							<p class="text-sm mt-2"><strong>Mon PM:</strong> <span class="text-blue-400">Hypertrophy</span> (Lower Body)</p>
							<p class="text-sm"><strong>Tuesday:</strong> <span class="text-blue-400">Hypertrophy</span> (Upper Push)</p>
							<p class="text-sm"><strong>Thursday:</strong> <span class="text-blue-400">Hypertrophy</span> (Upper Pull)</p>
						</div>
					</div>
					<button on:click={() => applyMesoCycle('hypertrophy')} class="w-full mt-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 rounded-lg text-sm">Accept & Apply Plan</button>
				</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Day Detail / Daily Timeline Modal -->
	{#if showDayDetailModal}
		<div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" on:click={() => showDayDetailModal = false} role="dialog" aria-modal="true">
			<div class="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-700 flex flex-col" on:click|stopPropagation>
				<div class="flex justify-between items-center mb-4 flex-shrink-0">
					<h3 class="text-2xl font-bold text-white">{selectedDaySession.day}</h3>
					<button on:click={() => showDayDetailModal = false} class="text-gray-400 hover:text-white"><X size={24} /></button>
				</div>
				
				<div class="overflow-y-auto pr-2 flex-grow">
					<div class="relative pl-8">
						<!-- Vertical line -->
						<div class="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-700"></div>
						
						{#each dailyTimeline as item, i (i)}
							<div class="relative mb-6">
								<div class="absolute -left-1 top-1.5 w-5 h-5 bg-{item.color}-500 rounded-full border-4 border-gray-800"></div>
								<p class="text-sm text-gray-400 mb-1">{item.time}</p>
								<h4 class="font-bold text-white">{item.title}</h4>
								<p class="text-sm text-gray-300">{item.description}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Feedback Modal -->
	{#if showFeedbackModal}
	<div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" on:click={() => showFeedbackModal = false} role="dialog" aria-modal="true">
		<div class="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-3xl border border-gray-700 flex flex-col" on:click|stopPropagation role="document">
			<div class="flex justify-between items-center mb-4">
				<h3 class="text-2xl font-bold text-white">Player Feedback: {athleteFeedback.athleteName}</h3>
				<button on:click={() => showFeedbackModal = false} class="text-gray-400 hover:text-white"><X size={24} /></button>
			</div>
			
			<div class="space-y-6 overflow-y-auto pr-2 max-h-[70vh]">
				<!-- Main Feedback -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="bg-gray-900/50 p-4 rounded-lg">
						<h4 class="font-bold text-green-400 text-lg mb-2">Super Strength</h4>
						<p class="font-semibold text-white mb-3">{athleteFeedback.superStrength}</p>
						<p class="text-sm text-gray-300">{athleteFeedback.superStrengthSuggestion}</p>
					</div>
					<div class="bg-gray-900/50 p-4 rounded-lg">
						<h4 class="font-bold text-yellow-400 text-lg mb-2">Work On</h4>
						<p class="font-semibold text-white mb-3">{athleteFeedback.workOn}</p>
						<p class="text-sm text-gray-300">{athleteFeedback.workOnSuggestion}</p>
					</div>
				</div>

				<!-- Next Steps -->
				<div class="bg-gray-900/50 p-4 rounded-lg">
					<h4 class="font-bold text-cyan-400 text-lg mb-3">Next Steps</h4>
					<ol class="list-decimal list-inside space-y-2 text-gray-300">
						<li><strong>Understand the feedback:</strong> Discuss it with parents, coaches, or teammates.</li>
						<li><strong>Set Goals:</strong> Set one goal to make your super strength even better and one for your work on.</li>
						<li><strong>Create an Action Plan:</strong> Identify 2-3 things you can do to achieve each goal.</li>
						<li><strong>Get Support:</strong> Consider who will help you and when you will fit it in.</li>
						<li><strong>Execute:</strong> Begin your action plan and develop your two key areas over time.</li>
					</ol>
				</div>

				<!-- FAQs -->
				<div class="bg-gray-900/50 p-4 rounded-lg">
					<details>
						<summary class="font-semibold text-white cursor-pointer">Frequently Asked Questions</summary>
						<div class="mt-4 space-y-4 text-sm text-gray-400 border-t border-gray-700 pt-4">
							<div>
								<h5 class="font-semibold text-gray-200">Why focus on a super strength?</h5>
								<p>Making your best quality even better can help you have a greater impact in games. It's what makes you unique.</p>
							</div>
							<div>
								<h5 class="font-semibold text-gray-200">What if I don’t agree with the feedback?</h5>
								<p>That's okay! This feedback is based on coach observations. Your own understanding of your game is also important. Use this as a guide and feel free to prioritize other areas you've identified.</p>
							</div>
						</div>
					</details>
				</div>
			</div>
		</div>
	</div>
	{/if}
</div>
