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
    const [vmStats, setVmStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        fetch('/api/vm/stats', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setVmStats(data);
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

    // Ici, vous devez transformer les données vmStats en données utilisables par les graphiques.
    // Cela dépend de la structure de vos données. Voici un exemple simplifié pour un seul graphique.

    const dataForGraph = {
        labels: vmStats.map(stat => stat.label), // Par exemple, dates pour le nombre de VM en ligne
        datasets: [{
            label: 'Nombre de VM en ligne',
            data: vmStats.map(stat => stat.value), // Les valeurs correspondantes
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: '#777',
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
                <Bar
                    data={dataForGraph}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: 'VM Statistics',
                                fontSize: 25,
                            },
                            legend: {
                                display: true,
                                position: 'right',
                            },
                        },
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}

export default VmStatsGraph;
