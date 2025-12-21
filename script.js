const API_KEY = 'b83fce53976843bbb59336c03f9a6a30';
const pairs = ['EUR/USD', 'USD/EUR', 'SAR/USD', 'USD/SAR', 'USD/CAD', 'USD/GBP'];

// وظيفة التنقل بين الصفحات
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(screenId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// جلب البيانات وبناء الرسوم البيانية
async function loadRatesData() {
    const ratesList = document.getElementById('rates-list');
    ratesList.innerHTML = ''; 

    for (const pair of pairs) {
        try {
            // جلب بيانات تاريخية (آخر 10 ساعات) لرسم المنحنى
            const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${pair}&interval=1h&outputsize=10&apikey=${API_KEY}`);
            const data = await res.json();
            
            if (data.status === 'ok') {
                const history = data.values.map(v => parseFloat(v.close)).reverse();
                const latestPrice = history[history.length - 1];
                const isGrowing = latestPrice >= history[0];
                
                createRateRow(pair, latestPrice, history, isGrowing);
            }
        } catch (err) {
            console.error("Error loading " + pair, err);
        }
    }
}

function createRateRow(pair, price, history, isGrowing) {
    const ratesList = document.getElementById('rates-list');
    const canvasId = `chart-${pair.replace('/', '-')}`;
    
    const row = document.createElement('div');
    row.className = 'rate-card';
    row.innerHTML = `
        <div class="chart-box">
            <canvas id="${canvasId}"></canvas>
        </div>
        <div class="rate-info">
            <div class="pair-name">${pair.replace('/', ' to ')}</div>
            <div class="pair-value">${pair.split('/')[0]} = ${price.toFixed(4)} ${pair.split('/')[1]} 1</div>
        </div>
    `;
    ratesList.appendChild(row);

    // رسم المنحنى المتعرج
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: history,
            datasets: [{
                data: history,
                borderColor: isGrowing ? '#4CAF50' : '#FF5252',
                borderWidth: 2,
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

    // تحديث المحول تلقائياً بأول سعر
    if(pair === 'USD/JPY') document.getElementById('live-rate').innerText = price.toFixed(4);
}

// تشغيل التطبيق
loadRatesData();
