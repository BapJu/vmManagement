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
    PointElement,
} from 'chart.js';

// Enregistrement des composants nécessaires pour les graphiques
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
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
                const evolutionChartData = processEvolutionData(eventsData);
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
            <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className=" min-w-full divide-y divide-gray-200 overflow-x-auto">
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
                                layout: {
                                    padding: {
                                        left: 50, // Ajustez selon vos besoins
                                        right: 50, // Ajustez selon vos besoins
                                        top: 0,
                                        bottom: 0,
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
                                    layout: {
                                        padding: {
                                            left: 50, // Ajustez selon vos besoins
                                            right: 50, // Ajustez selon vos besoins
                                            top: 0,
                                            bottom: 0,
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
);
}

// Supposons que cette fonction traite les données pour l'évolution des VMs en ligne
function processEvolutionData(eventsData) {
    // Trier les événements par date de création
    const sortedEvents = eventsData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Compter le nombre de VMs actives pour chaque jour
    let countsByDate = {};
    sortedEvents.forEach(event => {
        if (event.active) {
            // Format de la date à 'yyyy-mm-dd'
            const date = event.created_at.split('T')[0];
            if (!countsByDate[date]) {
                countsByDate[date] = 0;
            }
            countsByDate[date] += 1;
        }
    });

    // Préparer les données pour le graphique
    const labels = Object.keys(countsByDate);
    const data = Object.values(countsByDate);

    return {
        labels: labels, // Les dates
        datasets: [{
            label: 'Online VMs',
            data: data, // Les données calculées
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }],
    };
}


// Supposons que cette fonction traite les données pour la répartition par type
function processDistributionData(eventsData) {
    let distributionByType = {};
    // Compter le nombre de VMs actives par type
    eventsData.forEach(event => {
        if (event.active) {
            const vmType = event.id_typeofvm;
            if (!distributionByType[vmType]) {
                distributionByType[vmType] = 0;
            }
            distributionByType[vmType] += 1;
        }
    });

    // Préparer les données pour le graphique
    const labels = Object.keys(distributionByType);
    const data = Object.values(distributionByType);

    // Générer des couleurs aléatoires pour chaque type de VM
    const backgroundColors = labels.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`);
    const borderColors = backgroundColors.map(color => color.replace('0.5', '1'));

    return {
        labels: labels, // Les types de VM
        datasets: [{
            label: 'VMs by Type',
            data: data, // Les données calculées
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
        }],
    };
}


export default VmStatsGraph;
