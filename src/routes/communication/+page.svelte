<script lang="ts">
	let channels = [
		{ id: 1, name: '# General', unread: 2, active: true },
		{ id: 2, name: '# Announcements', unread: 0, active: false },
		{ id: 3, name: '# Ride-Sharing', unread: 5, active: false },
		{ id: 4, name: '# Coaches', unread: 0, active: false }
	];

	let members = [
		{ id: 1, name: 'Adam Hodges', role: 'Admin', status: 'Active', avatar: 'https://placehold.co/40x40/A855F7/FFFFFF?text=AH' },
		{ id: 2, name: 'Aelfric DIDCOT', role: 'Guardian', status: 'Active', avatar: 'https://placehold.co/40x40/f87171/FFFFFF?text=AD' },
		{ id: 3, name: 'Aidan McManara', role: 'Player', status: 'Active', avatar: 'https://placehold.co/40x40/60a5fa/FFFFFF?text=AM' },
		{ id: 4, name: 'Albie White', role: 'Player', status: 'Pending', avatar: 'https://placehold.co/40x40/34d399/FFFFFF?text=AW' },
	];

	let events = [
		{ id: 1, title: 'U18 Training', date: '2025-08-11T18:00', type: 'Training', attendance: { yes: 18, no: 2, pending: 2 } },
		{ id: 2, title: 'Match vs. Rovers', date: '2025-08-13T14:00', type: 'Match', attendance: { yes: 15, no: 1, pending: 6 } },
	];

	let activeTab = 'posts';
</script>

<div class="flex gap-8 h-[calc(100vh-12rem)] text-gray-300">
	<div class="w-1/3 max-w-sm bg-gray-900 rounded-xl p-4 flex flex-col h-full">
		<div class="border-b border-gray-700 pb-4 mb-4 flex-shrink-0">
			<h2 class="text-xl font-bold text-white">U18 Eagles</h2>
			<p class="text-sm text-gray-400">Team Hub</p>
		</div>
		<div class="space-y-2 overflow-y-auto flex-grow">
			{#each channels as channel}
				<div class="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-gray-700 {channel.active ? 'bg-cyan-900/50' : ''}">
					<div>
						<p class="font-semibold text-white">{channel.name}</p>
					</div>
					{#if channel.unread > 0}
						<span class="bg-cyan-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{channel.unread}</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="flex-1 bg-gray-900 rounded-xl flex flex-col h-full">
		<div class="p-4 border-b border-gray-700 flex-shrink-0">
			<div class="flex justify-between items-center">
				<h3 class="text-lg font-bold text-white"># General</h3>
				<div class="bg-gray-800 rounded-full p-1 flex space-x-1">
					<button on:click={() => activeTab = 'posts'} class:bg-cyan-500={activeTab === 'posts'} class:text-white={activeTab === 'posts'} class="px-4 py-1 text-sm font-semibold rounded-full">Posts</button>
					<button on:click={() => activeTab = 'events'} class:bg-cyan-500={activeTab === 'events'} class:text-white={activeTab === 'events'} class="px-4 py-1 text-sm font-semibold rounded-full">Events</button>
					<button on:click={() => activeTab = 'members'} class:bg-cyan-500={activeTab === 'members'} class:text-white={activeTab === 'members'} class="px-4 py-1 text-sm font-semibold rounded-full">Members</button>
					<button on:click={() => activeTab = 'files'} class:bg-cyan-500={activeTab === 'files'} class:text-white={activeTab === 'files'} class="px-4 py-1 text-sm font-semibold rounded-full">Files</button>
				</div>
			</div>
		</div>

		{#if activeTab === 'posts'}
			<div class="flex-grow p-4 overflow-y-auto">
				<div class="max-w-2xl mx-auto w-full space-y-6">
					<div class="bg-gray-800 p-4 rounded-lg">
						<p class="font-semibold text-white">Availability for Match vs. Rovers</p>
						<p class="text-sm text-gray-400 mb-3">Coach Sarah is asking for your availability for the upcoming match.</p>
						<div class="mt-4 grid grid-cols-2 gap-2">
							<button class="w-full text-sm bg-green-500/20 hover:bg-green-500/40 text-green-300 font-semibold py-2 rounded-md">✅ Available</button>
							<button class="w-full text-sm bg-red-500/20 hover:bg-red-500/40 text-red-300 font-semibold py-2 rounded-md">❌ Unavailable</button>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<img src="https://placehold.co/40x40/A855F7/FFFFFF?text=CS" alt="avatar" class="rounded-full w-10 h-10" />
						<div>
							<p class="font-semibold text-cyan-400 text-sm">Coach Sarah</p>
							<div class="bg-gray-800 p-3 rounded-lg mt-1">
								<p>Great response on the availability, team. Let's get a good session in tonight.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="p-4 border-t border-gray-700 flex-shrink-0">
				<form class="flex items-center space-x-2 max-w-2xl mx-auto">
					<button type="button" class="bg-gray-700 hover:bg-gray-600 text-white font-bold p-3 rounded-full transition" title="More options">
						<i class="fas fa-plus"></i>
					</button>
					<div class="flex-grow relative">
						<input type="text" class="w-full bg-gray-800 border border-gray-700 rounded-full px-4 py-3 text-white" placeholder="Type your message..." />
						<button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300" title="Enhance with AI">
							<i class="fas fa-magic"></i>
						</button>
					</div>
					<button type="submit" class="bg-cyan-500 hover:bg-cyan-600 text-white font-bold p-3 rounded-full transition">
						<i class="fas fa-paper-plane"></i>
					</button>
				</form>
			</div>
		{:else}
			<div class="flex-grow overflow-y-auto">
				{#if activeTab === 'events'}
					<div class="p-6 space-y-4">
						{#each events as event}
							<div class="bg-gray-800 p-4 rounded-lg">
								<p class="font-bold text-white">{event.title}</p>
								<p class="text-sm text-gray-400">{new Date(event.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
								{#if event.attendance}
									<div class="flex justify-around text-center mt-3 pt-3 border-t border-gray-700">
										</div>
								{/if}
							</div>
						{/each}
					</div>
				{:else if activeTab === 'members'}
					<div class="p-6">
						<div class="bg-gray-800 rounded-lg overflow-hidden">
							<table class="w-full text-left">
								<thead class="bg-gray-700/50">
									<tr>
										<th class="p-3 text-sm font-semibold">Name</th>
										<th class="p-3 text-sm font-semibold">Role</th>
										<th class="p-3 text-sm font-semibold">Status</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-700">
									{#each members as member}
										<tr class="hover:bg-gray-700">
											<td class="p-3 flex items-center space-x-3">
												<img src={member.avatar} alt={member.name} class="w-8 h-8 rounded-full" />
												<span class="font-medium text-white">{member.name}</span>
											</td>
											<td class="p-3 text-gray-400">{member.role}</td>
											<td class="p-3 text-gray-400">{member.status}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{:else if activeTab === 'files'}
					<div class="p-6 text-center text-gray-500 pt-16">
						<i class="fas fa-folder-open fa-3x mb-4"></i>
						<h4 class="font-semibold text-white">Files & Documents</h4>
						<p class="text-sm">This area is for sharing documents, playbooks, and other files with the group.</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>