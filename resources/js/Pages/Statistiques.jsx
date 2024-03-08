import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Enregistrement des composants nécessaires pour les graphiques
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function VmStatsGraph({ auth }) {
    const [evolutionData, setEvolutionData] = useState({});
    const [distributionData, setDistributionData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        fetch(`api/events/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(eventsData => {
                // Logique pour l'évolution des VMs en ligne
                const evolutionChartData = processEvolutionData(eventsData);

                // Logique pour la répartition des VMs par type
                const distributionChartData = processDistributionData(eventsData);

                setEvolutionData(evolutionChartData);
                setDistributionData(distributionChartData);
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Manage VMs</h2>}
        >
            <Head title="Statistiques"/>
            <div className="chart">
                <Line
                    data={evolutionData}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: 'Evolution of Online VMs',
                                fontSize: 25,
                            },
                            legend: {
                                display: true,
                                position: 'bottom',
                            },
                        },
                    }}
                />
                <Bar
                    data={distributionData}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: 'VM Distribution by Type',
                                fontSize: 25,
                            },
                            legend: {
                                display: true,
                                position: 'bottom',
                            },
                        },
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}

// Supposons que cette fonction traite les données pour l'évolution des VMs en ligne
function processEvolutionData(eventsData) {
    // Cette fonction devrait implémenter la logique de traitement des données
    // pour le graphique d'évolution des VMs en ligne.
    return {
        labels: [], // Les dates
        datasets: [{
            label: 'Online VMs',
            data: [], // Les données calculées
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }],
    };
}

// Supposons que cette fonction traite les données pour la répartition par type
function processDistributionData(eventsData) {
    // Cette fonction devrait implémenter la logique de traitement des données
    // pour le graphique de répartition des VMs par type.
    return {
        labels: [], // Les types de VM
        datasets: [{
            label: 'VMs by Type',
            data: [], // Les données calculées
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                // Ajoutez d'autres couleurs au besoin
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                // Ajoutez d'autres bordures au besoin
            ],
            borderWidth: 1,
        }],
    };
}

export default VmStatsGraph;
