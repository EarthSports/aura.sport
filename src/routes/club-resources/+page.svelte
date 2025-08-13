<script lang="ts">
	import { Upload, FileText, BookOpen, BrainCircuit, ShieldCheck } from 'lucide-svelte';

	// Mock data for the resources
	const resources = {
		coreKnowledgeBase: [
			{ name: 'Concurrent Training Review (Baar, 2014).pdf', category: 'Physiology' },
			{ name: 'Braking Performance Framework (Harper, 2022).pdf', category: 'Biomechanics' },
			{ name: 'Tendon Health & Isometrics.pdf', category: 'Rehab' },
		],
		clubKnowledgeBase: [
			{ name: 'Bath Rugby U18 Playbook.pdf', category: 'Tactics' },
			{ name: 'Club Code of Conduct.pdf', category: 'Culture' },
		],
		clubDocuments: [
			{ name: 'Academy Nutrition Guide.pdf', category: 'Nutrition' },
			{ name: 'Concussion Protocol.pdf', category: 'Medical' },
			{ name: 'Player Consent Form.pdf', category: 'Admin' },
			{ name: 'Medical Release Form.pdf', category: 'Admin' },
		]
	};

</script>

<div class="p-8 text-white">
		<p class="text-gray-400 mb-10">A central library for all important club documents and the knowledge base for the AI Assistant Coach.</p>

	<!-- Aura's Core Science Library -->
	<div class="mb-12">
		<div class="flex justify-between items-center mb-6 border-b-2 border-cyan-500 pb-2">
			<h2 class="text-2xl font-bold flex items-center gap-3"><ShieldCheck /> Aura's Core Science Library</h2>
		</div>
		<p class="text-sm text-gray-400 mb-6 -mt-4">This curated, read-only library of peer-reviewed research forms the scientific foundation for the AI Assistant Coach.</p>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each resources.coreKnowledgeBase as doc}
				<div class="bg-gray-800 p-4 rounded-lg flex items-center gap-4 hover:bg-gray-700/50 transition-colors">
					<FileText class="text-cyan-400 flex-shrink-0" size={32} />
					<div>
						<p class="font-semibold text-white">{doc.name}</p>
						<p class="text-xs text-gray-400">{doc.category}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Your Club's AI Resources -->
	<div class="mb-12">
		<div class="flex justify-between items-center mb-6 border-b-2 border-yellow-500 pb-2">
			<h2 class="text-2xl font-bold flex items-center gap-3"><BrainCircuit /> Your Club's AI Resources</h2>
			<button class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-2">
				<Upload size={16} /> Upload Your Documents
			</button>
		</div>
		<p class="text-sm text-gray-400 mb-6 -mt-4">Upload your own playbooks and manuals here to teach the AI your specific coaching philosophy and terminology.</p>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each resources.clubKnowledgeBase as doc}
				<div class="bg-gray-800 p-4 rounded-lg flex items-center gap-4 hover:bg-gray-700/50 transition-colors">
					<FileText class="text-yellow-400 flex-shrink-0" size={32} />
					<div>
						<p class="font-semibold text-white">{doc.name}</p>
						<p class="text-xs text-gray-400">{doc.category}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- General Club Documents -->
	<div>
		<div class="flex justify-between items-center mb-6 border-b-2 border-gray-500 pb-2">
			<h2 class="text-2xl font-bold flex items-center gap-3"><BookOpen /> General Club Documents</h2>
			<button class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-2">
				<Upload size={16} /> Upload Document
			</button>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each resources.clubDocuments as doc}
				<div class="bg-gray-800 p-4 rounded-lg flex items-center gap-4 hover:bg-gray-700/50 transition-colors">
					<FileText class="text-gray-400 flex-shrink-0" size={32} />
					<div>
						<p class="font-semibold text-white">{doc.name}</p>
						<p class="text-xs text-gray-400">{doc.category}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
