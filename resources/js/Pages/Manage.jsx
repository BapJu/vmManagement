import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Manage({ auth }) {
    const [events, setEvents] = useState([]);
    const [typeofvms, setTypeOfVms] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Effectuer une requête pour récupérer les événements de l'utilisateur
        fetch('/api/events', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setEvents(data);
            })
            .catch(error => console.error('Error fetching events:', error));
    }, [auth.token]); // Effectuer la requête chaque fois que le token d'authentification change

    useEffect(() => {
        fetch('/api/typeOfVms', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setTypeOfVms(data);
            })
            .catch(error => console.error('Error fetching typeofdata:', error));
    }, [auth.token]);

    const handleStartVM = (vmId) => {
        // Effectuer une requête pour démarrer la VM avec l'ID vmId
        console.log('Starting VM with ID:', vmId);
    };

    const handleStopVM = (vmId) => {
        // Effectuer une requête pour arrêter la VM avec l'ID vmId
        console.log('Stopping VM with ID:', vmId);
    };

    const handleDeleteVM = (vmId) => {
        // Effectuer une requête pour supprimer la VM avec l'ID vmId
        console.log('Deleting VM with ID:', vmId);
    };

    const getTemplateDescription = (id) => {
        const template = typeofvms.find(template => template.id === id);
        return template ? template.description : '';


    };

    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }


    const filteredEvents = events.filter(event => {
        return event.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage VMs</h2>}
        >
            <div className="ax-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="overflow-x-auto">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="p-2 border border-gray-300 rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last update
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {events.map(event => (
                                <tr key={event.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{getTemplateDescription(event.id_typeofvm)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{event.active ? 'Active' : 'Inactive'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(event.updated_at)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {event.active ? (
                                            <FontAwesomeIcon icon={faStop} onClick={() => handleStopVM(event.id)}
                                                             className="cursor-pointer mr-2"/>
                                        ) : (
                                            <FontAwesomeIcon icon={faPlay} onClick={() => handleStartVM(event.id)}
                                                             className="cursor-pointer mr-2"/>
                                        )}
                                        <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteVM(event.id)}
                                                         className="cursor-pointer"/>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
