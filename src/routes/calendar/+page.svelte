<script lang="ts">
	import { onMount } from 'svelte';
	import { dndzone } from 'svelte-dnd-action';

	// --- DATA STRUCTURES ---
	interface CalendarEvent {
		id: number;
		date: Date;
		title: string;
		type: 'session' | 'match' | 'competition' | 'note' | 'social';
		startTime?: string;
		endTime?: string;
		sessionId?: number;
        contactLoad?: { full: number; controlled: number };
	}

	interface SessionTemplate {
		id: number;
		name: string;
		phase: string;
        contactLoad: { full: number; controlled: number };
	}

	// --- CONSTANTS ---
	const MAX_FULL_CONTACT = 15;
	const MAX_CONTROLLED_CONTACT = 40;
    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	// --- STATE MANAGEMENT ---
    type CalendarView = 'year' | 'month' | 'day';
    let currentView: CalendarView = 'month';

	let masterSessionLibrary: SessionTemplate[] = [
		{ id: 1, name: 'Defensive Systems', phase: 'In-Season', contactLoad: { full: 10, controlled: 15 } },
		{ id: 2, name: 'Attacking Shape', phase: 'In-Season', contactLoad: { full: 5, controlled: 20 } },
		{ id: 3, name: 'Set Piece Practice', phase: 'In-Season', contactLoad: { full: 0, controlled: 10 } },
        { id: 4, name: 'Total Body Strength', phase: 'GPP / Off-Season', contactLoad: { full: 0, controlled: 0 } },
        { id: 5, name: 'Max Velocity Development', phase: 'SPP / Sprinting', contactLoad: { full: 0, controlled: 0 } },
        { id: 6, name: 'Reactive Agility', phase: 'SPP / Rugby', contactLoad: { full: 0, controlled: 5 } },
	];

	let activeSessionTemplates: SessionTemplate[] = [masterSessionLibrary[0], masterSessionLibrary[1]];

	let events: CalendarEvent[] = [
		{ id: 1, date: new Date(2025, 7, 9), title: 'Match vs. Rovers', type: 'match', startTime: '14:00', endTime: '16:00' },
        { id: 2, date: new Date(2025, 7, 4), title: 'Defensive Systems', type: 'session', sessionId: 1, contactLoad: { full: 10, controlled: 15 }, startTime: '10:00', endTime: '11:30' },
	];

	let currentDate = new Date(2025, 7, 1);
	let selectedDay: Date | null = new Date();

	let showAddEventModal = false;
    let showLibraryModal = false;
	let newEventDate: Date | null = null;
	
	let newEventTitle = '';
	let newEventCategory: CalendarEvent['type'] = 'note';
	let newEventStartTime = '10:00';
	let newEventEndTime = '11:00';
    let selectedLibraryTemplates = new Set();

	// --- DERIVED STATE ---
	$: calendarDays = getCalendarDaysForMonth(currentDate);
    $: dailyEvents = getEventsForDay(selectedDay);
	$: weeklyLoad = calculateWeeklyLoad(selectedDay, events);

	// --- FUNCTIONS ---

    function exportAllEventsToIcs() {
        const formatDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d\d\d/g, '').split('.')[0] + 'Z';
        };

        let eventStrings = [];
        for (const event of events) {
            if (!event.startTime || !event.endTime) continue;

            const [startHours, startMinutes] = event.startTime.split(':');
            const startDate = new Date(event.date);
            startDate.setHours(parseInt(startHours), parseInt(startMinutes));

            const [endHours, endMinutes] = event.endTime.split(':');
            const endDate = new Date(event.date);
            endDate.setHours(parseInt(endHours), parseInt(endMinutes));

            eventStrings.push([
                'BEGIN:VEVENT',
                `URL:${document.URL}`,
                `DTSTART:${formatDate(startDate)}`,
                `DTEND:${formatDate(endDate)}`,
                `SUMMARY:${event.title}`,
                `DESCRIPTION:Scheduled via Aura Platform`,
                'END:VEVENT'
            ].join('\n'));
        }

        const icsData = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            ...eventStrings,
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Aura-Schedule.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function addTemplatesFromLibrary() {
        selectedLibraryTemplates.forEach(id => {
            const templateToAdd = masterSessionLibrary.find(t => t.id === id);
            if (templateToAdd && !activeSessionTemplates.some(t => t.id === id)) {
                activeSessionTemplates = [...activeSessionTemplates, templateToAdd];
            }
        });
        selectedLibraryTemplates.clear();
        showLibraryModal = false;
    }

    function getStartOfWeek(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

	function calculateWeeklyLoad(dayInWeek: Date | null, allEvents: CalendarEvent[]) {
		if (!dayInWeek) return { full: 0, controlled: 0, fullPercent: 0, controlledPercent: 0 };
        const startOfWeek = getStartOfWeek(dayInWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
		const weekEvents = allEvents.filter(e => e.date >= startOfWeek && e.date <= endOfWeek && e.type === 'session' && e.contactLoad);
		const totalFull = weekEvents.reduce((sum, e) => sum + (e.contactLoad?.full || 0), 0);
		const totalControlled = weekEvents.reduce((sum, e) => sum + (e.contactLoad?.controlled || 0), 0);
		return {
			full: totalFull,
			controlled: totalControlled,
			fullPercent: Math.min((totalFull / MAX_FULL_CONTACT) * 100, 100),
			controlledPercent: Math.min((totalControlled / MAX_CONTROLLED_CONTACT) * 100, 100)
		};
	}

	function getCalendarDaysForMonth(dateInMonth: Date) {
		const days = [];
		const year = dateInMonth.getFullYear();
		const month = dateInMonth.getMonth();
		const firstDayOfMonth = new Date(year, month, 1);
		const lastDayOfMonth = new Date(year, month + 1, 0);
		const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; 
		for (let i = 0; i < startDayOfWeek; i++) { days.push(null); }
		for (let i = 1; i <= lastDayOfMonth.getDate(); i++) { days.push(new Date(year, month, i)); }
		return days;
	}

	function getEventsForDay(day: Date | null) {
		if (!day) return [];
		return events
			.filter(e => e.date.toDateString() === day.toDateString())
			.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
	}
	
	function openAddEventModal(day: Date) {
		newEventDate = day;
		showAddEventModal = true;
	}

	function handleAddEvent() {
		if (!newEventDate) return;
		const newEvent: CalendarEvent = {
			id: Date.now(),
			date: newEventDate,
			title: newEventTitle || 'New Event',
			type: newEventCategory,
			startTime: newEventStartTime,
			endTime: newEventEndTime,
		};
		events = [...events, newEvent];
		showAddEventModal = false;
		newEventTitle = '';
		newEventCategory = 'note';
	}

	function handleDropOnCalendar(e: CustomEvent<{ items: any[], info: any }>) {
		const droppedSession: SessionTemplate = e.detail.info.source.items[e.detail.info.trigger.sourceIndex];
		const targetDay: Date = e.detail.info.trigger.id;
		if (!droppedSession || !targetDay) return;
		const newSessionEvent: CalendarEvent = {
			id: Date.now(),
			date: targetDay,
			title: droppedSession.name,
			type: 'session',
			sessionId: droppedSession.id,
			startTime: '10:00',
			endTime: '11:30',
            contactLoad: droppedSession.contactLoad
		};
		events = [...events, newSessionEvent];
	}
	
	function getCategoryClasses(category: CalendarEvent['type']) {
		switch(category) {
			case 'match': return 'bg-red-500/20 text-red-300 border-l-4 border-red-400';
			case 'competition': return 'bg-red-500/20 text-red-300 border-l-4 border-red-400';
			case 'social': return 'bg-purple-500/20 text-purple-300 border-l-4 border-purple-400';
			case 'session': return 'bg-cyan-500/20 text-cyan-300 border-l-4 border-cyan-400';
			default: return 'bg-gray-500/20 text-gray-300 border-l-4 border-gray-400';
		}
	}

    function formatTime(timeString?: string): string {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hourNum = parseInt(hours, 10);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const formattedHour = hourNum % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    }

    function changeMonth(offset: number) {
        currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    }

    function goToMonth(monthIndex: number) {
        currentDate = new Date(currentDate.getFullYear(), monthIndex, 1);
        currentView = 'month';
    }
</script>

<!-- Modals -->
{#if showLibraryModal}
<div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-xl p-6 w-full max-w-2xl flex flex-col h-[70vh]">
        <h3 class="text-xl font-bold text-white mb-4">Session Template Library</h3>
        <div class="flex-grow overflow-y-auto space-y-3 pr-2">
            {#each masterSessionLibrary as template (template.id)}
                <label class="flex items-center p-4 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors">
                    <input type="checkbox" class="h-5 w-5 rounded bg-gray-900 border-gray-500 text-cyan-500 focus:ring-cyan-600" on:change={() => {
                        if (selectedLibraryTemplates.has(template.id)) {
                            selectedLibraryTemplates.delete(template.id);
                        } else {
                            selectedLibraryTemplates.add(template.id);
                        }
                    }}>
                    <div class="ml-4">
                        <h4 class="font-bold text-white">{template.name}</h4>
                        <p class="text-sm text-gray-400">{template.phase}</p>
                    </div>
                </label>
            {/each}
        </div>
        <div class="mt-6 flex justify-end space-x-3">
            <button type="button" on:click={() => showLibraryModal = false} class="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
            <button type="button" on:click={addTemplatesFromLibrary} class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg">Add to Plan</button>
        </div>
    </div>
</div>
{/if}

<!-- Main Layout -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
	<!-- Active Sessions Panel -->
	<div class="lg:col-span-3 bg-gray-900 rounded-xl p-6 flex flex-col">
		<div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-white">Active Sessions</h2>
            <button on:click={() => showLibraryModal = true} class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg text-sm">
                Library
            </button>
        </div>
		<div 
			class="space-y-3 overflow-y-auto"
			use:dndzone={{ items: activeSessionTemplates, flipDurationMs: 200, dropFromOthersDisabled: true }}
		>
			{#each activeSessionTemplates as template (template.id)}
				<div class="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-grab">
					<h4 class="font-bold text-white">{template.name}</h4>
					<p class="text-sm text-gray-400">{template.phase}</p>
                    <div class="text-xs mt-2 flex gap-4 text-gray-400">
                        <span>Full: {template.contactLoad.full}m</span>
                        <span>Controlled: {template.contactLoad.controlled}m</span>
                    </div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Calendar & Load Summary Panels -->
	<div class="lg:col-span-9 grid grid-cols-1 xl:grid-cols-3 gap-8">
        <!-- Main Calendar Panel -->
        <div class="xl:col-span-2 bg-gray-900 rounded-xl p-6 flex flex-col">
            <!-- Header with View Switcher & Navigation -->
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center">
                    <button on:click={() => changeMonth(-1)} class="p-2 rounded-md hover:bg-gray-700 font-bold">&lt;</button>
                    <h2 class="text-xl font-bold text-white mx-4 text-center w-48">
                        {currentView === 'year' ? currentDate.getFullYear() : `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                    </h2>
                    <button on:click={() => changeMonth(1)} class="p-2 rounded-md hover:bg-gray-700 font-bold">&gt;</button>
                </div>
                <div class="flex items-center gap-x-2">
                    <button on:click={exportAllEventsToIcs} class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-lg text-sm" title="Export all events to .ics file">
                        Export All
                    </button>
                    <div class="flex items-center bg-gray-800 rounded-lg p-1">
                        <button on:click={() => currentView = 'year'} class="px-3 py-1 text-sm rounded-md {currentView === 'year' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}">Year</button>
                        <button on:click={() => currentView = 'month'} class="px-3 py-1 text-sm rounded-md {currentView === 'month' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}">Month</button>
                        <button on:click={() => currentView = 'day'} class="px-3 py-1 text-sm rounded-md {currentView === 'day' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}">Day</button>
                    </div>
                </div>
            </div>

            <!-- Conditional Views -->
            {#if currentView === 'month'}
                <!-- Month View -->
                <div class="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-400 mb-2">
                    <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
                </div>
                <div class="grid grid-cols-7 gap-2" use:dndzone={{ items: [], id: 'calendar-dropzone' }} on:consider={handleDropOnCalendar} on:finalize={handleDropOnCalendar}>
                    {#each calendarDays as day (day ? day.getTime() : Math.random())}
                        {#if day}
                            <div id={day} on:click={() => {selectedDay = day; currentView = 'day';}} class="h-28 bg-gray-800 rounded-md p-1.5 flex flex-col group relative cursor-pointer border-2 border-transparent" class:ring-2={selectedDay?.toDateString() === day.toDateString()} class:ring-cyan-400={selectedDay?.toDateString() === day.toDateString()} class:border-gray-700={new Date().toDateString() === day.toDateString()}>
                                <span class="font-bold text-gray-400 text-sm">{day.getDate()}</span>
                                <div class="space-y-1 mt-1 overflow-y-auto text-xs">
                                    {#each getEventsForDay(day) as event}
                                        <div class="p-1 rounded-md text-left {getCategoryClasses(event.type)} truncate">{event.title}</div>
                                    {/each}
                                </div>
                                <button on:click|stopPropagation={() => openAddEventModal(day)} class="absolute bottom-1 right-1 w-5 h-5 bg-cyan-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm">+</button>
                            </div>
                        {:else}
                            <div class="h-28 bg-gray-900/50 rounded-md" />
                        {/if}
                    {/each}
                </div>
            {:else if currentView === 'year'}
                <!-- Year View -->
                <div class="grid grid-cols-4 gap-4 flex-grow">
                    {#each MONTH_NAMES as month, i}
                        <div class="bg-gray-800 p-2 rounded-lg">
                            <h4 class="font-bold text-center text-cyan-400 mb-2">{month.substring(0,3)}</h4>
                            <div class="grid grid-cols-7 gap-1 text-xs">
                                {#each getCalendarDaysForMonth(new Date(currentDate.getFullYear(), i, 1)) as day}
                                    {#if day}
                                        <div class="w-5 h-5 rounded-sm flex items-center justify-center {getEventsForDay(day).length > 0 ? 'bg-cyan-500/50' : 'bg-gray-700'}">
                                            {day.getDate()}
                                        </div>
                                    {:else}
                                        <div />
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            {:else if currentView === 'day'}
                <!-- Day View -->
                <div class="flex-grow overflow-y-auto pr-2">
                    <h3 class="text-lg font-bold text-white mb-2 text-center">{selectedDay?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                    <div class="space-y-2">
                        {#each Array(18) as _, hour}
                            {@const currentHour = hour + 5} <!-- 5am to 10pm -->
                            <div class="flex">
                                <div class="text-xs text-gray-500 w-16 text-right pr-2 pt-1">{formatTime(`${currentHour}:00`)}</div>
                                <div class="flex-1 border-t border-gray-700 relative h-16">
                                    {#each dailyEvents as event}
                                        {@const startHour = event.startTime ? parseInt(event.startTime.split(':')[0]) : -1}
                                        {#if startHour === currentHour}
                                            <div class="absolute top-2 left-0 w-full pr-2">
                                                <div class="p-3 rounded-lg text-sm {getCategoryClasses(event.type)}">
                                                    <p class="font-bold">{event.title}</p>
                                                    <p class="text-xs">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                                                </div>
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>

        <!-- Weekly Load & Daily Schedule Panel -->
        <div class="xl:col-span-1 bg-gray-900 rounded-xl p-6">
            <h3 class="text-xl font-semibold text-white mb-4">Weekly Contact Load</h3>
            <div class="space-y-4">
                <div>
                    <div class="flex justify-between items-baseline mb-1">
                        <span class="text-base font-medium text-gray-300">Full Contact</span>
                        <span class="text-sm font-semibold {weeklyLoad.full > MAX_FULL_CONTACT ? 'text-red-400' : 'text-gray-400'}">{weeklyLoad.full} / {MAX_FULL_CONTACT} min</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2.5"><div class="h-2.5 rounded-full {weeklyLoad.full > MAX_FULL_CONTACT ? 'bg-red-500' : 'bg-cyan-500'}" style="width: {weeklyLoad.fullPercent}%"></div></div>
                </div>
                <div>
                    <div class="flex justify-between items-baseline mb-1">
                        <span class="text-base font-medium text-gray-300">Controlled Contact</span>
                        <span class="text-sm font-semibold {weeklyLoad.controlled > MAX_CONTROLLED_CONTACT ? 'text-red-400' : 'text-gray-400'}">{weeklyLoad.controlled} / {MAX_CONTROLLED_CONTACT} min</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2.5"><div class="h-2.5 rounded-full {weeklyLoad.controlled > MAX_CONTROLLED_CONTACT ? 'bg-yellow-500' : 'bg-cyan-500'}" style="width: {weeklyLoad.controlledPercent}%"></div></div>
                </div>
                <div class="pt-4 border-t border-gray-700">
                    <h4 class="text-lg font-semibold text-white mb-2">Schedule for {selectedDay?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || '...'}</h4>
                    <div class="space-y-2">
                        {#if dailyEvents.length > 0}
                            {#each dailyEvents as event}
                                <div class="p-2 rounded-lg text-sm {getCategoryClasses(event.type)}">
                                    <p class="font-bold">{event.title}</p>
                                    {#if event.startTime}
                                        <p class="text-xs">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                                    {/if}
                                </div>
                            {/each}
                        {:else}
                            <div class="text-center text-gray-500 pt-4">No events scheduled.</div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
