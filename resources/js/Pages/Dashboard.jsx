import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm} from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function Dashboard({ auth }) {
    const [vmStats, setVmStats] = useState({ totalCreated: 0, totalActive: 0 });
    const [site, setSite] = useState('');
    const [domain, setDomain] = useState('');
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [vmCount, setVmCount] = useState(1);



    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        id_localisation: 1,
        id_subject: 1,
        id_typeofvm: null,
        id_storage: 1,
        nb_vm: 1,
        id_user: auth.user.id,
        end_date: null,
    });

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



    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Creating VMs:', data);
        fetch('/api/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }

    // Mock function to simulate fetching data, replace with actual data fetching
    async function fetchVMStats() {
        // Fetch data from API or state management
        return {
            totalCreated: 50, // Replace with actual data
            totalActive: 30,  // Replace with actual data
        };
    }

    useEffect(() => {
        fetch(`api/event/user/${auth.user.id}`)
            .then(response => response.json())
            .then(data => {
                setVmStats(data);
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    }, [vmStats]);
    console.log(vmStats);
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
                                <select
                                    id="localisation"
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('id_localisation', e.target.value)}
                                    required>
                                    {localisations.map(localisation => (
                                        <option key={localisation.id}
                                                value={localisation.id}>{localisation.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Domaine:</label>
                                <select
                                    id="subject"
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('id_subject', e.target.value)}
                                    required>
                                    {subjects.map(subject => (
                                        <option key={subject.id}
                                                value={subject.id}>{subject.description}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Mémoire:</label>
                                <select
                                    id="storage"
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('id_storage', e.target.value)}
                                    required>
                                    {storages.map(storage => (
                                        <option key={storage.id}
                                                value={storage.id}>{storage.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Template:</label>
                                <select
                                    id="template"
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('id_typeofvm', e.target.value)}
                                    required>
                                    {templates.map(template => (
                                        <option key={template.id}
                                                value={template.id}>{template.description}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Date de fin des Vms:</label>
                                <input type="date" onChange={(e) => setData('end_date', e.target.value)}/>
                            </div>
                            <div>
                                <label>Nombre de VM à créer:</label>
                                <input type="number" value={vmCount} onChange={(e) => setData('nb_vm', e.target.value)}
                                       min="1"
                                />
                            </div>
                            <button type="submit">Créer VM</button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    );
}
