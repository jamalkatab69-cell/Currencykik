const API_KEY = 'b83fce53976843bbb59336c03f9a6a30';
const BASE_IMG_URL = 'https://raw.githubusercontent.com/username/repo/main/images/'; // استبدل برابط مستودعك

const currencies = {
    "USD": "101-currency-usd.png",
    "EUR": "100-currency-eur.png",
    "GBP": "102-currency-gbp.png",
    "JPY": "113-currency-jpy.png",
    "SAR": "121-currency-sar.png",
    "CAD": "104-currency-cad.png",
    "MAD": "118-currency-mad.png",
    "EGP": "119-currency-egp.png"
    // يمكنك إضافة البقية هنا بنفس النمط
};

let exchangeRates = {};

async function fetchRates() {
    const symbols = Object.keys(currencies).join(',');
    // طلب Batch لجلب السعر مقابل الدولار كأساس
    const url = `https://api.twelvedata.com/price?symbol=${symbols}/USD&apikey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // تحويل البيانات لشكل يسهل التعامل معه
        Object.keys(data).forEach(pair => {
            const symbol = pair.split('/')[0];
            exchangeRates[symbol] = parseFloat(data[pair].price);
        });
        
        // إضافة USD كقاعدة ثابتة
        exchangeRates["USD"] = 1.0;
        
        updateResult();
    } catch (error) {
        console.error("خطأ في جلب البيانات", error);
        document.getElementById('exchange-info').innerText = "فشل تحديث الأسعار";
    }
}

function populateSelectors() {
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');

    Object.keys(currencies).forEach(code => {
        let opt1 = new Option(code, code);
        let opt2 = new Option(code, code);
        fromSelect.add(opt1);
        toSelect.add(opt2);
    });

    fromSelect.value = "USD";
    toSelect.value = "JPY";
    updateFlags();
}

function updateFlags() {
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
    
    // ملاحظة: هنا يجب التأكد من مسار الصور الصحيح على GitHub
    document.getElementById('from-flag').src = `images/${currencies[from]}`;
    document.getElementById('to-flag').src = `images/${currencies[to]}`;
}

function updateResult() {
    const amount = document.getElementById('amount').value;
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;

    if (exchangeRates[from] && exchangeRates[to]) {
        // العملة المحولة = المبلغ * (سعر العملة الثانية بالنسبة للدولار / سعر العملة الأولى بالنسبة للدولار)
        const rate = (1 / exchangeRates[from]) / (1 / exchangeRates[to]);
        const finalResult = (amount * rate).toFixed(2);
        
        document.getElementById('result').value = finalResult;
        document.getElementById('exchange-info').innerText = `1 ${from} = ${rate.toFixed(4)} ${to} (Mid-market rate)`;
    }
}

// المستمعات (Listeners)
document.getElementById('amount').addEventListener('input', updateResult);
document.getElementById('from-currency').addEventListener('change', () => { updateFlags(); updateResult(); });
document.getElementById('to-currency').addEventListener('change', () => { updateFlags(); updateResult(); });
document.getElementById('swap').addEventListener('click', () => {
    const from = document.getElementById('from-currency');
    const to = document.getElementById('to-currency');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
    updateFlags();
    updateResult();
});

// التشغيل الأولي
populateSelectors();
fetchRates();
