import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
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
    PieController,
    ArcElement,
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
    PieController,
    ArcElement,
);

function VmStatsGraph({ auth }) {
    const [evolutionData, setEvolutionData] = useState({});
    const [distributionData, setDistributionData] = useState({});
    const [distributionUserData, setDistributionUserData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('bearerToken');

        Promise.all([
            fetch(`api/events/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(res => res.json()),
            fetch(`/api/typeOfVms`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(res => res.json()),
            fetch(`/api/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then(res => res.json())
        ])
            .then(([eventsData, typesOfVMData, typesOfUsers]) => {
                const evolutionChartData = processEvolutionData(eventsData);
                const distributionChartData = processDistributionData(eventsData, typesOfVMData);
                const distributionChartDataUser = processDistributionDataUser(eventsData, typesOfUsers);

                setEvolutionData(evolutionChartData);
                setDistributionData(distributionChartData);
                setDistributionUserData(distributionChartDataUser)
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Statistiques</h2>}
        >
            <Head title="Statistiques"/>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-4">
                <div className="mt-8 bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4">
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white overflow-hidden rounded-lg shadow-xs">
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
                                                left: 20,
                                                right: 20,
                                                top: 0,
                                                bottom: 0,
                                            },
                                        },
                                        aspectRatio: 2, // Reduire la taille par 2
                                        maintainAspectRatio: true // Garder le ratio
                                    }}
                                    height={200} // Reduire la taille par 2
                                />
                            </div>
                            <div className="bg-white overflow-hidden rounded-lg shadow-xs">
                                <Pie
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
                                        layout: {
                                            padding: {
                                                left: 20,
                                                right: 20,
                                                top: 0,
                                                bottom: 0,
                                            },
                                        },
                                        aspectRatio: 2, // Reduire la taille par 2
                                        maintainAspectRatio: true // Garder le ratio
                                    }}
                                    height={200} // Reduire la taille par 2
                                />
                            </div>
                            <div className="bg-white overflow-hidden rounded-lg shadow-xs">
                                <Pie
                                    data={distributionUserData}
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'VM Distribution by User',
                                                fontSize: 25,
                                            },
                                            legend: {
                                                display: true,
                                                position: 'bottom',
                                            },
                                        },
                                        layout: {
                                            padding: {
                                                left: 20,
                                                right: 20,
                                                top: 0,
                                                bottom: 0,
                                            },
                                        },
                                        aspectRatio: 2, // Reduire la taille par 2
                                        maintainAspectRatio: true // Garder le ratio
                                    }}
                                    height={200} // Reduire la taille par 2
                                />
                            </div>
                        </div>
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
function processDistributionData(eventsData, typesOfVMData) {
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

    // Créer un dictionnaire pour stocker les descriptions par id_typeofvm
    const descriptionsById = {};
    typesOfVMData.forEach(typeOfVM => {
        descriptionsById[typeOfVM.id] = typeOfVM.description;
    });

    // Générer des couleurs aléatoires pour chaque type de VM
    const backgroundColors = labels.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`);
    const borderColors = backgroundColors.map(color => color.replace('0.5', '1'));

    return {
        labels: labels.map(id => descriptionsById[id]), // Les descriptions des types de VM
        datasets: [{
            label: 'VMs by Type',
            data: data, // Les données calculées
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
        }],
    };
}


function processDistributionDataUser(eventsData, namesById) {
    let distributionByUser = {};
    // Compter le nombre de VMs actives par utilisateur
    eventsData.forEach(event => {
        if (event.active) {
            const vmUser = event.id_user;
            if (!distributionByUser[vmUser]) {
                distributionByUser[vmUser] = 0;
            }
            distributionByUser[vmUser] += 1;
        }
    });

    // Préparer les données pour le graphique
    const labels = Object.keys(distributionByUser).map(id => namesById[id]);
    const data = Object.values(distributionByUser);

    // Générer des couleurs aléatoires pour chaque utilisateur
    const backgroundColors = labels.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`);
    const borderColors = backgroundColors.map(color => color.replace('0.5', '1'));

    return {
        labels: labels, // Les noms d'utilisateur
        datasets: [{
            label: 'VMs by User',
            data: data, // Les données calculées
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
        }],
    };
}
export default VmStatsGraph;
