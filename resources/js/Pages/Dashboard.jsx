import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Dashboard({ auth }) {
    const [vmStats, setVmStats] = useState({ totalCreated: 0, totalActive: 0 });
    const [site, setSite] = useState('');
    const [domain, setDomain] = useState('');
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [vmCount, setVmCount] = useState(1);

    useEffect(() => {
        // Fetch the VM statistics from your backend or state store
        // This is a mock function, replace it with your actual data fetching logic
        fetchVMStats().then(stats => {
            setVmStats(stats);
        });
    }, []);

    const handleSiteChange = (event) => {
        setSite(event.target.value);
        // Vous pouvez également ajouter une logique ici pour charger les domaines en fonction du site sélectionné
    };

    const handleDomainChange = (event) => {
        setDomain(event.target.value);
        // Chargez les templates disponibles en fonction du site et du domaine sélectionné
        fetchTemplates(site, event.target.value).then(data => {
            setTemplates(data);
        });
    };

    async function fetchTemplates(site, domain) {
        return [
            { id: 1, name: 'Template 1' },
            { id: 2, name: 'Template 2' },
            // Plus de templates...
        ];
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // Logique de création de VM ici
        console.log('Creating VMs:', { site, domain, selectedTemplate, vmCount });
    };

    // Mock function to simulate fetching data, replace with actual data fetching
    async function fetchVMStats() {
        // Fetch data from API or state management
        return {
            totalCreated: 50, // Replace with actual data
            totalActive: 30,  // Replace with actual data
        };
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >

            <Head title="Dashboard"/>

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* VM Statistics Dashboard */}
                    <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="font-semibold text-lg">VM Statistics</h3>
                            <div>Total VMs Created: {vmStats.totalCreated}</div>
                            <div>Total VMs Active: {vmStats.totalActive}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ax-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <h3 className="font-semibold text-lg">Créer une VM</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Site:</label>
                                <select value={site} onChange={handleSiteChange}>
                                    <option value="">Sélectionner un site</option>
                                    {/* Options des sites ici */}
                                </select>
                            </div>
                            <div>
                                <label>Domaine:</label>
                                <select value={domain} onChange={handleDomainChange}>
                                    <option value="">Sélectionner un domaine</option>
                                    {/* Options des domaines ici */}
                                </select>
                            </div>
                            <div>
                                <label>Template:</label>
                                <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
                                    <option value="">Sélectionner un template</option>
                                    {templates.map(template => (
                                        <option key={template.id} value={template.id}>{template.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Nombre de VM à créer:</label>
                                <input type="number" value={vmCount} onChange={(e) => setVmCount(e.target.value)} min="1"/>
                            </div>
                            <button type="submit">Créer VM</button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    );
}
