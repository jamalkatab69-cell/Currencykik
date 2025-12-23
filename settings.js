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
        
        // إظهار رسالة تأكيد
        showToast('تم حفظ الإعدادات');
    } catch (error) {
        console.error('Error saving settings:', error);
        showToast('خطأ في حفظ الإعدادات', 'error');
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

// عرض رسالة تأكيد
function showToast(message, type = 'success') {
    // إزالة أي رسالة سابقة
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // إضافة أنماط CSS للـ toast
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--accent-color);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                animation: toastSlide 0.3s ease-out;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .toast-error {
                background-color: var(--error-color);
            }
            
            @keyframes toastSlide {
                from {
                    transform: translateX(-50%) translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // إزالة الرسالة بعد 3 ثوانٍ
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 3000);
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
    
    // إضافة أحداث لأزرار الإعدادات العامة
    const settingButtons = document.querySelectorAll('.setting-btn');
    settingButtons.forEach((btn, index) => {
        btn.onclick = () => {
            if (index === 0) {
                // زر تقييم التطبيق
                showToast('شكراً لتقييمك التطبيق!');
                // يمكن هنا فتح متجر التطبيقات أو صفحة التقييم
            } else if (index === 1) {
                // زر الشروط والخصوصية
                showToast('سيتم فتح صفحة الشروط والخصوصية');
                // يمكن هنا فتح رابط أو نافذة جديدة
                window.open('#', '_blank');
            }
        };
    });
    
    // إضافة تأثيرات hover للأزرار
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.05)';
        });
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
