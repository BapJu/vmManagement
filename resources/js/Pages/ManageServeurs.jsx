import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {useEffect, useState} from 'react';
import _ from 'lodash';

export default function Manage({auth}) {
    const [serveurs, setServeurs] = useState([]);

    const [search, setSearch] = useState("");
    const [showAddServeur, setShowAddServeur] = useState(false);
    const [newServeur, setNewServeur] = useState({
        address_ip: '',
        noeud: '',
        ssh_user: '',
        ssh_password: ''
    });

    useEffect(() => {
        fetchData('/api/serveurs', setServeurs);
    }, [auth.token]);

    function fetchData(url, setState) {
        const token = localStorage.getItem('bearerToken');
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(setState)
            .catch(error => console.error(`Error fetching data from ${url}:`, error));
    }


    const handleUpdate = (templateId, field, value) => {
        const updatedTemplates = serveurs.map(serveur =>
            serveur.id === templateId ? {...serveur, [field]: value} : serveur
        );
        setServeur(updatedTemplates);
        const token = localStorage.getItem('bearerToken');
        debouncedUpdate(serveurId, field, value, token);
    };

    const handleNewServeurChange = (field, value) => {
        setNewServeur(prev => ({...prev, [field]: value}));
    };

    const addNewServeur = () => {
        const token = localStorage.getItem('bearerToken');
        fetch('/api/serveur', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newServeur),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setServeurs(prev => [...prev, data]);
                setNewServeur({
                    address_ip: '',
                    noeud: '',
                    ssh_user: '',
                    ssh_password: ''
                });
                setShowAddServeur(false);
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const filteredServeur = serveurs.filter(serveur =>
        serveur.noeud.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (serveurId) => {
        const token = localStorage.getItem('bearerToken');
        fetch(`/api/serveur/${serveurId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setTemplates(serveurs.filter(serveur => serveur.id !== templateId));
            })
            .catch(error => console.error('Error:', error));
    };

    const confirmDeleteServeur = (serveurId) => {
        const confirmation = window.confirm("Are you sure you want to delete this serveur?");
        if (confirmation) {
            handleDelete(serveurId);
        }
    };

    function isFormValid() {
        return (

            newServeur.address_ip !== '' &&
            newServeur.noeud !== '' &&
            newServeur.ssh_user !== '' &&
            newServeur.ssh_password !== ''

        );
    }

    function handleAddServeurClick() {
        if (isFormValid()) {
            alert("Attention : Ne pas oublier d'ajouter le nouveau serveur au serveur Proxmox. En cas d'incompréhension, veuillez contacter Mr Vignaud.");
            addNewServeur();
        } else {
            alert("Veuillez remplir tous les champs avant d'ajouter le serveur.");
        }
    }

    return (
        <AuthenticatedLayout user={auth.user}
                             header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gérer les
                                 serveurs</h2>}>
            <div className="ax-w-7xl mx-auto sm:px-6 lg:px-8 mb-4">
                <div className="mb-4">
                    <input type="text" className="form-input mt-1 block w-full" placeholder="Rechercher un serveur..."
                           value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <button onClick={() => setShowAddServeur(!showAddServeur)}
                            className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        {showAddServeur ? 'Cancel' : 'Add serveur'}
                    </button>
                </div>
                {showAddServeur && (
                    <div>
                        <input type="text" placeholder="serveur ID" value={newServeur.address_ip}
                               onChange={(e) => handleNewServeurChange('address_ip', e.target.value)}
                               className="form-input mt-1 block" required/>
                        <input type="text" placeholder="Description" value={newServeur.noeud}
                               onChange={(e) => handleNewServeurChange('noeud', e.target.value)}
                               className="form-input mt-1 block" required/>
                        <input type="text" placeholder="Description" value={newServeur.ssh_user}
                               onChange={(e) => handleNewServeurChange('ssh_user', e.target.value)}
                               className="form-input mt-1 block" required/>
                        <input type="text" placeholder="Description" value={newServeur.ssh_password}
                               onChange={(e) => handleNewServeurChange('ssh_password', e.target.value)}
                               className="form-input mt-1 block" required/>
                        <button onClick={handleAddServeurClick} disabled={!isFormValid()}
                                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add
                            serveur
                        </button>
                    </div>
                )}

                <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="overflow-x-auto mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Noeud
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address
                                    IP
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SSH
                                    User
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredServeur.map(serveur => (
                                <tr key={serveur.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            className="form-input rounded-md"
                                            value={serveur.noeud}
                                            onChange={(e) => handleUpdate(serveur.id, 'noeud', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            className="form-input rounded-md"
                                            value={serveur.address_ip}
                                            onChange={(e) => handleUpdate(serveur.id, 'address_ip', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            className="form-input rounded-md"
                                            value={serveur.ssh_user}
                                            onChange={(e) => handleUpdate(serveur.id, 'ssh_user', e.target.value)}
                                        />
                                    </td>


                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => confirmDeleteServeur(serveur.id)}
                                                className="text-red-600 hover:text-red-900">Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
        ;
}
