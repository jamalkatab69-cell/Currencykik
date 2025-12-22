// إعدادات التطبيق
let appSettings = {
    darkMode: 'on', // 'on', 'off', 'auto'
    baseCurrency: 'USD',
    decimals: 4,
    notifications: true
};

// تحميل الإعدادات
export function loadSettings() {
    try {
        const saved = localStorage.getItem('appSettings');
        if (saved) {
            appSettings = { ...appSettings, ...JSON.parse(saved) };
        }
    } catch (error) {
        console.error('Error loading settings:', error);
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
        console.error('Error saving settings:', error);
    }
}

// تطبيق الإعدادات
export function applySettings() {
    // تطبيق الوضع الداكن
    applyDarkMode(appSettings.darkMode);
}

// تطبيق الوضع الداكن
function applyDarkMode(mode) {
    const html = document.documentElement;
    
    if (mode === 'on') {
        html.classList.add('dark-mode');
    } else if (mode === 'off') {
        html.classList.remove('dark-mode');
    } else if (mode === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            html.classList.add('dark-mode');
        } else {
            html.classList.remove('dark-mode');
        }
    }
}

// تهيئة صفحة الإعدادات
export function initSettingsPage() {
    const darkModeButtons = document.querySelectorAll('.dark-mode-btn');
    
    // تحديد الزر النشط
    darkModeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === appSettings.darkMode) {
            btn.classList.add('active');
        }
        
        // إضافة حدث النقر
        btn.onclick = () => {
            saveSettings({ darkMode: btn.dataset.mode });
            
            // تحديث الأزرار
            darkModeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });
}

// الحصول على الإعداد
export function getSetting(key) {
    return appSettings[key];
}

// تهيئة الإعدادات عند بدء التطبيق
export function initSettings() {
    loadSettings();
    applySettings();
    
    // مراقبة تغيير تفضيل النظام
    if (appSettings.darkMode === 'auto') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (appSettings.darkMode === 'auto') {
                applyDarkMode('auto');
            }
        });
    }
}
