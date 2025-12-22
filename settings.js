// settings.js - محدث
// إعدادات التطبيق الشاملة
let appSettings = {
    darkMode: 'on',           // 'on', 'off', 'auto'
    baseCurrency: 'EUR',      // العملة الأساسية
    decimals: 4,              // عدد الأرقام العشرية
    notifications: true,      // الإشعارات
    currencyImages: true,     // استخدام صور العملات من GitHub
    lastRatesUpdate: null,    // آخر تحديث للأسعار
    cacheDuration: 30 * 60    // 30 دقيقة بالثواني
};

// تحميل الإعدادات من LocalStorage
export function loadSettings() {
    try {
        const saved = localStorage.getItem('appSettings');
        if (saved) {
            appSettings = { ...appSettings, ...JSON.parse(saved) };
        }
    } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
    }
    return appSettings;
}

// حفظ الإعدادات
export function saveSettings(settings) {
    try {
        appSettings = { ...appSettings, ...settings };
        localStorage.setItem('appSettings', JSON.stringify(appSettings));
        applySettings();
    } catch (error) {
        console.error('خطأ في حفظ الإعدادات:', error);
    }
}

// تطبيق جميع الإعدادات
export function applySettings() {
    applyDarkMode(appSettings.darkMode);
    // يمكن إضافة إعدادات أخرى هنا
}

// تطبيق الوضع الداكن
function applyDarkMode(mode) {
    const html = document.documentElement;
    
    if (mode === 'on') {
        html.classList.add('dark-mode');
        html.classList.remove('light-mode');
    } else if (mode === 'off') {
        html.classList.remove('dark-mode');
        html.classList.add('light-mode');
    } else if (mode === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            html.classList.add('dark-mode');
            html.classList.remove('light-mode');
        } else {
            html.classList.remove('dark-mode');
            html.classList.add('light-mode');
        }
    }
}

// تهيئة صفحة الإعدادات
export function initSettingsPage() {
    const darkModeButtons = document.querySelectorAll('.dark-mode-btn');
    
    darkModeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === appSettings.darkMode) {
            btn.classList.add('active');
        }
        
        btn.onclick = () => {
            saveSettings({ darkMode: btn.dataset.mode });
            
            // تحديث الأزرار فوراً
            darkModeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    // أزرار الإعدادات الأخرى
    document.querySelectorAll('.setting-btn').forEach(btn => {
        btn.onclick = () => {
            const action = btn.querySelector('.emoji').textContent;
            handleSettingAction(action);
        };
    });
}

// معالج إجراءات الإعدادات
function handleSettingAction(action) {
    switch(action) {
        case '⭐':
            window.open('https://play.google.com/store/apps/details?id=com.pidmage.currencykik', '_blank');
            break;
        case '⚠️':
            window.open('https://pidmage.com/terms', '_blank');
            break;
    }
}

// الحصول على إعداد معين
export function getSetting(key) {
    return appSettings[key];
}

// التحقق من صلاحية الكاش
export function isCacheValid() {
    if (!appSettings.lastRatesUpdate) return false;
    
    const now = Date.now();
    const lastUpdate = new Date(appSettings.lastRatesUpdate).getTime();
    const duration = appSettings.cacheDuration * 1000; // تحويل لمللي ثانية
    
    return (now - lastUpdate) < duration;
}

// تحديث وقت آخر تحديث للأسعار
export function updateLastRatesUpdate() {
    appSettings.lastRatesUpdate = new Date().toISOString();
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
}

// تهيئة الإعدادات عند بدء التطبيق
export function initSettings() {
    loadSettings();
    applySettings();
    
    // مراقبة تغيير تفضيل النظام للوضع التلقائي
    if (appSettings.darkMode === 'auto') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            if (appSettings.darkMode === 'auto') {
                applyDarkMode('auto');
            }
        });
    }
}

// تصدير دالة مساعدة للتحقق من استخدام صور GitHub
export function useCurrencyImages() {
    return appSettings.currencyImages !== false;
}
