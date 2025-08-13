<script lang="ts">
    // Import the action for drag-and-drop functionality
    import { dndzone } from 'svelte-dnd-action';
    // Import our new Tooltip component
    import Tooltip from '$lib/components/Tooltip.svelte';

    // --- STATE MANAGEMENT ---

    let sessionTemplates = [
        { id: 1, name: 'Total Body Strength', phase: 'GPP / Off-Season', active: true },
        { id: 2, name: 'Max Velocity Development', phase: 'SPP / Sprinting', active: false },
        { id: 3, name: 'Reactive Agility', phase: 'SPP / Rugby', active: false }
    ];

    let activeSession = {
        name: 'Total Body Strength',
        blocks: [
            {
                id: 1,
                name: 'RPR (Neural Activation)',
                exercises: [
                    { id: 1, name: 'Diaphragmatic Breathing', sets: 1, reps: { value: 120, unit: 's'}, intensity: { value: null, unit: 'RPE' }, restReps: 0, restSets: 30, tag: null },
                ]
            },
            {
                id: 2,
                name: 'Dynamic Warm-up',
                exercises: [
                    { id: 2, name: 'A-Skips', sets: 2, reps: { value: 20, unit: 'm'}, intensity: { value: null, unit: '% Effort' }, restReps: 0, restSets: 30, tag: 'Speed' },
                    { id: 3, name: 'Broad Jumps', sets: 2, reps: { value: 5, unit: 'reps'}, intensity: { value: 95, unit: '% Effort' }, restReps: 10, restSets: 60, tag: 'Plyo' },
                ]
            },
            {
                id: 3,
                name: 'Main Lifts',
                exercises: [
                    { id: 4, name: 'Barbell Back Squat', sets: 4, reps: { value: 6, unit: 'reps'}, intensity: { value: 80, unit: '% 1RM' }, restReps: 0, restSets: 120, tag: 'Strength' },
                ]
            }
        ]
    };

    // --- FUNCTIONS ---

    function handleBlockReorder(e) {
        activeSession.blocks = e.detail.items;
    }

    function addBlock() {
        activeSession.blocks = [
            ...activeSession.blocks,
            {
                id: Date.now(),
                name: `New Block`,
                exercises: []
            }
        ];
    }

    function removeBlock(blockIdToRemove) {
        if (confirm('Are you sure you want to remove this entire block?')) {
            activeSession.blocks = activeSession.blocks.filter(block => block.id !== blockIdToRemove);
        }
    }

    function addExercise(blockId) {
        const newExercise = { id: Date.now(), name: 'New Exercise', sets: 3, reps: { value: 10, unit: 'reps'}, intensity: { value: 75, unit: '% 1RM' }, restReps: 0, restSets: 90, tag: 'Strength' };
        activeSession.blocks = activeSession.blocks.map(block => {
            if (block.id === blockId) {
                return { ...block, exercises: [...block.exercises, newExercise] };
            }
            return block;
        });
    }

    function removeExercise(blockId, exerciseIdToRemove) {
        activeSession.blocks = activeSession.blocks.map(block => {
            if (block.id === blockId) {
                return { ...block, exercises: block.exercises.filter(ex => ex.id !== exerciseIdToRemove) };
            }
            return block;
        });
    }

    function getTagClasses(tag) {
        switch(tag) {
            case 'Speed': return 'bg-green-800 text-green-200';
            case 'Plyo': return 'bg-yellow-800 text-yellow-200';
            case 'Strength': return 'bg-blue-800 text-blue-200';
            default: return 'bg-cyan-800 text-cyan-200';
        }
    }

