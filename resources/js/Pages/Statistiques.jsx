import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

function VmStatsGraph() {
    const [chartData, setChartData] = useState({});

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
                setChartData({
                    labels: ['Total VMs', 'Active VMs', 'Inactive VMs'],
                    datasets: [{
                        label: 'VM Statistics',
                        data: [data.total, data.active, data.inactive],
                        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                        borderWidth: 1,
                        borderColor: '#777',
                        hoverBorderWidth: 2,
                        hoverBorderColor: '#000'
                    }]
                });
            })
            .catch(error => console.error('Error:', error));
    }, []);

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
