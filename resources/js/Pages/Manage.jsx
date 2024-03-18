import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay, faStop, faTrash} from '@fortawesome/free-solid-svg-icons';

export default function Manage({auth}) {
    const [events, setEvents] = useState([]);
    const [typeofvms, setTypeOfVms] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [historiqueChecked, setHistoriqueChecked] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        fetch('/api/events/current_user', {
            method: 'GET', headers: {
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
        const url = selectedUserId ? `/api/events/user/${selectedUserId}` : '/api/events';

        fetch(url, {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setEvents(data);
            })
            .catch(error => console.error('Error fetching events:', error));
    }, [auth.token, selectedUserId]);


    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        fetch('/api/typeOfVms', {
            method: 'GET', headers: {
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
            method: 'GET', headers: {
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
            method: 'GET', headers: {
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
    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        fetch('/api/events', {
            method: 'GET', headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setEvents(data);
            })
            .catch(error => console.error('Error fetching all events:', error));
    }, [auth.token]);


    const handleStartVM = (vmId) => {
        const action = {action: "start"};
        const token = localStorage.getItem('bearerToken');

        // Mettez à jour l'état local immédiatement
        setEvents(prevEvents => {
            return prevEvents.map(event => event.id === vmId ? {...event, active: true} : event);
        });

        // Effectuez une requête pour arrêter la VM avec l'ID vmId
        fetch(`/api/event/${vmId}`, {
            method: 'PUT', headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json',
            }, body: JSON.stringify(action),
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
        const action = {action: "stop"};
        const token = localStorage.getItem('bearerToken');

        // Mettez à jour l'état local immédiatement
        setEvents(prevEvents => {
            return prevEvents.map(event => event.id === vmId ? {...event, active: false} : event);
        });

        // Effectuez une requête pour arrêter la VM avec l'ID vmId
        fetch(`/api/event/${vmId}`, {
            method: 'PUT', headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json',
            }, body: JSON.stringify(action),
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
        const action = {action: "destroy"};
        const token = localStorage.getItem('bearerToken');

        // Mettez à jour l'état local immédiatement
        setEvents(prevEvents => {
            return prevEvents.map(event => event.id === vmId ? {...event, active: false, ip: null} : event);
        });

        // Effectuez une requête pour arrêter la VM avec l'ID vmId
        fetch(`/api/event/${vmId}`, {
            method: 'PUT', headers: {
                'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json',
            }, body: JSON.stringify(action),
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

    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const handleUserSelection = (e) => {
        const selectedUserId = e.target.value;
        setSelectedUserId(selectedUserId);
    };

    return (<AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manage VMs</h2>}
        >
            <div className="ax-w-7xl mx-auto sm:px-6 lg:px-8 mb-4">
                <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="overflow-x-auto mb-4">

                        {auth.user.id_role === 1 && (<select
                            value={selectedUserId}
                            onChange={handleUserSelection} // Utiliser la fonction de gestion de sélection d'utilisateur
                            className="p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select user</option>
                            {users.map(user => (<option key={user.id} value={user.id}>{user.name}</option>))}
                        </select>)}

                        <div className="flex items-center justify-center">
                            <label htmlFor="historiqueToggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="historiqueToggle" className="sr-only"
                                           checked={historiqueChecked}
                                           onChange={() => setHistoriqueChecked(!historiqueChecked)}/>
                                    <div
                                        className={`block w-14 h-8 rounded-full transition-colors duration-200 ${historiqueChecked ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                                    <div
                                        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 transform ${historiqueChecked ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                                <div className="ml-3 text-gray-700 font-medium">
                                    Historical
                                </div>
                            </label>
                        </div>


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
                            {events.map(event => ((historiqueChecked || event.ip !== null) && // Afficher si l'historique est coché ou s'il y a une adresse IP
                                ((auth.user.id_role === 1) || // Si l'utilisateur est un administrateur
                                    (selectedUserId && event.id_user === selectedUserId) || // Si un utilisateur est sélectionné et l'événement appartient à cet utilisateur
                                    (!selectedUserId && event.id_user === auth.user.id) // Si aucun utilisateur n'est sélectionné et l'événement appartient à l'utilisateur actuel
                                ) && (<tr key={event.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{event.namevm}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {historiqueChecked && !event.ip ? 'Deleted' : event.active ? 'Active' : 'Inactive'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(event.updated_at)}</td>
                                    {event.ip !== null && auth.user.id_role !== 4 && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {event.active ? (<FontAwesomeIcon icon={faStop}
                                                                              onClick={() => handleStopVM(event.id)}
                                                                              className="cursor-pointer mr-2"/>) : (
                                                <FontAwesomeIcon icon={faPlay}
                                                                 onClick={() => handleStartVM(event.id)}
                                                                 className="cursor-pointer mr-2"/>)}
                                            <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteVM(event.id)}
                                                             className="cursor-pointer"/>
                                        </td>)}
                                </tr>)))}
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
    </AuthenticatedLayout>);
}
