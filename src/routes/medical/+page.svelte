<script lang="ts">
	import AnatomyViewer from '$lib/components/AnatomyViewer.svelte';

    type InjuryStatus = 'Active' | 'Recovering' | 'Resolved';
    type Injury = {
        id: number;
        date: string;
        bodyPart: string;
        diagnosis: string;
        status: InjuryStatus;
        notes: string;
        rehabPlan: string;
    };

    // --- NEW: State variables for layer visibility ---
    let showSkeleton = true;
    let showMuscles = true;
    let showFascia = true;
    let showSkin = true;

    let injuries: Injury[] = [
        { id: 1, date: '2025-07-28', bodyPart: 'Right Hamstring', diagnosis: 'Grade 2 Strain', status: 'Recovering', notes: 'Injury occurred during a sprint drill.', rehabPlan: 'RICE, gentle stretching, and eccentric strengthening.' },
        { id: 2, date: '2025-06-15', bodyPart: 'Left Shoulder', diagnosis: 'AC Joint Sprain', status: 'Resolved', notes: 'Impact injury from a tackle.', rehabPlan: 'Full recovery achieved.' }
    ];
    let selectedInjury: Injury | null = injuries[0];
    let isCreatingNew = false;

    let formBodyPart = '';
    let formDate = '';
    let formDiagnosis = '';
    let formStatus: InjuryStatus = 'Active';
    let formNotes = '';
    let formRehabPlan = '';

    $: {
        if (selectedInjury && !isCreatingNew) {
            formBodyPart = selectedInjury.bodyPart;
            formDate = selectedInjury.date;
            formDiagnosis = selectedInjury.diagnosis;
            formStatus = selectedInjury.status;
            formNotes = selectedInjury.notes;
            formRehabPlan = selectedInjury.rehabPlan;
        } else if (isCreatingNew) {
            formDate = new Date().toISOString().split('T')[0];
            formStatus = 'Active';
            formDiagnosis = '';
            formNotes = '';
            formRehabPlan = '';
        } else {
            formBodyPart = '';
            formDate = '';
            formDiagnosis = '';
            formStatus = 'Active';
            formNotes = '';
            formRehabPlan = '';
        }
    }

    function selectInjury(injury: Injury) {
        selectedInjury = injury;
        isCreatingNew = false;
    }

    function createNewInjury(bodyPart?: string) {
        selectedInjury = null;
        isCreatingNew = true;
        formBodyPart = bodyPart || '';
    }
    
    function handlePartClick(event: CustomEvent<string>) {
        createNewInjury(event.detail);
    }

    function getStatusColor(status: InjuryStatus) {
        const colors = {
            Active: 'bg-red-500/30 text-red-300',
            Recovering: 'bg-yellow-500/30 text-yellow-300',
            Resolved: 'bg-green-500/30 text-green-300'
        };
        return colors[status] || 'bg-gray-500/30 text-gray-300';
    }

    function handleSave() {
        if (isCreatingNew && formBodyPart && formDiagnosis) {
            const newInjury: Injury = {
                id: Math.max(0, ...injuries.map(i => i.id)) + 1,
                bodyPart: formBodyPart,
                date: formDate,
                diagnosis: formDiagnosis,
                status: formStatus,
                notes: formNotes,
                rehabPlan: formRehabPlan
            };
            injuries = [...injuries, newInjury];
            selectedInjury = newInjury;
            isCreatingNew = false;
        } else if (selectedInjury) {
            const index = injuries.findIndex(i => i.id === selectedInjury.id);
            if (index !== -1) {
                injuries[index] = { 
                    ...injuries[index], 
                    bodyPart: formBodyPart,
                    date: formDate,
                    diagnosis: formDiagnosis,
                    status: formStatus,
                    notes: formNotes,
                    rehabPlan: formRehabPlan
                };
                injuries = injuries;
            }
        }
    }

    function handleKeyDown(event: KeyboardEvent, injury: Injury) {
        if (event.key === 'Enter' || event.key === ' ') {
            selectInjury(injury);
        }
    }
</script>

<div class="flex justify-between items-center mb-6">
    <h3 class="text-2xl font-bold text-white">Medical & Injury Log</h3>
    <button on:click={() => createNewInjury()} class="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-600 transition-colors">
        <i class="fas fa-plus mr-2"></i>Log New Injury
    </button>
</div>

