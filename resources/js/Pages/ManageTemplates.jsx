import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import _ from 'lodash';

export default function Manage({ auth }) {
    const [subjects, setSubjects] = useState([]);
    const [sites, setSites] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [search, setSearch] = useState("");
    const [newTemplate, setNewTemplate] = useState({ template_id: '', description: '', id_localisation: '', id_subject: '' });

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
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, 500);

    const handleUpdate = (templateId, field, value) => {
        const updatedTemplates = templates.map(template =>
            template.id === templateId ? { ...template, [field]: value } : template
        );
        setTemplates(updatedTemplates);
        const token = localStorage.getItem('bearerToken');
        debouncedUpdate(templateId, field, value, token);
    };

    const handleNewTemplateChange = (field, value) => {
        setNewTemplate(prev => ({ ...prev, [field]: value }));
    };

    const addNewTemplate = () => {
        const token = localStorage.getItem('bearerToken');
        fetch('/api/typeOfVm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newTemplate),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTemplates(prev => [...prev, data]);
                setNewTemplate({ template_id: '', description: '', id_localisation: '', id_subject: '' });
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
                <div>
                    <input
                        type="text"
                        placeholder="Template ID"
                        value={newTemplate.template_id}
                        onChange={(e) => handleNewTemplateChange('template_id', e.target.value)}
                        className="form-input mt-1 block"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newTemplate.description}
                        onChange={(e) => handleNewTemplateChange('description', e.target.value)}
                        className="form-input mt-1 block"
                    />
                    <select
                        onChange={(e) => handleNewTemplateChange('id_localisation', e.target.value)}
                        value={newTemplate.id_localisation}
                        className="mt-1 block w-full"
                    >
                        {sites.map(site => (
                            <option key={site.id} value={site.id}>{site.name}</option>
                        ))}
                    </select>
                    <select
                        onChange={(e) => handleNewTemplateChange('id_subject', e.target.value)}
                        value={newTemplate.id_subject}
                        className="mt-1 block w-full"
                    >
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>{subject.description}</option>
                        ))}
                    </select>
                    <button onClick={addNewTemplate} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add Template
                    </button>
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
