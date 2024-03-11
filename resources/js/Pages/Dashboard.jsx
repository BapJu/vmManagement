import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm} from '@inertiajs/react';
import {useEffect, useState} from 'react';

export default function Dashboard({auth}) {
    const [vmStats, setVmStats] = useState({totalCreated: 0, totalActive: 0});
    const [site, setSite] = useState('');
    const [domain, setDomain] = useState('');
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [vmCount, setVmCount] = useState(1);


    const {data, setData, patch, errors, processing, recentlySuccessful} = useForm({
        id_localisation: 1,
        id_subject: 1,
        id_typeofvm: null,
        id_storage: 1,
        nb_vm: vmCount,
        id_user: auth.user.id,
        end_date: null,
    });

    const handleVmCountChange = (e) => {
        const newCount = e.target.value;
        setVmCount(newCount); // Met à jour l'état local
        setData('nb_vm', newCount); // Met à jour la valeur dans `data` pour le formulaire
    };

    const [localisations, setLocalisation] = useState([]);

    useEffect(() => {
        fetch('/api/localisations')
            .then(response => response.json())
            .then(data => {
                setLocalisation(data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);

    const [subjects, setSubject] = useState([]);

    useEffect(() => {
        fetch('/api/subjects')
            .then(response => response.json())
            .then(data => {
                setSubject(data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []);


    useEffect(() => {
        if (data.id_localisation && data.id_subject) {
            fetch(`/api/typeOfVms/location=${data.id_localisation}/subject=${data.id_subject}`)
                .then(response => response.json())
                .then(data => {
                    setTemplates(data);
                })
                .catch(error => {
                    console.error('Error fetching roles:', error);
                });
        }
    }, [data]);


    const [storages, setStorage] = useState([]);

    useEffect(() => {
        fetch(`/api/storages`)
            .then(response => response.json())
            .then(data => {
                setStorage(data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, [data]);


    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        fetch(`api/event/user/${auth.user.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

            .then(response => response.json())
            .then(data => {
                // Calculate the total number of VMs created
                const totalCreated = data.length;

                // Calculate the total number of active VMs
                const totalActive = data.filter(vm => vm.active).length;

                // Update the vmStats state with these calculated values
                setVmStats({totalCreated, totalActive});
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, []); // Removed vmStats from dependency array to prevent re-fetching


    const handleSubmit = (event) => {
        event.preventDefault();

        const token = localStorage.getItem('bearerToken');
        console.log('Creating VMs:', data);
        fetch('/api/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            })
    };

    console.log(data);
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
                            <h3 className="font-semibold text-lg">Vos Statistics VM</h3>
                            <div>Total VMs Created: {vmStats.totalCreated}</div>
                            <div>Total VMs Active: {vmStats.totalActive}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ax-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="max-w-lg mx-auto mt-4">
                        <h3 className="font-semibold text-lg">Créer une VM</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="localisation" className="block text-gray-700">Site:</label>
                                <select
                                    id="localisation"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    onChange={(e) => setData('id_localisation', e.target.value)}
                                    required
                                >
                                    {localisations.map(localisation => (
                                        <option key={localisation.id}
                                                value={localisation.id}>{localisation.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="subject" className="block text-gray-700">Domaine:</label>
                                <select
                                    id="subject"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    onChange={(e) => setData('id_subject', e.target.value)}
                                    required
                                >
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.description}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="storage" className="block text-gray-700">Mémoire:</label>
                                <select
                                    id="storage"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    onChange={(e) => setData('id_storage', e.target.value)}
                                    required
                                >
                                    {storages.map(storage => (
                                        <option key={storage.id} value={storage.id}>{storage.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="template" className="block text-gray-700">Template:</label>
                                <select
                                    id="template"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    onChange={(e) => setData('id_typeofvm', e.target.value)}
                                    required
                                >
                                    <option value="">Choisissez votre template</option>
                                    {templates.map(template => (
                                        <option key={template.id} value={template.id}>{template.description}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="end_date" className="block text-gray-700">Date de fin des Vms:</label>
                                <input
                                    id="end_date"
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    onChange={(e) => setData('end_date', e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="vmCount" className="block text-gray-700">Nombre de VM à créer:</label>
                                <input
                                    id="vmCount"
                                    type="number"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    value={vmCount}
                                    onChange={handleVmCountChange} // Utilisez handleVmCountChange pour gérer les changements
                                    required
                                />

                            </div>
                            <button
                                type="submit"
                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Créer VM
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    )
        ;
}
