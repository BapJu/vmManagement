import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import _ from 'lodash';

export default function Manage({ auth }) {
    const [subjects, setSubjects] = useState([]);
    const [sites, setSites] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchData('/api/subjects', setSubjects);
        fetchData('/api/localisations', setSites);
        fetchData('/api/typeOfVms', setTemplates);
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

    const debouncedUpdate = _.debounce((templateId, field, value, token) => {
        const url = `/api/typeOfVm/${templateId}`;
        const data = { ...templates.find(t => t.id === templateId), [field]: value };

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                console.log('Update successful');
                // Vous pouvez également déclencher ici une mise à jour de l'état pour refléter le changement ou rafraîchir les données
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, 500); // Attend 500ms après le dernier appel pour exécuter la mise à jour

    const handleUpdate = (templateId, field, value) => {
        const updatedTemplates = templates.map(template =>
            template.id === templateId ? { ...template, [field]: value } : template
        );
        setTemplates(updatedTemplates);

        const token = localStorage.getItem('bearerToken');
        // Appelez la fonction debounced pour la mise à jour
        debouncedUpdate(templateId, field, value, token);
    };

    const filteredTemplates = templates.filter(template =>
        template.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gérer les templates</h2>}
        >
            <div className="ax-w-7xl mx-auto sm:px-6 lg:px-8 mb-4">
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-input mt-1 block w-full"
                        placeholder="Rechercher un template..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="overflow-x-auto mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Id</th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTemplates.map(template => (
                                <tr key={template.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            className="form-input rounded-md"
                                            value={template.template_id}
                                            onChange={(e) => handleUpdate(template.id, 'template_id', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            className="form-input rounded-md"
                                            value={template.description}
                                            onChange={(e) => handleUpdate(template.id, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="mt-1 block w-full"
                                            value={template.id_localisation}
                                            onChange={(e) => handleUpdate(template.id, 'id_localisation', e.target.value)}
                                        >
                                            {sites.map(site => (
                                                <option key={site.id} value={site.id}>{site.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="mt-1 block w-full"
                                            value={template.id_subject}
                                            onChange={(e) => handleUpdate(template.id, 'id_subject', e.target.value)}
                                        >
                                            {subjects.map(subject => (
                                                <option key={subject.id} value={subject.id}>{subject.description}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
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
