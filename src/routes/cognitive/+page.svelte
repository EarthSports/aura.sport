<script lang="ts">
	import { BrainCircuit, Zap, Eye, Waves, Ear } from 'lucide-svelte';

	const neuralDrills = [
		{
			category: 'Visual Skills',
			icon: Eye,
			drills: [
				{ name: 'Peripheral Vision', description: 'Track and hit targets appearing at the edge of your vision.' },
				{ name: 'Focus & Aperture', description: 'Rapidly shift focus between near and far targets.' },
				{ name: 'Tracking', description: 'Follow multiple moving objects and identify the target.' }
			]
		},
		{
			category: 'Reaction & Decision Making',
			icon: Zap,
			drills: [
				{ name: 'Inhibition Test', description: 'React to a specific stimulus while ignoring distractors.' },
				{ name: 'Cognitive Shift', description: 'Alternate between different rule sets on the fly.' }
			]
		}
	];
    
    const vrSimulations = [
        { name: 'Defensive Reads', description: 'VR simulation to improve decision-making in a defensive line.', status: 'Coming Soon' },
        { name: 'Passing Lane Recognition', description: 'Identify and execute passes under pressure in a virtual environment.', status: 'Coming Soon' },
    ];

	const mentalSkills = [
		{ name: 'Pre-Game Hypnosis', duration: '15 min', description: 'A guided hypnosis session to build confidence and mental rehearsal.', type: 'Hypnosis' },
		{ name: 'Post-Training Recovery', duration: '10 min', description: 'Guided breathing to activate the parasympathetic nervous system.', type: 'Meditation' },
		{ name: 'Daily Mindfulness', duration: '10 min', description: 'A simple practice to build mental resilience and awareness.', type: 'Meditation' }
	];
</script>

<div class="p-8 text-white">
	<h1 class="text-4xl font-bold mb-2">Mind Gym</h1>
	<p class="text-gray-400 mb-10">Sharpen your mental edge. Consistent cognitive training improves reaction time, decision making, and resilience under pressure.</p>

	<!-- Neural Training Section -->
	<div class="mb-12">
		<h2 class="text-2xl font-bold mb-6 border-b-2 border-cyan-500 pb-2">Neural Training</h2>
		{#each neuralDrills as category}
			<div class="mb-8">
				<h3 class="text-xl font-semibold text-gray-300 flex items-center gap-3 mb-4">
					<svelte:component this={category.icon} class="text-cyan-400" />
					{category.category}
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each category.drills as drill}
						<div class="bg-gray-800 p-6 rounded-lg hover:bg-gray-700/50 hover:ring-2 ring-cyan-500 transition-all">
							<h4 class="font-bold text-white text-lg">{drill.name}</h4>
							<p class="text-gray-400 text-sm mb-4 h-10">{drill.description}</p>
							<button class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 rounded-lg">
								Start Drill
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

    <!-- VR Simulation Section -->
	<div class="mb-12">
		<h2 class="text-2xl font-bold mb-6 border-b-2 border-green-500 pb-2">VR Simulations</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each vrSimulations as sim}
                <div class="bg-gray-800 p-6 rounded-lg hover:bg-gray-700/50 hover:ring-2 ring-green-500 transition-all relative overflow-hidden">
                    <span class="absolute top-2 right-2 text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">{sim.status}</span>
                    <h4 class="font-bold text-white text-lg">{sim.name}</h4>
                    <p class="text-gray-400 text-sm mb-4 h-10">{sim.description}</p>
                    <button class="w-full bg-green-600 text-white font-bold py-2 rounded-lg opacity-50 cursor-not-allowed">
                        Launch in VR
                    </button>
                </div>
            {/each}
        </div>
    </div>

	<!-- Mental Skills Section -->
	<div>
		<h2 class="text-2xl font-bold mb-6 border-b-2 border-purple-500 pb-2">Mental Skills</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each mentalSkills as session}
				<div class="bg-gray-800 p-6 rounded-lg hover:bg-gray-700/50 hover:ring-2 ring-purple-500 transition-all">
					<div class="flex justify-between items-center">
						<h4 class="font-bold text-white text-lg">{session.name}</h4>
						<span class="text-xs bg-purple-500/50 text-purple-200 px-2 py-1 rounded-full">{session.duration}</span>
					</div>
					<p class="text-gray-400 text-sm mb-4 mt-2 h-10">{session.description}</p>
					<button class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2">
						<svelte:component this={session.type === 'Hypnosis' ? Ear : Waves} size={16} />
						Begin Session
					</button>
				</div>
			{/each}
		</div>
	</div>
</div>
