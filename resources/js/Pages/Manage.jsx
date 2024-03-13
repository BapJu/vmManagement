import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Manage({ auth }) {
    const [events, setEvents] = useState([]);
    const [typeofvms, setTypeOfVms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [action, setAction] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [historiqueChecked, setHistoriqueChecked] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAllVMChecked, setShowAllVMChecked] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('bearerToken');

        fetch('/api/events/current_user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setEvents(data);
            })
            .catch(error => console.error('Error fetching events:', error));
    }, [auth.token]); // Effectuer la requête chaque fois que le token d'authentification change

    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        fetch('/api/typeOfVms', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setTypeOfVms(data);
            })
            .catch(error => console.error('Error fetching typeofdata:', error));
    }, [auth.token]);

    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        fetch('/api/subjects', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setSubjects(data);
            })
            .catch(error => console.error('Error fetching typeofdata:', error));
    }, [auth.token]);

    //use effect de récupération de tous les users
    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        fetch('/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setUsers(data);
            })
            .catch(error => console.error('Error fetching typeofdata:', error));
    }, [auth.token]);

    // Méthode pour obtenir toutes les VM lorsque le bouton est coché
    const handleShowAllVM = () => {
        const token = localStorage.getItem('bearerToken');
        fetch('/api/events', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setEvents(data);
            })
            .catch(error => console.error('Error fetching all events:', error));
    };


    const handleStartVM = (vmId) => {
        const action = { action: "start" };
        const token = localStorage.getItem('bearerToken');

        // Mettez à jour l'état local immédiatement
        setEvents(prevEvents => {
            return prevEvents.map(event =>
                event.id === vmId ? { ...event, active: true } : event
            );
        });

        // Effectuez une requête pour arrêter la VM avec l'ID vmId
        fetch(`/api/event/${vmId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(action),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Vous pouvez effectuer d'autres actions ici si nécessaire
            })
            .catch((error) => {
                console.error('Error:', error);
                // Gérez les erreurs ici
            });
    };

    const handleStopVM = (vmId) => {
        const action = { action: "stop" };
        const token = localStorage.getItem('bearerToken');

        // Mettez à jour l'état local immédiatement
        setEvents(prevEvents => {
            return prevEvents.map(event =>
                event.id === vmId ? { ...event, active: false } : event
            );
        });

        // Effectuez une requête pour arrêter la VM avec l'ID vmId
        fetch(`/api/event/${vmId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(action),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Vous pouvez effectuer d'autres actions ici si nécessaire
            })
            .catch((error) => {
                console.error('Error:', error);
                // Gérez les erreurs ici
            });
    };



    const handleDeleteVM = (vmId) => {
        const action = { action: "destroy" };
        const token = localStorage.getItem('bearerToken');

        // Mettez à jour l'état local immédiatement
        setEvents(prevEvents => {
            return prevEvents.map(event =>
                event.id === vmId ? { ...event, active: false, ip: null } : event
            );
        });

        // Effectuez une requête pour arrêter la VM avec l'ID vmId
        fetch(`/api/event/${vmId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(action),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Vous pouvez effectuer d'autres actions ici si nécessaire
            })
            .catch((error) => {
                console.error('Error:', error);
                // Gérez les erreurs ici
            });
    };

    const getTemplateDescription = (id) => {
        const template = typeofvms.find(template => template.id === id);
        return template ? template.description : '';


    };

    const getSubjectsDescription = (id) => {
        const subject = subjects.find(subject => subject.id === id);
        return subject ? subject.description : '';
    };

    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const filteredEvents = historiqueChecked
        ? events.filter(event => event.ip === null)
        : showAllVMChecked
            ? events
            : events.filter(event => event.id_user === selectedUser);





    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage VMs</h2>}
        >
            <div className="ax-w-7xl mx-auto sm:px-6 lg:px-8 mb-4">
                <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="overflow-x-auto mb-4">
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select user</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>


                        {auth.user.id_role === 1 && (
                            <div>
                                <input
                                    type="checkbox"
                                    id="showAllVMCheckbox"
                                    className="mr-2"
                                    checked={showAllVMChecked}
                                    onChange={() => {
                                        setShowAllVMChecked(!showAllVMChecked);
                                        if (!showAllVMChecked) {
                                            handleShowAllVM();
                                        }
                                    }}
                                />
                                <label htmlFor="showAllVMCheckbox">Show All VMs</label>
                            </div>
                        )}

                        <input
                            type="checkbox"
                            id="historiqueCheckbox"
                            className="mr-2"
                            checked={historiqueChecked}
                            onChange={() => setHistoriqueChecked(!historiqueChecked)}
                        />
                        <label htmlFor="historiqueCheckbox">Historical</label>

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
                                {!historiqueChecked && (
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}

                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEvents.map(event => (
                                (historiqueChecked || event.ip !== null) && (
                                    <tr key={event.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{event.namevm}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{historiqueChecked ? 'Deleted' : event.active ? 'Active' : 'Inactive'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(event.updated_at)}</td>
                                        {event.ip !== null && (
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {event.active ? (
                                                    <FontAwesomeIcon icon={faStop}
                                                                     onClick={() => handleStopVM(event.id)}
                                                                     className="cursor-pointer mr-2"/>
                                                ) : (
                                                    <FontAwesomeIcon icon={faPlay}
                                                                     onClick={() => handleStartVM(event.id)}
                                                                     className="cursor-pointer mr-2"/>
                                                )}
                                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteVM(event.id)}
                                                                 className="cursor-pointer"/>
                                            </td>
                                        )}
                                    </tr>
                                )
                            ))}
                            </tbody>


                        </table>
                    </div>
                </div>
            </div>
            <footer className="py-6 bg-gray-100 dark:bg-gray-800">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    Created by Baptiste & Alexis - Projet M1 2024
                </div>
            </footer>
        </AuthenticatedLayout>
    );
}
