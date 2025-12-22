// قائمة التنبيهات
let alerts = [];

// تحميل التنبيهات من localStorage
export function loadAlerts() {
    try {
        const saved = localStorage.getItem('currencyAlerts');
        if (saved) {
            alerts = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading alerts:', error);
        alerts = [];
    }
    return alerts;
}

// حفظ التنبيهات
function saveAlerts() {
    try {
        localStorage.setItem('currencyAlerts', JSON.stringify(alerts));
    } catch (error) {
        console.error('Error saving alerts:', error);
    }
}

// إضافة تنبيه جديد
export function addAlert(from, to, targetRate, condition = 'above') {
    const alert = {
        id: Date.now().toString(),
        from,
        to,
        targetRate: parseFloat(targetRate),
        condition, // 'above' أو 'below'
        active: true,
        createdAt: new Date().toISOString()
    };
    
    alerts.push(alert);
    saveAlerts();
    return alert;
}

// إزالة تنبيه
export function removeAlert(alertId) {
    const index = alerts.findIndex(a => a.id === alertId);
    if (index !== -1) {
        alerts.splice(index, 1);
        saveAlerts();
        return true;
    }
    return false;
}

// تفعيل/تعطيل تنبيه
export function toggleAlert(alertId) {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
        alert.active = !alert.active;
        saveAlerts();
        return alert.active;
    }
    return null;
}

// الحصول على جميع التنبيهات
export function getAlerts() {
    return alerts;
}

// الحصول على التنبيهات النشطة فقط
export function getActiveAlerts() {
    return alerts.filter(a => a.active);
}

// فحص التنبيهات بناءً على الأسعار الحالية
export function checkAlerts(currentRates) {
    const triggeredAlerts = [];
    
    alerts.forEach(alert => {
        if (!alert.active) return;
        
        const currentRate = currentRates[alert.from]?.[alert.to];
        if (!currentRate) return;
        
        let triggered = false;
        
        if (alert.condition === 'above' && currentRate >= alert.targetRate) {
            triggered = true;
        } else if (alert.condition === 'below' && currentRate <= alert.targetRate) {
            triggered = true;
        }
        
        if (triggered) {
            triggeredAlerts.push({
                ...alert,
                currentRate
            });
            
            // إرسال إشعار
            showNotification(alert, currentRate);
            
            // تعطيل التنبيه بعد التفعيل
            alert.active = false;
        }
    });
    
    if (triggeredAlerts.length > 0) {
        saveAlerts();
    }
    
    return triggeredAlerts;
}

// عرض إشعار
function showNotification(alert, currentRate) {
    // التحقق من دعم الإشعارات
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return;
    }
    
    // طلب الإذن إذا لم يتم منحه
    if (Notification.permission === 'granted') {
        sendNotification(alert, currentRate);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                sendNotification(alert, currentRate);
            }
        });
    }
}

// إرسال الإشعار
function sendNotification(alert, currentRate) {
    const title = '🔔 تنبيه سعر العملة';
    const body = `${alert.from}/${alert.to} وصل إلى ${currentRate.toFixed(4)}`;
    
    const notification = new Notification(title, {
        body,
        icon: '/icon.png', // يمكنك إضافة أيقونة مخصصة
        badge: '/badge.png'
    });
    
    // إغلاق الإشعار بعد 5 ثوانٍ
    setTimeout(() => notification.close(), 5000);
}

// مسح جميع التنبيهات
export function clearAllAlerts() {
    alerts = [];
    saveAlerts();
}

// مسح التنبيهات المنتهية (غير النشطة)
export function clearInactiveAlerts() {
    alerts = alerts.filter(a => a.active);
    saveAlerts();
}
