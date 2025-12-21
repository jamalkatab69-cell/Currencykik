const API_KEY = 'b83fce53976843bbb59336c03f9a6a30';
let currentRates = {};

// 1. التنقل بين الشاشات
function showScreen(screenId, element) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    element.classList.add('active');
}

// 2. جلب الأسعار الحقيقية للشاشة الرئيسية
async function fetchLiveRates() {
    const pairs = "EUR/USD,USD/JPY,SAR/USD,GBP/USD,USD/SAR";
    const url = `https://api.twelvedata.com/price?symbol=${pairs}&apikey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        currentRates = await response.json();
        renderRatesList();
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

function renderRatesList() {
    const list = document.getElementById('rates-list');
    list.innerHTML = '';
    
    Object.keys(currentRates).forEach(pair => {
        const price = parseFloat(currentRates[pair].price).toFixed(4);
        const item = document.createElement('div');
        item.className = 'rate-card';
        item.innerHTML = `
            <div class="chart-box"><canvas id="chart-${pair.replace('/','-')}"></canvas></div>
            <div class="rate-info">
                <div class="pair-name">${pair}</div>
                <div class="pair-value">1 ${pair.split('/')[0]} = ${price} ${pair.split('/')[1]}</div>
            </div>
            <i class="fas fa-trash-alt" style="color: #444; margin-left:10px;" onclick="this.parentElement.remove()"></i>
        `;
        list.appendChild(item);
        drawSimpleChart(`chart-${pair.replace('/','-')}`);
    });
}

// 3. منطق المحول (Convert Logic)
async function performConversion() {
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
    const amount = document.getElementById('from-amount').value;
    
    if(from === to) {
        document.getElementById('to-amount').value = amount;
        return;
    }

    const pair = `${from}/${to}`;
    try {
        const res = await fetch(`https://api.twelvedata.com/price?symbol=${pair}&apikey=${API_KEY}`);
        const data = await res.json();
        const rate = parseFloat(data.price);
        
        document.getElementById('to-amount').value = (amount * rate).toFixed(2);
        document.getElementById('rate-text').innerText = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    } catch (e) {
        document.getElementById('rate-text').innerText = "خطأ في الاتصال";
    }
}

// 4. تبديل العملات (Swap)
function swapCurrencies() {
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    performConversion();
}

// 5. التحكم في الوضع الليلي
function setDarkMode(isDark) {
    if(isDark) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-btn').classList.add('active');
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('dark-btn').classList.remove('active');
    }
}

// رسم منحنى تجريبي لكل عملة
function drawSimpleChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3, 4, 5, 6],
            datasets: [{
                data: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
                borderColor: '#4CAF50',
                borderWidth: 2,
                pointRadius: 0,
                fill: false
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
    });
}

// تشغيل عند التحميل
window.onload = () => {
    fetchLiveRates();
    performConversion();
};
