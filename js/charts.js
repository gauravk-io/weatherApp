

let tempChartInstance = null;

export function renderCharts(forecastData) {
    const ctx = document.getElementById('tempChart').getContext('2d');
    

    const labels = forecastData.list.slice(0, 8).map(item => {
        const date = new Date(item.dt * 1000);
        return date.getHours() + ':00';
    });
    const temps = forecastData.list.slice(0, 8).map(item => item.main.temp);
    const rainProb = forecastData.list.slice(0, 8).map(item => (item.pop || 0) * 100);

    if (tempChartInstance) {
        tempChartInstance.destroy();
    }

    tempChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature',
                    data: temps,
                    borderColor: '#ffeb3b',
                    backgroundColor: 'rgba(255, 235, 59, 0.2)',
                    yAxisID: 'y',
                    tension: 0.4
                },
                {
                    label: 'Precipitation %',
                    data: rainProb,
                    borderColor: '#037ba0',
                    backgroundColor: 'rgba(3, 123, 160, 0.2)',
                    yAxisID: 'y1',
                    type: 'bar'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#ccc' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#ccc' },
                    min: 0,
                    max: 100
                },
                x: {
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#ccc' }
                }
            },
            plugins: {
                legend: { labels: { color: '#fff' } }
            }
        }
    });
}