<div class="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
    <div class="lg:col-span-2 space-y-6 flex flex-col">
        <div>
            <div class="flex justify-between items-center mb-4">
                 <h4 class="text-lg font-bold text-white">Anatomy Viewer</h4>
                 <!-- NEW: Layer Toggles -->
                 <div class="flex space-x-4 text-sm">
                     <label class="flex items-center cursor-pointer"><input type="checkbox" bind:checked={showSkin} class="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 mr-1">Skin</label>
                     <label class="flex items-center cursor-pointer"><input type="checkbox" bind:checked={showFascia} class="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 mr-1">Fascia</label>
                     <label class="flex items-center cursor-pointer"><input type="checkbox" bind:checked={showMuscles} class="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 mr-1">Muscle</label>
                     <label class="flex items-center cursor-pointer"><input type="checkbox" bind:checked={showSkeleton} class="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 mr-1">Bone</label>
                 </div>
            </div>
            <div class="bg-gray-800 rounded-lg h-[600px] w-full">
                <!-- NEW: Pass props to the viewer -->
                <AnatomyViewer 
                    on:partClick={handlePartClick}
                    {showSkeleton}
                    {showMuscles}
                    {showFascia}
                    {showSkin}
                />
            </div>
        </div>
        <div class="flex-grow">
            <h4 class="text-lg font-bold text-white mb-4">Injury History</h4>
            <div class="space-y-3 max-h-60 overflow-y-auto pr-2">
                {#each injuries as injury (injury.id)}
                    <div 
                        role="button"
                        tabindex="0"
                        on:click={() => selectInjury(injury)} 
                        on:keydown={(e) => handleKeyDown(e, injury)}
                        class="bg-gray-800 p-4 rounded-lg cursor-pointer border-2 transition-colors {selectedInjury?.id === injury.id ? 'border-cyan-500' : 'border-transparent hover:border-gray-600 focus:border-cyan-500 outline-none'}">
                        <div class="flex justify-between items-center">
                            <p class="font-bold text-white">{injury.bodyPart}</p>
                            <span class="text-xs font-semibold px-2 py-1 rounded-md {getStatusColor(injury.status)}">{injury.status}</span>
                        </div>
                        <p class="text-sm text-gray-400">{injury.diagnosis} - {injury.date}</p>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <div class="lg:col-span-3 bg-gray-800 p-6 rounded-lg">
        <h4 class="text-lg font-bold text-white mb-4">
            {#if selectedInjury && !isCreatingNew} Injury Details
            {:else if isCreatingNew} Log New Injury
            {:else} Select an injury or create a new one
            {/if}
        </h4>
        {#if selectedInjury || isCreatingNew}
            <div class="space-y-4">
                <div>
                    <label for="body-part" class="block text-sm font-medium text-gray-400">Body Part</label>
                    <input id="body-part" type="text" placeholder="Click on the model or type here" bind:value={formBodyPart} class="w-full mt-1 bg-gray-700 rounded-lg p-2 border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500">
                </div>
                <div>
                    <label for="injury-date" class="block text-sm font-medium text-gray-400">Date of Injury</label>
                    <input id="injury-date" type="date" bind:value={formDate} class="w-full mt-1 bg-gray-700 rounded-lg p-2 border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500">
                </div>
                <div>
                    <label for="diagnosis" class="block text-sm font-medium text-gray-400">Diagnosis / Issue</label>
                    <input id="diagnosis" class="w-full mt-1 bg-gray-700 rounded-lg p-2 border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., Patellar Tendinitis" bind:value={formDiagnosis}>
                </div>
                <div>
                    <label for="status" class="block text-sm font-medium text-gray-400">Status</label>
                    <select id="status" bind:value={formStatus} class="w-full mt-1 bg-gray-700 rounded-lg p-2 border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500">
                        <option>Active</option>
                        <option>Recovering</option>
                        <option>Resolved</option>
                    </select>
                </div>
                <div>
                    <label for="notes" class="block text-sm font-medium text-gray-400">Physio / Medical Notes</label>
                    <textarea id="notes" rows="4" placeholder="Notes from the assessment..." bind:value={formNotes} class="w-full mt-1 bg-gray-700 rounded-lg p-2 border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"></textarea>
                </div>
                <div>
                    <label for="rehab-plan" class="block text-sm font-medium text-gray-400">Rehab & Prehab Plan</label>
                    <textarea id="rehab-plan" rows="5" placeholder="Prescribed exercises and protocol..." bind:value={formRehabPlan} class="w-full mt-1 bg-gray-700 rounded-lg p-2 border border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"></textarea>
                </div>
                <div class="pt-2">
                     <button on:click={handleSave} class="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">Save Changes</button>
                </div>
            </div>
        {/if}
    </div>
</div>
