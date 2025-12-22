import { CONFIG } from './config.js';

// قائمة المفضلة
let favoritePairs = [];

// تحميل المفضلة من localStorage
export function loadFavorites() {
    try {
        const saved = localStorage.getItem('favoritePairs');
        if (saved) {
            favoritePairs = JSON.parse(saved);
        } else {
            // استخدام الأزواج الافتراضية إذا لم يكن هناك مفضلة محفوظة
            favoritePairs = [...CONFIG.DEFAULT_PAIRS];
            saveFavorites();
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
        favoritePairs = [...CONFIG.DEFAULT_PAIRS];
    }
    return favoritePairs;
}

// حفظ المفضلة
function saveFavorites() {
    try {
        localStorage.setItem('favoritePairs', JSON.stringify(favoritePairs));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

// الحصول على قائمة المفضلة
export function getFavorites() {
    return favoritePairs;
}

// إضافة زوج للمفضلة
export function addToFavorites(from, to) {
    // التحقق من عدم وجود الزوج مسبقاً
    const exists = favoritePairs.some(
        pair => pair.from === from && pair.to === to
    );
    
    if (!exists) {
        favoritePairs.push({ from, to });
        saveFavorites();
        return true;
    }
    return false;
}

// إزالة زوج من المفضلة
export function removeFromFavorites(from, to) {
    const index = favoritePairs.findIndex(
        pair => pair.from === from && pair.to === to
    );
    
    if (index !== -1) {
        favoritePairs.splice(index, 1);
        saveFavorites();
        return true;
    }
    return false;
}

// التحقق من وجود زوج في المفضلة
export function isFavorite(from, to) {
    return favoritePairs.some(
        pair => pair.from === from && pair.to === to
    );
}

// تبديل حالة المفضلة (إضافة أو إزالة)
export function toggleFavorite(from, to) {
    if (isFavorite(from, to)) {
        removeFromFavorites(from, to);
        return false; // تم الإزالة
    } else {
        addToFavorites(from, to);
        return true; // تمت الإضافة
    }
}

// إعادة ترتيب المفضلة
export function reorderFavorites(fromIndex, toIndex) {
    const item = favoritePairs.splice(fromIndex, 1)[0];
    favoritePairs.splice(toIndex, 0, item);
    saveFavorites();
}

// مسح جميع المفضلة
export function clearFavorites() {
    favoritePairs = [];
    saveFavorites();
}

// استعادة الأزواج الافتراضية
export function resetToDefaults() {
    favoritePairs = [...CONFIG.DEFAULT_PAIRS];
    saveFavorites();
}
