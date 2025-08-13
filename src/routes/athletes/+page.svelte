<script lang="ts">
	import { goto } from '$app/navigation';

	// --- STATE ---
	let athletes = [
		{ id: 1, name: 'Alfie', position: 'Flanker', compliance: 95, readiness: 8.5, status: 'Ready' },
		{ id: 2, name: 'Ben', position: 'Fly-half', compliance: 88, readiness: 6.5, status: 'Fatigued' },
		{ id: 3, name: 'Charlie', position: 'Prop', compliance: 98, readiness: 5.0, status: 'At Risk' }
	];

	// This function now navigates to the dedicated athlete profile page
	function viewAthlete(athlete) {
		goto(`/athletes/${athlete.id}`);
	}

	function getStatusClasses(status: string) {
		switch (status) {
			case 'Ready':
				return 'bg-green-500/10 text-green-400';
			case 'Fatigued':
				return 'bg-yellow-500/10 text-yellow-400';
			case 'At Risk':
				return 'bg-red-500/10 text-red-400';
			default:
				return 'bg-gray-500/10 text-gray-400';
		}
	}
</script>

<div>
	<div class="bg-gray-900 rounded-xl overflow-x-auto">
		<table class="w-full text-left">
			<thead>
				<tr class="border-b border-gray-700 text-sm font-semibold text-gray-400">
					<th class="p-4">Name</th>
					<th class="p-4">Position</th>
					<th class="p-4">Status</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-800">
				{#each athletes as athlete}
					<tr class="hover:bg-gray-800 cursor-pointer" on:click={() => viewAthlete(athlete)}>
						<td class="p-4 font-medium text-white">{athlete.name}</td>
						<td class="p-4 text-gray-400">{athlete.position}</td>
						<td class="p-4">
							<span class="px-2 py-1 text-xs font-semibold rounded-full {getStatusClasses(athlete.status)}">
								{athlete.status}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
