<script lang="ts">
    type SettingsPage = 'profile' | 'devices' | 'zones';
    let activePage: SettingsPage = 'profile';

    // --- MOCK DATA ---
    let profile = {
        name: 'John Smith',
        email: 'john.smith@email.com',
        athleteType: 'Rugby Player',
        dob: '1998-05-20'
    };

    let zones = {
        heartRate: {
            threshold: 175,
            max: 185,
            resting: 45,
            zones: [
                { name: 'Zone 1: Recovery', range: '0-115' },
                { name: 'Zone 2: Aerobic', range: '116-125' },
                { name: 'Zone 3: Tempo', range: '126-132' },
            ]
        }
    };
</script>

<div class="flex gap-8 h-full">
    <!-- Left Navigation Panel -->
    <div class="w-1/4 max-w-xs bg-gray-900 rounded-xl p-4 flex flex-col">
        <h2 class="text-xl font-bold text-white mb-6 px-2">Settings</h2>
        <nav class="space-y-2">
            <button on:click={() => activePage = 'profile'} class="w-full text-left flex items-center p-3 rounded-lg {activePage === 'profile' ? 'bg-cyan-500 text-white' : 'hover:bg-gray-700'}">
                <i class="fas fa-user-circle w-6 mr-3"></i> Profile
            </button>
            <button on:click={() => activePage = 'devices'} class="w-full text-left flex items-center p-3 rounded-lg {activePage === 'devices' ? 'bg-cyan-500 text-white' : 'hover:bg-gray-700'}">
                <i class="fas fa-satellite-dish w-6 mr-3"></i> Apps & Devices
            </button>
            <button on:click={() => activePage = 'zones'} class="w-full text-left flex items-center p-3 rounded-lg {activePage === 'zones' ? 'bg-cyan-500 text-white' : 'hover:bg-gray-700'}">
                <i class="fas fa-chart-bar w-6 mr-3"></i> Training Zones
            </button>
        </nav>
    </div>

    <!-- Right Content Panel -->
    <div class="flex-1 bg-gray-900 rounded-xl p-8 overflow-y-auto">
        {#if activePage === 'profile'}
            <h3 class="text-2xl font-bold text-white mb-6">Personal Information</h3>
            <div class="space-y-4 max-w-lg">
                <div>
                    <label class="block text-sm font-medium text-gray-400">Full Name</label>
                    <input type="text" bind:value={profile.name} class="w-full mt-1 bg-gray-800 rounded-lg p-2 border border-gray-700">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-400">Email Address</label>
                    <input type="email" bind:value={profile.email} class="w-full mt-1 bg-gray-800 rounded-lg p-2 border border-gray-700">
                </div>
                <!-- Add other profile fields here -->
            </div>
        {:else if activePage === 'devices'}
            <h3 class="text-2xl font-bold text-white mb-6">Apps & Devices</h3>
            <div class="space-y-4">
                <div class="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p class="font-bold text-white">Whoop</p>
                        <p class="text-sm text-green-400">Connected</p>
                    </div>
                    <button class="bg-red-500/20 text-red-300 px-3 py-1 rounded-lg text-sm">Disconnect</button>
                </div>
                <div class="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p class="font-bold text-white">Garmin</p>
                        <p class="text-sm text-gray-400">Not Connected</p>
                    </div>
                    <button class="bg-cyan-500 text-white px-3 py-1 rounded-lg text-sm">Connect</button>
                </div>
            </div>
        {:else if activePage === 'zones'}
            <h3 class="text-2xl font-bold text-white mb-6">Heart Rate Zones</h3>
            <div class="bg-gray-800 p-6 rounded-lg">
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-400">Threshold Heart Rate</label>
                        <input type="number" bind:value={zones.heartRate.threshold} class="w-full mt-1 bg-gray-700 rounded-lg p-2 border border-gray-600">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400">Max Heart Rate</label>
                        <input type="number" bind:value={zones.heartRate.max} class="w-full mt-1 bg-gray-700 rounded-lg p-2 border border-gray-600">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-400">Resting Heart Rate</label>
                        <input type="number" bind:value={zones.heartRate.resting} class="w-full mt-1 bg-gray-700 rounded-lg p-2 border border-gray-600">
                    </div>
                </div>
                <div class="space-y-2">
                     {#each zones.heartRate.zones as zone, i}
                        <div class="flex items-center gap-4 p-2 rounded-lg {i % 2 === 0 ? 'bg-gray-700/50' : ''}">
                            <span class="font-semibold text-cyan-400 w-1/3">{zone.name}</span>
                            <span class="text-white">{zone.range} bpm</span>
                        </div>
                     {/each}
                </div>
            </div>
        {/if}
    </div>
</div>
