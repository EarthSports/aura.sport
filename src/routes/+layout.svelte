<script lang="ts">
    import '../app.css';
    import { page } from '$app/stores';
    import { analysisView } from '$lib/stores/viewStore'; // Import the store
    import { Home, Users, User, Calendar, BarChart3, MessageSquare, Dna, Video, HeartPulse, BookOpen, Settings, Brain } from 'lucide-svelte';

    const menuItems = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/athletes', label: 'Athletes', icon: Users },
        { href: '/calendar', label: 'Calendar', icon: Calendar },
        { href: '/atp', label: 'Annual Plan', icon: BarChart3 },
        { href: '/cognitive', label: 'Mind Gym', icon: Brain },
        { href: '/communication', label: 'Communication', icon: MessageSquare },
        { href: '/session-builder', label: 'Session Builder', icon: Dna },
        { href: '/video-analysis', label: 'Video Analysis', icon: Video },
        { href: '/medical', label: 'Medical', icon: HeartPulse },
        { href: '/club-resources', label: 'Club Resources', icon: BookOpen }
    ];

    const viewTitles = {
        dashboard: 'Dashboard',
        athletes: 'Athletes',
        calendar: 'Training Calendar',
        communication: 'Communication',
        'session-builder': 'Session Builder',
        atp: 'Annual Training Plan',
        cognitive: 'Mind Gym',
        'video-analysis': 'Video Analysis',
        medical: 'Medical & Injury Log',
        'club-resources': 'Club Resources',
        settings: 'Settings'
    };

    $: currentTitle = viewTitles[$page.url.pathname.split('/')[1]] || 'Dashboard';

</script>

<div class="flex h-screen bg-gray-900 text-white font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 p-6 flex flex-col flex-shrink-0">
        <h1 class="text-3xl font-bold text-white mb-10">AURA</h1>
        
        <nav class="flex-grow">
            <ul class="space-y-2">
                {#each menuItems as item}
                    <li>
                        <a href={item.href}
                           class="flex items-center gap-3 p-3 rounded-lg transition-colors
                           {$page.url.pathname.startsWith(item.href)
                               ? 'bg-cyan-500 text-white'
                               : 'text-gray-400 hover:bg-gray-700 hover:text-white'}"
                        >
                            <svelte:component this={item.icon} size={22} />
                            <span>{item.label}</span>
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>

        <div class="mt-auto">
             <ul>
                <li>
                    <a href="/settings"
                       class="flex items-center gap-3 p-3 rounded-lg transition-colors
                       {$page.url.pathname.startsWith('/settings')
                           ? 'bg-cyan-500 text-white'
                           : 'text-gray-400 hover:bg-gray-700 hover:text-white'}"
                    >
                        <svelte:component this={Settings} size={22} />
                        <span>Settings</span>
                    </a>
                </li>
            </ul>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto relative p-8 flex flex-col">
        <header class="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <h2 class="text-3xl font-bold text-white">{currentTitle}</h2>
            <div class="flex items-center gap-4">
                 <a href="/communication" class="text-gray-400 hover:text-white">
                    <MessageSquare size={24}/>
                </a>
                <div class="bg-gray-900 rounded-full p-1 flex space-x-1">
                    <button on:click={() => $analysisView = 'team'} class:bg-cyan-500={$analysisView === 'team'} class:text-white={$analysisView === 'team'} class="px-4 py-1.5 text-sm font-semibold rounded-full transition-colors flex items-center gap-2"><Users size=16 /> Team</button>
                    <button on:click={() => $analysisView = 'individual'} class:bg-cyan-500={$analysisView === 'individual'} class:text-white={$analysisView === 'individual'} class="px-4 py-1.5 text-sm font-semibold rounded-full transition-colors flex items-center gap-2"><User size=16 /> Individual</button>
                </div>
            </div>
        </header>
        
        <div class="flex-grow">
            <slot />
        </div>
    </main>
</div>
