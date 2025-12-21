const UI = {
    // خريطة لربط رموز العملات بأسماء الملفات التي قدمتها
    iconMap: {
        'EUR': '100-currency-eur', 'USD': '101-currency-usd', 'GBP': '102-currency-gbp',
        'CHF': '103-currency-chf', 'CAD': '104-currency-cad', 'AUD': '105-currency-aud',
        'TRY': '106-currency-try', 'CNY': '107-currency-cny', 'BRL': '108-currency-brl',
        'MXN': '109-currency-mxn', 'ARS': '110-currency-ars', 'RUB': '111-currency-rub',
        'ZAR': '112-currency-zar', 'JPY': '113-currency-jpy', 'KRW': '114-currency-krw',
        'INR': '115-currency-inr', 'HKD': '116-currency-hkd', 'MYR': '117-currency-myr',
        'MAD': '118-currency-mad', 'EGP': '119-currency-egp', 'TND': '120-currency-tnd',
        'SAR': '121-currency-sar', 'QAR': '122-currency-qar', 'AED': '123-currency-aed'
    },

    renderRates(data) {
        const container = document.getElementById('rates-container');
        container.innerHTML = ''; 

        Object.entries(data).forEach(([pair, info]) => {
            const [base, target] = pair.split('/');
            const iconName = this.iconMap[target] || 'default'; // استخدام الأيقونات الملحقة بـ x للأسعار
            
            const card = `
                <div class="rate-card">
                    <div class="chart-box"><canvas id="chart-${base}-${target}"></canvas></div>
                    <div class="rate-info">
                        <div class="pair-name">${base} to ${target}</div>
                        <div class="pair-value">${base} = ${parseFloat(info.price).toFixed(4)} ${target} 1</div>
                    </div>
                    <div class="pair-icons">
                        <img src="assets/flags/${this.iconMap[target]}x.png" class="icon-small">
                        <img src="assets/flags/${this.iconMap[base]}x.png" class="icon-large">
                    </div>
                </div>
            `;
            container.innerHTML += card;
            this.drawSparkline(`chart-${base}-${target}`);
        });
    },

    drawSparkline(canvasId) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                datasets: [{
                    data: Array.from({length: 10}, () => Math.random()), // سيتم استبداله ببيانات Api.getHistory
                    borderColor: '#4CAF50',
                    borderWidth: 1.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: false } }
            }
        });
    }
};
