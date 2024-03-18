import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function Manage({ auth }) {

    const [subjects, setSubjects] = useState([]);
    const [sites, setSites] = useState([]);
    const [templates, setTemplate] = useState([]);
    const [search, setSearch] = useState("");
    const { data, setData, patch } = useForm({ templateId: '', templateDescription: '', vmId: '', idSubject: '' });

    useEffect(() => {
        fetchData('/api/subjects', setSubjects);
        fetchData('/api/localisations', setSites);
        fetchData('/api/typeOfVms', setTemplate);
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

    const handleRoleChange = (templateId, templateDescription,vmId,idSubject) => {
        setData({ templateId: templateId, templateDescription: templateDescription, vmId: vmId, idSubject: idSubject });
        const token = localStorage.getItem('bearerToken');
        const url = `/api/typeOfVm/${templateId}`;
        const data = { templateId: templateId, templateDescription: templateDescription, vmId: vmId, idSubject: idSubject };

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
            .then(data => {
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    function getLocalisationName(siteId) {
        const site = sites.find(site => site.id === siteId);
        if (site) {
            return site.name;
        } else {
            return 'Site non trouvé';
        }
    }

    function getSubjectName(subjectId) {
        const subject = subjects.find(subject => subject.id === subjectId);
        if (subject) {
            return subject.description;
        } else {
            return 'Subject non trouvé';
        }
    }

    // Filtrez les utilisateurs en fonction de la recherche
    const filteredTemplates = templates.filter(template =>
        template.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gérer les templates</h2>}
        >
            <div className="ax-w-7xl mx-auto sm:px-6 lg:px-8 mb-4">
                {/* Ajout du champ de recherche */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-input mt-1 block w-full"
                        placeholder="Rechercher un professeur..."
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
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template
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
                            {filteredTemplates.map(template => (
                                <tr key={template.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            className="form-input rounded-md"
                                            value={template.template_id}
                                            onChange={(e) => handleTemplateIdChange(template.id, e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            className="form-input rounded-md"
                                            value={template.description}
                                            onChange={(e) => handleDescriptionChange(template.id, e.target.value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            className="mt-1 block w-full"
                                            value={template.id_localisation}
                                            onChange={(e) => handleLocalisationChange(template.id, e.target.value)}
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
                                            onChange={(e) => handleSubjectChange(template.id, e.target.value)}
                                        >
                                            {subjects.map(subject => (
                                                <option key={subject.id}
                                                        value={subject.id}>{subject.description}</option>
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
