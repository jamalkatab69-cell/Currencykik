// === settings.js ===

// بيانات الاتصال
const contactInfo = {
    email: "support@currencyapp.com",
    website: "https://currencyapp.com",
    version: "2.9.0"
};

// إعدادات متقدمة
const advancedSettings = {
    autoRefresh: true,
    refreshInterval: 300000, // 5 دقائق
    defaultAmount: 1000,
    defaultFrom: 'USD',
    defaultTo: 'EUR',
    showFlags: true,
    animations: true
};

// تحميل الإعدادات المتقدمة
function loadAdvancedSettings() {
    const saved = localStorage.getItem('advancedSettings');
    if (saved) {
        Object.assign(advancedSettings, JSON.parse(saved));
    }
}

// حفظ الإعدادات المتقدمة
function saveAdvancedSettings() {
    localStorage.setItem('advancedSettings', JSON.stringify(advancedSettings));
}

// إعداد الوضع المظلم التلقائي
function setupAutoDarkMode() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    darkModeMediaQuery.addEventListener('change', (e) => {
        if (appSettings.darkMode === 'auto') {
            applyDarkMode('auto');
        }
    });
}

// إعادة تعيين الإعدادات
function resetSettings() {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
        localStorage.removeItem('currencyAppSettings');
        localStorage.removeItem('advancedSettings');
        localStorage.removeItem('conversionHistory');
        
        // إعادة تحميل الصفحة
        location.reload();
    }
}

// نسخ احتياطي للإعدادات
function backupSettings() {
    const backup = {
        appSettings: appSettings,
        advancedSettings: advancedSettings,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `إعدادات_محول_العملات_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// استعادة الإعدادات من ملف
function restoreSettings(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (confirm('هل تريد استعادة الإعدادات المحفوظة؟')) {
                if (backup.appSettings) {
                    localStorage.setItem('currencyAppSettings', JSON.stringify(backup.appSettings));
                }
                
                if (backup.advancedSettings) {
                    localStorage.setItem('advancedSettings', JSON.stringify(backup.advancedSettings));
                }
                
                alert('تم استعادة الإعدادات بنجاح! سيتم إعادة تحميل الصفحة.');
                location.reload();
            }
        } catch (error) {
            alert('خطأ في قراءة ملف النسخ الاحتياطي: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

// إضافة قسم الإعدادات المتقدمة
function addAdvancedSettingsSection() {
    const settingsContainer = document.querySelector('.settings-container');
    
    const advancedSection = document.createElement('div');
    advancedSection.className = 'setting-section';
    advancedSection.innerHTML = `
        <h3><i class="fas fa-sliders-h"></i> إعدادات متقدمة</h3>
        <div class="advanced-settings">
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="auto-refresh" ${advancedSettings.autoRefresh ? 'checked' : ''}>
                    <span>التحديث التلقائي للأسعار</span>
                </label>
            </div>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="show-flags" ${advancedSettings.showFlags ? 'checked' : ''}>
                    <span>إظهار أعلام العملات</span>
                </label>
            </div>
            <div class="setting-item">
                <label>
                    <input type="checkbox" id="animations" ${advancedSettings.animations ? 'checked' : ''}>
                    <span>الحركات والانتقالات</span>
                </label>
            </div>
            <div class="setting-buttons">
                <button class="setting-btn secondary" id="backup-btn">
                    <i class="fas fa-download"></i> نسخ احتياطي
                </button>
                <button class="setting-btn secondary" id="reset-btn">
                    <i class="fas fa-redo"></i> إعادة تعيين
                </button>
            </div>
            <div class="restore-section">
                <label for="restore-file" class="restore-btn">
                    <i class="fas fa-upload"></i> استعادة من ملف
                </label>
                <input type="file" id="restore-file" accept=".json" style="display: none;">
            </div>
        </div>
    `;
    
    settingsContainer.insertBefore(advancedSection, settingsContainer.querySelector('.setting-section:last-child'));
    
    // إضافة الأحداث
    document.getElementById('auto-refresh').addEventListener('change', function() {
        advancedSettings.autoRefresh = this.checked;
        saveAdvancedSettings();
    });
    
    document.getElementById('show-flags').addEventListener('change', function() {
        advancedSettings.showFlags = this.checked;
        saveAdvancedSettings();
        toggleFlagsVisibility(this.checked);
    });
    
    document.getElementById('animations').addEventListener('change', function() {
        advancedSettings.animations = this.checked;
        saveAdvancedSettings();
        toggleAnimations(this.checked);
    });
    
    document.getElementById('backup-btn').addEventListener('click', backupSettings);
    document.getElementById('reset-btn').addEventListener('click', resetSettings);
    document.getElementById('restore-file').addEventListener('change', restoreSettings);
}

// تبديل رؤية الأعلام
function toggleFlagsVisibility(show) {
    const flags = document.querySelectorAll('.currency-flag, .rate-flag');
    flags.forEach(flag => {
        flag.style.display = show ? 'block' : 'none';
    });
}

// تبديل الحركات
function toggleAnimations(enabled) {
    document.body.style.transition = enabled ? 'all 0.3s ease' : 'none';
    document.querySelectorAll('*').forEach(el => {
        el.style.transition = enabled ? 'all 0.3s ease' : 'none';
    });
}

// تهيئة الإعدادات المتقدمة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    loadAdvancedSettings();
    setupAutoDarkMode();
    
    // إضافة الإعدادات المتقدمة بعد تأخير بسيط
    setTimeout(addAdvancedSettingsSection, 1000);
    
    // تحديث إصدار التطبيق
    document.querySelector('.version-info span').textContent = `الإصدار ${contactInfo.version}`;
});
