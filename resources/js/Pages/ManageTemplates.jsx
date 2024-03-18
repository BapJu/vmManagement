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

    const handleDelete = (templateId) => {
        const token = localStorage.getItem('bearerToken');
        fetch(`/api/typeOfVm/${templateId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setTemplates(templates.filter(template => template.id !== templateId));
            })
            .catch(error => console.error('Error:', error));
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
            .then(response => response.json())
            .then(data => {
                setTemplates(prev => [...prev, data]);
                setNewTemplate({ template_id: '', description: '', id_localisation: '', id_subject: '' });
            })
            .catch(error => console.error('Error:', error));
    };

    const filteredTemplates = templates.filter(template =>
        template.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gérer les templates</h2>}>
            <div className="ax-w-7xl mx-auto sm:px-6 lg:px-8 mb-4">
                <div className="mb-4">
                    <input type="text" className="form-input mt-1 block w-full" placeholder="Rechercher un template..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="overflow-x-auto mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Id</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTemplates.map(template => (
                                <tr key={template.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{template.template_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{template.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{sites.find(site => site.id === template.id_localisation)?.name || ''}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{subjects.find(subject => subject.id === template.id_subject)?.description || ''}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => handleDelete(template.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
