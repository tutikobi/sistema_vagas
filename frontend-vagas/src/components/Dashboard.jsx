import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Dashboard() {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8000/api/reports/')
            .then(res => {
                const labels = res.data.jobs.map(j => j.month.split('T')[0]);
                const jobsData = res.data.jobs.map(j => j.count);
                const appsData = res.data.applications.map(a => a.count);

                setChartData({
                    labels: labels,
                    datasets: [
                        { label: 'Vagas Criadas', data: jobsData, backgroundColor: 'rgba(54, 162, 235, 0.5)' },
                        { label: 'Candidatos Recebidos', data: appsData, backgroundColor: 'rgba(255, 99, 132, 0.5)' }
                    ]
                });
            })
            .catch(err => console.error("Erro ao buscar dados:", err));
    }, []);

    return (
        <div>
            <h2>Relatório Mensal</h2>
            {chartData.labels ? <Bar data={chartData} /> : <p>Carregando gráfico...</p>}
        </div>
    );
}