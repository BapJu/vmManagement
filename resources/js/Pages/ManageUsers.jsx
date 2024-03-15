import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function Manage({ auth }) {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [sites, setSites] = useState([]);
    const { data, setData, patch } = useForm({ user_id: '', id_role: '' });

    useEffect(() => {
        fetchData('/api/users', setUsers);
        fetchData('/api/roles', setRoles);
        fetchData('/api/localisations', setSites);
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

    const handleRoleChange = (userId, newRoleId) => {
        setData({ user_id: userId, id_role: newRoleId });
        const token = localStorage.getItem('bearerToken');
        const url = `/api/user/${userId}`;
        const data = { user_id: userId, role_id: newRoleId };

        fetch(url, {
            method: 'PATCH',
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
                // Handle the response data here
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gérer les utilisateurs</h2>}
        >
            <div className="ax-w-7xl mx-auto sm:px-6 lg:px-8 mb-4">
                <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="overflow-x-auto mb-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created at</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">SITE</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            id="role"
                                            className="mt-1 block w-full"
                                            value={user.id_role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        >
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.created_at}</td>
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