</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
    <!-- Session Templates Panel -->
    <div class="lg:col-span-1 bg-gray-900 rounded-xl p-6 flex flex-col">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-white">Session Templates</h2>
            <button class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg text-sm">
                New
            </button>
        </div>
        <div class="space-y-3 overflow-y-auto">
            {#each sessionTemplates as template}
                <div
                    class="p-4 rounded-lg cursor-pointer transition-colors {template.active
                        ? 'bg-gray-700 border-l-4 border-cyan-400'
                        : 'bg-gray-800 hover:bg-gray-700'}"
                >
                    <h4 class="font-bold text-white">{template.name}</h4>
                    <p class="text-sm text-gray-400">{template.phase}</p>
                </div>
            {/each}
        </div>
    </div>

    <!-- Session Editor Panel -->
    <div class="lg:col-span-2 bg-gray-900 rounded-xl p-6 flex flex-col h-full">
        <div class="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
            <input
                type="text"
                bind:value={activeSession.name}
                class="text-2xl font-bold text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-md px-2"
            />
        </div>

        <div
            class="space-y-6 overflow-y-auto flex-grow"
            use:dndzone={{ items: activeSession.blocks, flipDurationMs: 200 }}
            on:consider={handleBlockReorder}
            on:finalize={handleBlockReorder}
        >
            {#each activeSession.blocks as block, i (block.id)}
                <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
                    <div class="flex items-center gap-x-3 mb-4">
                        <div class="text-gray-500 cursor-grab active:cursor-grabbing" title="Drag to re-order">
                            <i class="fas fa-grip-vertical"></i>
                        </div>
                        <input 
                            type="text" 
                            bind:value={block.name} 
                            class="flex-grow text-lg font-semibold text-cyan-400 bg-transparent focus:outline-none focus:ring-1 focus:ring-cyan-600 rounded px-1"
                        >
                        <button 
                            on:click={() => removeBlock(block.id)} 
                            class="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-gray-700 rounded text-gray-400 hover:bg-red-500 hover:text-white font-bold" 
                            title="Delete block"
                        >
                            X
                        </button>
                    </div>

                    <div class="space-y-3">
                        {#each block.exercises as exercise (exercise.id)}
                            <div class="bg-gray-700 p-3 rounded-md">
                                <div class="flex items-center mb-2">
                                    {#if exercise.tag}
                                        <span class="text-xs font-bold {getTagClasses(exercise.tag)} px-2 py-1 rounded-full mr-3">
                                            {exercise.tag}
                                        </span>
                                    {/if}
                                    <input type="text" bind:value={exercise.name} class="flex-grow bg-transparent font-semibold text-white focus:outline-none px-1" />
                                    <button on:click={() => removeExercise(block.id, exercise.id)} class="text-gray-500 hover:text-white ml-2"><i class="fas fa-times" /></button>
                                </div>
                                <div class="grid grid-cols-2 md:grid-cols-5 gap-x-2 gap-y-4 mt-2">
                                    <div>
                                        <label class="block text-xs text-gray-400 mb-1">Sets</label>
                                        <input type="number" bind:value={exercise.sets} class="w-full bg-gray-800 p-2 rounded text-center">
                                    </div>
                                    <div>
                                        <label class="block text-xs text-gray-400 mb-1">Reps/Dist/Dur</label>
                                        <div class="flex">
                                            <input type="number" bind:value={exercise.reps.value} class="w-full bg-gray-800 p-2 rounded-l text-center">
                                            <select bind:value={exercise.reps.unit} class="bg-gray-600 text-xs p-2 rounded-r appearance-none">
                                                <option value="reps">Reps</option>
                                                <option value="s">Seconds</option>
                                                <option value="min">Minutes</option>
                                                <option value="m">Meters</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="flex items-center text-xs text-gray-400 mb-1">
                                            Intensity
                                            <Tooltip text="%1RM: % of 1-Rep Max. %MAS: % of Max Aerobic Speed. %Max Vel: % of top speed. RPE: Overall exertion (1-10). RIR: Reps In Reserve. %Effort: Explosive intent." />
                                        </label>
                                        <div class="flex">
                                            <input type="number" bind:value={exercise.intensity.value} class="w-full bg-gray-800 p-2 rounded-l text-center">
                                            <select bind:value={exercise.intensity.unit} class="bg-gray-600 text-xs p-2 rounded-r appearance-none">
                                                <option value="% 1RM">% 1RM</option>
                                                <option value="% MAS">% MAS</option>
                                                <option value="% Max Vel">% Max Vel</option>
                                                <option value="RPE">RPE</option>
                                                <option value="RIR">RIR</option>
                                                <option value="% Effort">% Effort</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-xs text-gray-400 mb-1">Rest (reps)</label>
                                        <input type="number" bind:value={exercise.restReps} class="w-full bg-gray-800 p-2 rounded text-center" placeholder="s">
                                    </div>
                                    <div>
                                        <label class="block text-xs text-gray-400 mb-1">Rest (sets)</label>
                                        <input type="number" bind:value={exercise.restSets} class="w-full bg-gray-800 p-2 rounded text-center" placeholder="s">
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                    <button on:click={() => addExercise(block.id)} class="mt-4 text-sm text-cyan-400 hover:text-cyan-300 font-semibold">
                        <i class="fas fa-plus-circle mr-2" />Add Exercise
                    </button>
                </div>
            {/each}
        </div>
        
        <div class="mt-6 pt-6 border-t border-gray-700 space-y-4">
            <button on:click={addBlock} class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg">
                <i class="fas fa-plus mr-2"></i> Add Block
            </button>
            <div class="flex justify-end">
                <button class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg">
                    Save Session
                </button>
            </div>
        </div>
    </div>
</div>
