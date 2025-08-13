<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let planDetails = {
        sport: 'rugby',
        country: 'england',
        ageGroup: 'u18',
        experience: 'intermediate',
        fitnessLevel: 'average',
        trainingDays: {
            monday: false,
            tuesday: true,
            wednesday: false,
            thursday: true,
            friday: false,
            saturday: false,
            sunday: false
        },
        matchDay: 'saturday',
        goal: 'peak_for_finals',
        preSeasonStartDate: '', // New field
        regularSeasonStartDate: '', // New field
        postSeasonStartDate: '', // New field
        testingResults: '',
        includeTesting: true,
        includeRecoveryTest: true 
    };

    let isLoading = false;

    async function generatePlan() {
        isLoading = true;
        
        const selectedTrainingDays = Object.entries(planDetails.trainingDays)
            .filter(([, isSelected]) => isSelected)
            .map(([day]) => day);

        const payload = { ...planDetails, trainingDays: selectedTrainingDays };
        
        await new Promise(res => setTimeout(res, 1500));

        dispatch('generate', payload);
        
        isLoading = false;
    }

</script>

<div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-xl p-8 w-full max-w-2xl">
        <h3 class="text-2xl font-bold text-white mb-6">AI Plan Builder</h3>
        
        <form on:submit|preventDefault={generatePlan} class="space-y-4">
            <!-- Team Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="sport" class="block text-sm font-medium text-gray-300">Sport</label>
                    <select id="sport" bind:value={planDetails.sport} class="w-full mt-1 bg-gray-700 rounded-lg p-2">
                        <option value="rugby">Rugby</option>
                        <option value="football">Football</option>
                        <option value="athletics">Athletics</option>
                    </select>
                </div>
                <div>
                    <label for="country" class="block text-sm font-medium text-gray-300">Country</label>
                    <select id="country" bind:value={planDetails.country} class="w-full mt-1 bg-gray-700 rounded-lg p-2">
                        <option value="england">England (RFU)</option>
                        <option value="usa">USA (USA Rugby)</option>
                        <option value="australia">Australia (RA)</option>
                        <option value="new_zealand">New Zealand (NZR)</option>
                    </select>
                </div>
                <div>
                    <label for="age-group" class="block text-sm font-medium text-gray-300">Age Group</label>
                    <select id="age-group" bind:value={planDetails.ageGroup} class="w-full mt-1 bg-gray-700 rounded-lg p-2">
                        <option value="senior">Senior</option>
                        <option value="u18">U18</option>
                        <option value="u16">U16</option>
                    </select>
                </div>
                <div>
                    <label for="experience" class="block text-sm font-medium text-gray-300">Experience Level</label>
                    <select id="experience" bind:value={planDetails.experience} class="w-full mt-1 bg-gray-700 rounded-lg p-2">
                        <option value="advanced">Advanced</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="beginner">Beginner</option>
                    </select>
                </div>
                 <div>
                    <label for="fitnessLevel" class="block text-sm font-medium text-gray-300">Current Fitness Level</label>
                    <select id="fitnessLevel" bind:value={planDetails.fitnessLevel} class="w-full mt-1 bg-gray-700 rounded-lg p-2">
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="average">Average</option>
                        <option value="poor">Poor</option>
                    </select>
                </div>
            </div>

            <!-- Schedule -->
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Training Days</label>
                <div class="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {#each Object.keys(planDetails.trainingDays) as day}
                    <label class="flex items-center justify-center p-2 rounded-lg cursor-pointer {planDetails.trainingDays[day] ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}">
                        <input type="checkbox" bind:checked={planDetails.trainingDays[day]} class="hidden">
                        <span class="text-sm uppercase">{day.substring(0,3)}</span>
                    </label>
                    {/each}
                </div>
            </div>

            <!-- Season Dates -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="preSeasonStartDate" class="block text-sm font-medium text-gray-300">Pre-Season Start</label>
                    <input type="date" id="preSeasonStartDate" bind:value={planDetails.preSeasonStartDate} class="w-full mt-1 bg-gray-700 rounded-lg p-2">
                </div>
                <div>
                    <label for="regularSeasonStartDate" class="block text-sm font-medium text-gray-300">Regular Season Start</label>
                    <input type="date" id="regularSeasonStartDate" bind:value={planDetails.regularSeasonStartDate} class="w-full mt-1 bg-gray-700 rounded-lg p-2">
                </div>
                <div>
                    <label for="postSeasonStartDate" class="block text-sm font-medium text-gray-300">Post-Season Start</label>
                    <input type="date" id="postSeasonStartDate" bind:value={planDetails.postSeasonStartDate} class="w-full mt-1 bg-gray-700 rounded-lg p-2">
                </div>
            </div>

            <!-- Pre-Plan Testing -->
            <div>
                <label for="testing-results" class="block text-sm font-medium text-gray-300">Pre-Plan Testing Results (Optional)</label>
                <textarea id="testing-results" bind:value={planDetails.testingResults} rows="3" class="w-full mt-1 bg-gray-700 rounded-lg p-2" placeholder="e.g., Average 30m sprint: 4.5s, Average 1RM Back Squat: 120kg, Yo-Yo Test Level: 17.5"></textarea>
            </div>

            <!-- Testing Protocol -->
            <div class="space-y-2 pt-2">
                <label class="flex items-center p-3 rounded-lg bg-gray-700/50">
                    <input type="checkbox" bind:checked={planDetails.includeTesting} class="h-5 w-5 rounded bg-gray-900 border-gray-500 text-cyan-500 focus:ring-cyan-600">
                    <span class="ml-3 text-gray-300">Include regular fitness testing (e.g., Yo-Yo test) every 4 weeks</span>
                </label>
                 <label class="flex items-center p-3 rounded-lg bg-gray-700/50">
                    <input type="checkbox" bind:checked={planDetails.includeRecoveryTest} class="h-5 w-5 rounded bg-gray-900 border-gray-500 text-cyan-500 focus:ring-cyan-600">
                    <span class="ml-3 text-gray-300">Include post-match recovery velocity test (e.g., 30m sprint) on Mon/Tue</span>
                </label>
            </div>

            <!-- Buttons -->
            <div class="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button type="button" on:click={() => dispatch('close')} class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg flex items-center" disabled={isLoading}>
                    {#if isLoading}
                        <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                    {:else}
                        Generate Plan
                    {/if}
                </button>
            </div>
        </form>
    </div>
</div>
