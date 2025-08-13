<script lang="ts">
	import { PlayCircle, Upload, Bot, BarChart2, Tag, Footprints, FileVideo, Share2, Send, Users, User } from 'lucide-svelte';

	// Mock data for the video library and AI analysis
	const videoLibrary = [
		{ id: 1, title: 'U18 vs Saracens (A)', date: '2025-08-16', type: 'Game Footage', active: true },
		{ id: 2, title: 'Alfie Bourne - 40m Sprint', date: '2025-08-15', type: 'Biomechanics', active: false },
		{ id: 3, title: 'Tackling Technique Session', date: '2025-08-14', type: 'Training Clip', active: false },
	];

	const mockAthletes = [
		{ id: 1, name: 'Alfie Bourne' },
		{ id: 2, name: 'Ben Earl' },
		{ id: 3, name: 'Henry Pollock' },
	];

	// --- TEAM ANALYSIS DATA ---
	const teamAnalysis = {
		videoId: 1,
		summary: "The team showed strong scrum dominance (92% success) and defensive structure. Key work-on is converting pressure into points, as several attacking opportunities inside the 22 were missed.",
		stats: [
			{ name: 'Tackle Completion', value: '89%' },
			{ name: 'Turnovers Won', value: 8 },
			{ name: 'Turnovers Conceded', value: 12 },
			{ name: 'Scrum Success', value: '92%' },
			{ name: 'Lineout Success', value: '85%' },
			{ name: 'Lineouts Stolen', value: 2 },
			{ name: 'Penalties Conceded', value: 9 },
			{ name: 'Metres Gained', value: '1,250m' },
			{ name: 'Clean Breaks', value: 7 },
			{ name: 'Red Zone Entries', value: 15 },
		],
		keyEvents: [
			{ time: '04:32', type: 'Positive', event: 'Dominant Team Scrum' },
			{ time: '12:15', type: 'Work On', event: 'Missed Attacking Opportunity' },
			{ time: '28:49', type: 'Positive', event: 'Team Try - Lineout Maul' },
			{ time: '35:10', type: 'Work On', event: 'Defensive System Error' }
		]
	};

	// --- INDIVIDUAL ANALYSIS DATA ---
	const individualAnalysis = {
		videoId: 1,
		athleteId: 1,
		summary: "A strong defensive performance, but opportunities were missed in attack due to poor support lines. Alfie's tackle completion was high, but decision-making at the breakdown could be faster.",
		stats: {
			attack: [ { name: 'Carries', value: 12 }, { name: 'Metres Gained', value: 85 }, { name: 'Clean Breaks', value: 1 }, { name: 'Defenders Beaten', value: 4 }, { name: 'Offloads', value: 2 }, { name: 'Passes', value: 15 }, ],
			defence: [ { name: 'Tackles Made', value: 14 }, { name: 'Tackles Missed', value: 1 }, { name: 'Tackle Completion', value: '93%' }, { name: 'Dominant Tackles', value: 3 }, { name: 'Turnovers Won', value: 2 }, { name: 'Rucks Hit', value: 25 }, ],
			kicking: [ { name: 'Kicks from Hand', value: 5 }, { name: 'Kicking Metres', value: 150 }, { name: 'Goal Kicking', value: '2/3 (67%)' }, ],
		},
		keyEvents: [
			{ time: '04:32', type: 'Positive', event: 'Dominant Tackle', feedback: "Excellent shoulder contact and leg drive. This is the standard." },
			{ time: '12:15', type: 'Work On', event: 'Slow to Breakdown', feedback: "Entry was slightly high and a fraction late. Aim for a lower body height and anticipate the tackle completion." },
		]
	};

	const biomechanicsAnalysis = {
		videoId: 2,
		summary: "Good overall power production, but a slight over-stride is limiting max velocity. Focus on increasing stride frequency and reducing ground contact time.",
		metrics: [
			{ name: 'Max Velocity', value: '9.8 m/s', rating: 'Good' },
			{ name: 'Ground Contact Time', value: '0.12s', rating: 'Needs Improvement' },
			{ name: 'Stride Length', value: '2.1m', rating: 'Good' },
			{ name: 'Stride Frequency', value: '4.6/s', rating: 'Needs Improvement' }
		],
		critique: "Your front-side mechanics are solid, but you're reaching with your lead foot, causing a braking effect on ground contact. The AI suggests focusing on 'A-Skips' and 'Wicket Runs' to promote striking the ground directly beneath your center of mass."
	};

	let activeVideoId = 1;
	$: activeVideo = videoLibrary.find(v => v.id === activeVideoId);
	
	let analysisView = 'team'; // 'team' or 'individual'
	let selectedAthleteId = 1;
	let activeTab = 'breakdown'; 
	let showShareModal = false;
	let clipToShare = null;

	function openShareModal(event) {
		clipToShare = event;
		showShareModal = true;
	}

	$: {
		if (analysisView === 'team') {
			activeTab = 'breakdown';
		} else {
			if (activeVideo.type === 'Biomechanics') {
				activeTab = 'biomechanics';
			} else {
				activeTab = 'breakdown';
			}
		}
	}
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
	<!-- Video Library Panel -->
	<div class="lg:col-span-1 bg-gray-800 rounded-xl p-6 flex flex-col">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-bold text-white">Video Library</h2>
			<button class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-2">
				<Upload size={16} /> Upload
			</button>
		</div>
		<div class="space-y-3 overflow-y-auto">
			{#each videoLibrary as video}
				<div
					class="p-4 rounded-lg cursor-pointer transition-colors {video.id === activeVideoId
						? 'bg-gray-700 ring-2 ring-cyan-500'
						: 'bg-gray-900/50 hover:bg-gray-700'}"
					on:click={() => activeVideoId = video.id}
				>
					<div class="flex items-center gap-3">
						{#if video.type === 'Game Footage' || video.type === 'Training Clip' || video.type === 'Individual Skill'}
							<FileVideo class="text-cyan-400 flex-shrink-0" />
						{:else}
							<Footprints class="text-green-400 flex-shrink-0" />
						{/if}
						<div>
							<h4 class="font-bold text-white">{video.title}</h4>
							<p class="text-sm text-gray-400">{video.type} - {video.date}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Analysis Panel -->
	<div class="lg:col-span-2 bg-gray-800 rounded-xl p-6 flex flex-col h-full">
		<!-- View Toggle -->
		<div class="flex justify-between items-center mb-4">
			<div class="bg-gray-900 rounded-full p-1 flex space-x-1">
				<button on:click={() => analysisView = 'team'} class:bg-cyan-500={analysisView === 'team'} class:text-white={analysisView === 'team'} class="px-4 py-1 text-sm font-semibold rounded-full transition-colors flex items-center gap-2"><Users size=16 /> Team</button>
				<button on:click={() => analysisView = 'individual'} class:bg-cyan-500={analysisView === 'individual'} class:text-white={analysisView === 'individual'} class="px-4 py-1 text-sm font-semibold rounded-full transition-colors flex items-center gap-2"><User size=16 /> Individual</button>
			</div>
			{#if analysisView === 'individual'}
				<select bind:value={selectedAthleteId} class="bg-gray-700 border border-gray-600 text-white rounded-lg p-2 text-sm">
					{#each mockAthletes as athlete}
						<option value={athlete.id}>{athlete.name}</option>
					{/each}
				</select>
			{/if}
		</div>

		<!-- Video Player -->
		<div class="bg-black rounded-lg mb-6 aspect-video flex items-center justify-center relative">
			<PlayCircle class="text-gray-600" size={64} />
			{#if activeVideo.type === 'Biomechanics' && analysisView === 'individual'}
				<svg class="absolute w-full h-full" viewBox="0 0 200 100">
					<circle cx="100" cy="20" r="5" fill="rgba(0, 255, 255, 0.8)" /> <line x1="100" y1="25" x2="100" y2="50" stroke="rgba(0, 255, 255, 0.8)" stroke-width="2" /> <line x1="100" y1="35" x2="85" y2="45" stroke="rgba(0, 255, 255, 0.8)" stroke-width="2" /> <line x1="85" y1="45" x2="75" y2="65" stroke="rgba(0, 255, 255, 0.8)" stroke-width="2" /> <line x1="100" y1="50" x2="90" y2="75" stroke="rgba(255, 0, 0, 0.8)" stroke-width="2" /> <line x1="90" y1="75" x2="85" y2="95" stroke="rgba(255, 0, 0, 0.8)" stroke-width="2" /> <line x1="100" y1="50" x2="115" y2="70" stroke="rgba(0, 255, 255, 0.8)" stroke-width="2" /> <line x1="115" y1="70" x2="125" y2="90" stroke="rgba(0, 255, 255, 0.8)" stroke-width="2" />
				</svg>
			{/if}
		</div>

		<!-- AI Analysis Tabs -->
		<div class="flex-grow flex flex-col">
			<div class="flex items-center border-b border-gray-700 mb-4">
				{#if analysisView === 'team' || activeVideo.type !== 'Biomechanics'}
					<button on:click={() => activeTab = 'breakdown'} class="px-4 py-2 text-sm font-medium flex items-center gap-2 {activeTab === 'breakdown' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}"><Bot size={16}/> AI Breakdown</button>
					<button on:click={() => activeTab = 'events'} class="px-4 py-2 text-sm font-medium flex items-center gap-2 {activeTab === 'events' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}"><Tag size={16}/> Key Events</button>
					<button on:click={() => activeTab = 'stats'} class="px-4 py-2 text-sm font-medium flex items-center gap-2 {activeTab === 'stats' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}"><BarChart2 size={16}/> Performance Stats</button>
				{/if}
				{#if analysisView === 'individual' && activeVideo.type === 'Biomechanics'}
					<button on:click={() => activeTab = 'biomechanics'} class="px-4 py-2 text-sm font-medium flex items-center gap-2 {activeTab === 'biomechanics' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}"><Footprints size={16}/> Biomechanics</button>
				{/if}
			</div>

			<div class="flex-grow overflow-y-auto pr-2">
				<!-- TEAM VIEW -->
				{#if analysisView === 'team'}
					{#if activeTab === 'breakdown'}
						<div class="bg-gray-900/50 p-4 rounded-lg">
							<h4 class="font-semibold text-yellow-300 mb-2">AI Team Summary</h4>
							<p class="text-sm text-gray-300">{teamAnalysis.summary}</p>
						</div>
					{:else if activeTab === 'events'}
						<div class="space-y-2">
							{#each teamAnalysis.keyEvents as event}
								<div class="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
									<div class="flex items-center gap-3"><span class="w-3 h-3 rounded-full {event.type === 'Positive' ? 'bg-green-500' : 'bg-yellow-500'}"></span><span class="font-semibold text-white">{event.event}</span></div>
									<span class="text-xs text-cyan-400 font-mono bg-gray-700 px-2 py-1 rounded">{event.time}</span>
								</div>
							{/each}
						</div>
					{:else if activeTab === 'stats'}
						<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
							{#each teamAnalysis.stats as stat}
								<div class="bg-gray-900/50 p-4 rounded-lg">
									<p class="text-sm text-gray-400">{stat.name}</p>
									<p class="text-2xl font-bold text-white">{stat.value}</p>
								</div>
							{/each}
						</div>
					{/if}
				<!-- INDIVIDUAL VIEW -->
				{:else if analysisView === 'individual'}
					{#if activeVideo.type === 'Biomechanics'}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="space-y-3">{#each biomechanicsAnalysis.metrics as metric}<div class="bg-gray-900/50 p-4 rounded-lg"><div class="flex justify-between items-baseline"><p class="text-gray-400">{metric.name}</p><span class="text-lg font-bold text-white">{metric.value}</span></div></div>{/each}</div>
							<div class="bg-gray-900/50 p-4 rounded-lg"><h4 class="font-bold text-yellow-300 mb-2 flex items-center gap-2"><Bot size=20 /> AI Critique</h4><p class="text-sm text-gray-300">{biomechanicsAnalysis.critique}</p></div>
						</div>
					{:else}
						{#if activeTab === 'breakdown'}
							<div class="bg-gray-900/50 p-4 rounded-lg">
								<h4 class="font-semibold text-yellow-300 mb-2">AI Individual Summary</h4>
								<p class="text-sm text-gray-300">{individualAnalysis.summary}</p>
							</div>
						{:else if activeTab === 'events'}
							<div class="space-y-2">
								{#each individualAnalysis.keyEvents as event}
									<div class="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
										<div class="flex items-center gap-3"><span class="w-3 h-3 rounded-full {event.type === 'Positive' ? 'bg-green-500' : 'bg-yellow-500'}"></span><span class="font-semibold text-white">{event.event}</span></div>
										<div class="flex items-center gap-4"><span class="text-xs text-cyan-400 font-mono bg-gray-700 px-2 py-1 rounded">{event.time}</span><button on:click={() => openShareModal(event)} class="text-gray-400 hover:text-white"><Share2 size={18} /></button></div>
									</div>
								{/each}
							</div>
						{:else if activeTab === 'stats'}
							<div class="space-y-6">
								<div><h3 class="text-lg font-semibold text-cyan-400 mb-3">Attacking</h3><div class="grid grid-cols-2 md:grid-cols-3 gap-4">{#each individualAnalysis.stats.attack as stat}<div class="bg-gray-900/50 p-4 rounded-lg"><p class="text-sm text-gray-400">{stat.name}</p><p class="text-2xl font-bold text-white">{stat.value}</p></div>{/each}</div></div>
								<div><h3 class="text-lg font-semibold text-cyan-400 mb-3">Defensive</h3><div class="grid grid-cols-2 md:grid-cols-3 gap-4">{#each individualAnalysis.stats.defence as stat}<div class="bg-gray-900/50 p-4 rounded-lg"><p class="text-sm text-gray-400">{stat.name}</p><p class="text-2xl font-bold text-white">{stat.value}</p></div>{/each}</div></div>
								{#if individualAnalysis.stats.kicking}
								<div><h3 class="text-lg font-semibold text-cyan-400 mb-3">Kicking</h3><div class="grid grid-cols-2 md:grid-cols-3 gap-4">{#each individualAnalysis.stats.kicking as stat}<div class="bg-gray-900/50 p-4 rounded-lg"><p class="text-sm text-gray-400">{stat.name}</p><p class="text-2xl font-bold text-white">{stat.value}</p></div>{/each}</div></div>
								{/if}
							</div>
						{/if}
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Share Clip Modal -->
{#if showShareModal}
<div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" on:click={() => showShareModal = false} role="dialog" aria-modal="true">
	<div class="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-gray-700" on:click|stopPropagation>
		<div class="flex justify-between items-center mb-4"><h3 class="text-2xl font-bold text-white">Share Video Clip</h3><button on:click={() => showShareModal = false} class="text-gray-400 hover:text-white"><X size={24} /></button></div>
		<div class="bg-black rounded-lg mb-4 aspect-video flex items-center justify-center relative"><PlayCircle class="text-gray-500" size={48} /><span class="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">{clipToShare.time}</span></div>
		<div class="mb-4"><label for="share-to" class="block text-sm font-medium text-gray-300 mb-2">To:</label><select id="share-to" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2"><option>Alfie Bourne (Direct Message)</option><option>Forwards Unit (Group)</option><option>U18 Main Group (Group)</option></select></div>
		<div class="mb-4"><label for="share-message" class="block text-sm font-medium text-gray-300 mb-2">Message:</label><textarea id="share-message" rows="4" class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2">@Alfie, great effort here. Let's focus on anticipating the tackle to get into position a fraction of a second earlier. See you at training.

---
AI Feedback: {clipToShare.feedback}</textarea></div>
		<button class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"><Send size={18} /> Send Clip</button>
	</div>
</div>
{/if}
