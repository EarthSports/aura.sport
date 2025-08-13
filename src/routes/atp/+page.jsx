import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarController,
    LineController
} from 'chart.js';
import { Calendar, FileDown, Bot, X, Users, User, ChevronDown } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, BarController, LineController
);

// --- MOCK DATA & MODELS ---
const mockAthletes = [
    { id: 1, name: 'Max Hooper', position: 'Fly-half', group: 'Backs', status: 'Full Training' },
    { id: 2, name: 'William Jordan-Willis', position: 'Back Row', group: 'Forwards', status: 'Full Training' },
    { id: 3, name: 'Harry Allies', position: 'Prop', group: 'Forwards', status: 'Rehab' },
    { id: 4, name: 'Henry Sui', position: 'Centre', group: 'Backs', status: 'Prehab' },
    { id: 5, name: 'Frederick Lomas', position: 'Back Row', group: 'Forwards', status: 'Full Training' },
    { id: 6, name: 'Caspar Dalby-Welsh', position: 'Back Row', group: 'Forwards', status: 'Full Training' },
    { id: 7, name: 'Charlie Day', position: 'Centre', group: 'Backs', status: 'Extra Skills' },
];

const generateATPData = () => {
    let weeks = [];
    const phases = [
        { name: 'Prep Phase', duration: 8, color: 'rgba(59, 130, 246, 0.1)', borderColor: '#3B82F6' },
        { name: 'Rugby Development', duration: 12, color: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' },
        { name: 'Competition', duration: 20, color: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444' },
        { name: 'Peaking', duration: 4, color: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B' },
        { name: 'Recovery', duration: 4, color: 'rgba(107, 114, 128, 0.1)', borderColor: '#6B7280' },
        { name: 'R & R', duration: 4, color: 'rgba(168, 85, 247, 0.1)', borderColor: '#A855F7' }
    ];
    const events = [
        { week: 7, name: 'Pre-Season Friendly' }, { week: 15, name: 'Saracens (A)' }, { week: 16, name: 'Harlequins (H)' },
        { week: 24, name: 'Academy Finals Day' }, { week: 35, name: '7s Tournament' }
    ];
    let weekCounter = 1;
    let lastLoad = { all: 300, forwards: 320, backs: 280 };
    let form = { all: -5, forwards: -6, backs: -4 };

    phases.forEach(phase => {
        for (let i = 1; i <= phase.duration; i++) {
            let plannedLoad = {};
            ['all', 'forwards', 'backs'].forEach(group => {
                let load = lastLoad[group];
                if (i % 4 === 0) load *= (0.65 + Math.random() * 0.1);
                else load *= (1.05 + Math.random() * 0.05);
                
                // Add group-specific variation
                if(group === 'forwards') load *= 1.05;
                if(group === 'backs') load *= 0.95;

                plannedLoad[group] = Math.round(load);
                form[group] += (lastLoad[group] / 100) - (plannedLoad[group] / 80);
            });

            weeks.push({
                week: weekCounter, period: phase.name,
                plannedLoad,
                actualLoad: {
                    all: Math.random() > 0.3 ? Math.round(plannedLoad.all * (0.9 + Math.random() * 0.2)) : null,
                    forwards: Math.random() > 0.3 ? Math.round(plannedLoad.forwards * (0.9 + Math.random() * 0.2)) : null,
                    backs: Math.random() > 0.3 ? Math.round(plannedLoad.backs * (0.9 + Math.random() * 0.2)) : null,
                },
                form: { all: Math.round(form.all), forwards: Math.round(form.forwards), backs: Math.round(form.backs) },
                event: events.find(e => e.week === weekCounter)?.name || null,
            });
            lastLoad = plannedLoad;
            weekCounter++;
        }
    });
    return { weeks, phases };
};

const atpData = generateATPData();

// --- COMPONENTS ---

const ATPChart = ({ data, onWeekClick, filter }) => {
    const chartData = {
        labels: data.weeks.map(w => `W${w.week}`),
        datasets: [
            { type: 'bar', label: 'Actual Load', data: data.weeks.map(w => w.actualLoad[filter]), backgroundColor: '#0e7490', borderColor: '#0891b2', borderWidth: 1, order: 3, barPercentage: 0.6 },
            { type: 'bar', label: 'Planned Load', data: data.weeks.map(w => w.plannedLoad[filter]), backgroundColor: '#374151', borderColor: '#4b5563', borderWidth: 1, order: 4, barPercentage: 0.6 },
            { label: 'Form (TSB)', type: 'line', data: data.weeks.map(w => w.form[filter]), borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.1)', tension: 0.4, yAxisID: 'y1', order: 1, fill: true }
        ]
    };
    const options = {
        responsive: true, maintainAspectRatio: false,
        onClick: (evt, elements) => { if (elements.length > 0) onWeekClick(data.weeks[elements[0].index]); },
        plugins: {
            legend: { position: 'top', labels: { color: '#9ca3af', boxWidth: 12, padding: 20 } },
            tooltip: { mode: 'index', intersect: false, backgroundColor: '#1f2937', titleColor: '#e5e7eb', bodyColor: '#d1d5db' },
        },
        scales: {
            x: { ticks: { color: '#9ca3af', autoSkip: true, maxTicksLimit: 26 }, grid: { display: false } },
            y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Load (AU)', color: '#9ca3af' }, ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
            y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Form (TSB)', color: '#9ca3af' }, ticks: { color: '#9ca3af' }, grid: { display: false } }
        }
    };
    return <Bar data={chartData} options={options} />;
};

const ATPTable = ({ data, onWeekClick, filter }) => {
    const getPeriodColor = (period) => atpData.phases.find(p => p.name === period)?.borderColor || '#6B7280';
    return (
        <div className="overflow-y-auto flex-grow bg-gray-900/50 rounded-lg">
            <table className="w-full text-left">
                <thead className="bg-gray-800 sticky top-0 z-10">
                    <tr className="text-sm font-semibold text-gray-400">
                        <th className="p-3">Week</th><th className="p-3">Period</th><th className="p-3">Planned Load</th>
                        <th className="p-3">Actual Load</th><th className="p-3">Form (TSB)</th><th className="p-3">Event</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {data.weeks.map(week => (
                        <tr key={week.week} className="hover:bg-gray-800/60 cursor-pointer" onClick={() => onWeekClick(week)}>
                            <td className="p-3 font-medium text-white">{week.week}</td>
                            <td className="p-3"><span className="px-3 py-1 text-xs font-semibold rounded-full text-white" style={{ backgroundColor: getPeriodColor(week.period) }}>{week.period}</span></td>
                            <td className="p-3 text-gray-300">{week.plannedLoad[filter]}</td>
                            <td className="p-3 text-cyan-400">{week.actualLoad[filter] || '-'}</td>
                            <td className={`p-3 font-mono ${week.form[filter] >= 0 ? 'text-green-400' : 'text-yellow-400'}`}>{week.form[filter]}</td>
                            <td className="p-3 text-yellow-400 text-xs">{week.event || ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const WeekDetailModal = ({ week, onClose }) => {
    const [view, setView] = useState('squad'); // squad or individual
    const [selectedAthleteId, setSelectedAthleteId] = useState(mockAthletes[0].id);

    if (!week) return null;

    const getIndividualizedSessions = (athlete) => {
        const baseSessions = [
            { day: 'Monday', type: 'Strength', focus: 'Max Strength (Lower Body)' },
            { day: 'Tuesday', type: 'Conditioning', focus: 'Tempo Runs' },
            { day: 'Wednesday', type: 'Rest', focus: 'Active Recovery' },
            { day: 'Thursday', type: 'Strength', focus: 'Max Strength (Upper Body)' },
            { day: 'Friday', type: 'Pitch Session', focus: 'Game Scenarios' },
            { day: 'Saturday', type: 'Match Day', focus: week.event || 'Internal Game' },
            { day: 'Sunday', type: 'Rest', focus: 'Full Rest' },
        ];

        if (!athlete) return baseSessions;

        let individualized = baseSessions.map(s => ({ ...s }));

        if (athlete.status === 'Rehab') {
            individualized = individualized.map(s => 
                s.type === 'Strength' ? { ...s, type: 'Rehab', focus: 'Physio-led Rehab Circuit', tag: 'Rehab' } : s
            );
        }
        if (athlete.status === 'Prehab') {
             individualized.find(s => s.day === 'Monday').focus += ' + Prehab protocol';
             individualized.find(s => s.day === 'Monday').tag = 'Prehab';
        }
        if (athlete.status === 'Extra Skills') {
            individualized.splice(2, 0, { day: 'Tuesday PM', type: 'Skills', focus: 'Kicking Practice', tag: 'Extra' });
        }
        
        // Group-specific adjustments
        individualized.forEach(s => {
            if(s.type === 'Strength') s.focus += athlete.group === 'Forwards' ? ' - Emphasis on Power' : ' - Emphasis on Speed';
        });

        return individualized;
    };

    const selectedAthlete = mockAthletes.find(a => a.id === selectedAthleteId);
    const sessions = view === 'squad' ? getIndividualizedSessions(null) : getIndividualizedSessions(selectedAthlete);

    const getTagColor = (tag) => {
        switch(tag) {
            case 'Rehab': return 'bg-red-500';
            case 'Prehab': return 'bg-yellow-500';
            case 'Extra': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-3xl border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-bold text-white">Week {week.week}: {week.period}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>

                <div className="flex items-center border-b border-gray-700 mb-4">
                    <button onClick={() => setView('squad')} className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${view === 'squad' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}`}><Users size={16}/> Squad Plan</button>
                    <button onClick={() => setView('individual')} className={`px-4 py-2 text-sm font-medium flex items-center gap-2 ${view === 'individual' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-400'}`}><User size={16}/> Individual Plan</button>
                </div>

                {view === 'individual' && (
                    <div className="mb-4">
                        <select value={selectedAthleteId} onChange={e => setSelectedAthleteId(Number(e.target.value))} className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2">
                            {mockAthletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.position}) - {a.status}</option>)}
                        </select>
                    </div>
                )}

                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {sessions.map(session => (
                        <div key={session.day} className="bg-gray-900/80 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-bold text-white flex items-center">{session.day}: <span className="font-normal text-cyan-400 ml-2">{session.type}</span> {session.tag && <span className={`ml-3 text-xs px-2 py-0.5 rounded-full text-white ${getTagColor(session.tag)}`}>{session.tag}</span>}</p>
                                <p className="text-sm text-gray-400">Focus: {session.focus}</p>
                            </div>
                            <button className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold py-2 px-4 rounded-lg">View Session</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'forwards', 'backs'

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans p-4 lg:p-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 h-[92vh] flex flex-col backdrop-blur-sm">
                <div className="flex flex-wrap justify-between items-center mb-4 flex-shrink-0 gap-4">
                    <h2 className="text-3xl font-bold text-white">Annual Training Plan: U18s 2025-2026</h2>
                    <div className="flex items-center gap-2">
                         <div className="relative">
                            <select onChange={(e) => setFilter(e.target.value)} value={filter} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 pl-4 pr-8 rounded-lg appearance-none cursor-pointer">
                                <option value="all">All Squad</option>
                                <option value="forwards">Forwards</option>
                                <option value="backs">Backs</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"><Bot className="mr-2" size={16} /> AI Plan Builder</button>
                    </div>
                </div>

                <div className="flex-shrink-0 h-80 md:h-96 mb-6">
                    <ATPChart data={atpData} onWeekClick={setSelectedWeek} filter={filter} />
                </div>

                <ATPTable data={atpData} onWeekClick={setSelectedWeek} filter={filter} />
            </div>
            
            <WeekDetailModal week={selectedWeek} onClose={() => setSelectedWeek(null)} />
        </div>
    );
}
