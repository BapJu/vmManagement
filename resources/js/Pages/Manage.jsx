import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm} from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { Button } from 'react-bootstrap';



export default function Manage({ auth }) {
    const [events, setEvents] = useState([]);
    const [typeofvms, setTypeOfVms] = useState([]);


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
        fetch('/api/typeofvms', {
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage VMs</h2>}
        >
            <div>
                <h3>VMs List</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.id}>
                                    <td>{event.name}</td>
                                    <td>{event.active ? 'Active' : 'Inactive'}</td>
                                    <td>
                                        <Button onClick={() => handleStartVM(event.id)}>Start</Button>
                                        <Button onClick={() => handleStopVM(event.id)}>Stop</Button>
                                        <Button onClick={() => handleDeleteVM(event.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

            </div>
        </AuthenticatedLayout>
    );
}

