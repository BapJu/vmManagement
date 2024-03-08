import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

function VmStatsGraph({auth}) {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('bearerToken');
        Promise.all([
            fetch('/api/localisations', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }),
            fetch('/api/subjects', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }),
            fetch('/api/storages', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }),
            fetch(`api/event/user/${auth.user.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }),
        ])
            .then(([localisationsRes, subjectsRes, storagesRes, eventsRes]) => Promise.all([localisationsRes.json(), subjectsRes.json(), storagesRes.json(), eventsRes.json()]))
            .then(([localisationsData, subjectsData, storagesData, eventsData]) => {
                setChartData({
                    labels: ['Total Localisations', 'Total Subjects', 'Total Storages', 'Total Events'],
                    datasets: [{
                        label: 'VM Statistics',
                        data: [localisationsData.length, subjectsData.length, storagesData.length, eventsData.length],
                        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                        borderWidth: 1,
                        borderColor: '#777',
                        hoverBorderWidth: 2,
                        hoverBorderColor: '#000'
                    }]
                });
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="chart">
            <Bar
                data={chartData}
                options={{
                    title: {
                        display: true,
                        text: 'VM Statistics',
                        fontSize: 25
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    }
                }}
            />
        </div>
    );
}

export default VmStatsGraph;
