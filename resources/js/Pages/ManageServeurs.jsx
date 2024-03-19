import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {useEffect, useState} from 'react';
import _ from 'lodash';

export default function Manage({auth}) {
    const [serveurs, setServeurs] = useState([]);

    const [search, setSearch] = useState("");
    const [showAddServeur, setShowAddServeur] = useState(false);
    const [newServeur, setNewServeur] = useState({
        adress_ip: '',
        noeud: '',
        id_localisation: '',
        id_subject: ''
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
                setNewServeur({template_id: '', description: '', id_localisation: '', id_subject: ''});
                setShowAddServeur(false);
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const filteredServeur = serveurs.filter(serveur =>
        serveur.description.toLowerCase().includes(search.toLowerCase())
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
            newServeur.template_id !== '' &&
            newServeur.description !== '' &&
            newServeur.id_localisation !== '' &&
            newServeur.id_subject !== ''
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
                    <button onClick={() => setShowAddTemplate(!showAddTemplate)}
                            className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        {showAddTemplate ? 'Cancel' : 'Add serveur'}
                    </button>
                </div>
                {showAddTemplate && (
                    <div>
                        <input type="text" placeholder="serveur ID" value={newTemplate.template_id}
                               onChange={(e) => handleNewTemplateChange('template_id', e.target.value)}
                               className="form-input mt-1 block" required />
                        <input type="text" placeholder="Description" value={newTemplate.description}
                               onChange={(e) => handleNewTemplateChange('description', e.target.value)}
                               className="form-input mt-1 block" required />
                        <select onChange={(e) => handleNewTemplateChange('id_localisation', e.target.value)}
                                value={newTemplate.id_localisation} className="mt-1 block w-full" required>
                            <option value="" disabled>Choisir lieu</option>
                            {sites.map(site => (<option key={site.id} value={site.id}>{site.name}</option>))}
                        </select>
                        <select onChange={(e) => handleNewTemplateChange('id_subject', e.target.value)}
                                value={newTemplate.id_subject} className="mt-1 block w-full" required>
                            <option value="" disabled>Choisir matière</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.description}</option>))}
                        </select>
                        <button onClick={handleAddTemplateClick} disabled={!isFormValid()}
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
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">serveur
                                    Id
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTemplates.map(serveur => (
                                <tr key={serveur.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            className="form-input rounded-md"
                                            value={serveur.template_id}
                                            onChange={(e) => handleUpdate(serveur.id, 'template_id', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            className="form-input rounded-md"
                                            value={serveur.description}
                                            onChange={(e) => handleUpdate(serveur.id, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="p-2 border border-gray-300 rounded-md"
                                            value={serveur.id_localisation}
                                            onChange={(e) => handleUpdate(serveur.id, 'id_localisation', e.target.value)}
                                        >
                                            {sites.map(site => (
                                                <option key={site.id} value={site.id}>{site.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="p-2 border border-gray-300 rounded-md"
                                            value={serveur.id_subject}
                                            onChange={(e) => handleUpdate(serveur.id, 'id_subject', e.target.value)}
                                        >
                                            {subjects.map(subject => (
                                                <option key={subject.id}
                                                        value={subject.id}>{subject.description}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => confirmDeleteTemplate(serveur.id)}
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
