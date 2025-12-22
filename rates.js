// تهيئة صفحة الإعدادات
function initializeSettings() {
    // تعيين وضع السمة الحالي
    document.querySelectorAll(`[data-mode="${appSettings.darkMode}"]`).forEach(btn => {
        btn.classList.add('active');
    });
    
    // أزرار تغيير الوضع المظلم
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            appSettings.darkMode = mode;
            applyDarkMode(mode);
            saveSettings();
            
            // تحديث حالة الأزرار
            document.querySelectorAll('.toggle-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // أزرار الإعدادات العامة
    document.querySelectorAll('.setting-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.textContent;
            if (text.includes('تقييم')) {
                alert('شكراً لتقييمك التطبيق!');
            } else if (text.includes('الشروط')) {
                alert('سياسة الخصوصية والشروط ستكون هنا');
            }
        });
    });
    
    // زر تحديث الأسعار
    document.getElementById('refresh-rates').addEventListener('click', function() {
        this.textContent = 'جاري التحديث...';
        this.disabled = true;
        
        updateRatesDisplay().finally(() => {
            this.textContent = '🔄 تحديث الأسعار الآن';
            this.disabled = false;
        });
    });
    
    // تحديث عرض آخر تحديث
    updateLastUpdateDisplay();
}

// تطبيق الوضع المظلم
function applyDarkMode(mode) {
    const body = document.body;
    
    if (mode === 'dark') {
        body.classList.add('dark-mode');
    } else if (mode === 'light') {
        body.classList.remove('dark-mode');
    } else if (mode === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    }
}

// حفظ الإعدادات
function saveSettings() {
    localStorage.setItem('currencyAppSettings', JSON.stringify(appSettings));
}

// تحديث عرض آخر تحديث
function updateLastUpdateDisplay() {
    const lastUpdateElement = document.getElementById('last-update');
    
    if (appSettings.lastUpdate) {
        const date = new Date(appSettings.lastUpdate);
        const formattedDate = date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        lastUpdateElement.textContent = `آخر تحديث: ${formattedDate}`;
    } else {
        lastUpdateElement.textContent = 'لم يتم تحديث الأسعار بعد';
    }
}

// إضافة مستمع لتغيير الوضع التلقائي
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (appSettings.darkMode === 'auto') {
            applyDarkMode('auto');
        }
    });
}

// تصدير الدوال للاستخدام
export {
    switchPage,
    performConversion,
    updateRatesDisplay,
    saveSettings,
    applyDarkMode
};
