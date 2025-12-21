const UI = {
    // خريطة الأيقونات بناءً على طلبك
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

    // تهيئة القوائم المنسدلة في المحول عند تشغيل التطبيق
    initConverter() {
        const fromSelect = document.getElementById('from-select');
        const toSelect = document.getElementById('to-select');
        
        Object.keys(this.iconMap).forEach(symbol => {
            const option1 = new Option(symbol, symbol);
            const option2 = new Option(symbol, symbol);
            fromSelect.add(option1);
            toSelect.add(option2);
        });

        // قيم افتراضية
        fromSelect.value = 'USD';
        toSelect.value = 'SAR';
        this.updateConvertIcons();
    },

    // تحديث الأيقونات في شاشة المحول
    updateConvertIcons() {
        const fromSymbol = document.getElementById('from-select').value;
        const toSymbol = document.getElementById('to-select').value;
        
        document.getElementById('from-icon').src = `assets/flags/${this.iconMap[fromSymbol]}.png`;
        document.getElementById('to-icon').src = `assets/flags/${this.iconMap[toSymbol]}.png`;
        
        // استدعاء الحساب فوراً
        performConversion();
    },

    // عرض قائمة الأسعار مع الأيقونات المتداخلة (x)
    renderRates(data) {
        const container = document.getElementById('rates-container');
        container.innerHTML = ''; 

        Object.entries(data).forEach(([pair, info]) => {
            const [base, target] = pair.split('/');
            const card = `
                <div class="rate-card">
                    <div class="chart-box"><canvas id="chart-${base}-${target}"></canvas></div>
                    <div class="rate-info">
                        <div class="pair-name">${base} / ${target}</div>
                        <div class="pair-value">1 ${base} = ${parseFloat(info.price).toFixed(4)} ${target}</div>
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
        // كود الرسم البياني (كما في الرد السابق)
    }
};

// وظيفة التنقل العامة
function showScreen(screenId, element) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    if(element) element.classList.add('active');
}
