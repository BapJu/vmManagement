import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function VmStatsGraph({ auth }) {
    const [loading, setLoading] = useState(true);
    const [localisationData, setLocalisationData] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        Promise.all([
            fetch('/api/localisations', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }),
            fetch('/api/users', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }),
        ])
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(([localisationsData, usersData]) => {
                setLocalisationData(localisationsData);
                setUserData(usersData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, [auth.user.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Transformation des données pour le graphique des localisations
    const localisationLabels = localisationData.map(item => item.name); // Assurez-vous que 'name' est la propriété correcte
    const localisationValues = localisationData.map(item => item.vmCount); // Assurez-vous que 'vmCount' est la propriété correcte
    const localisationChartData = {
        labels: localisationLabels,
        datasets: [{
            label: 'Répartitions des VMs par lieu',
            data: localisationValues,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }]
    };

    // Transformation des données pour le graphique des utilisateurs
    const userLabels = userData.map(item => item.name); // Assurez-vous que 'name' est la propriété correcte
    const userValues = userData.map(item => item.vmCount); // Assurez-vous que 'vmCount' est la propriété correcte
    const userChartData = {
        labels: userLabels,
        datasets: [{
            label: 'Répartitions des VMs par utilisateurs',
            data: userValues,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }]
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Manage VMs</h2>}
        >
            <Head title="Statistiques"/>
            <div className="chart">
                <Bar data={localisationChartData} options={{ maintainAspectRatio: false }} />
                <Bar data={userChartData} options={{ maintainAspectRatio: false }} />
            </div>
        </AuthenticatedLayout>
    );
}

export default VmStatsGraph;
