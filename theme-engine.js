export const ThemeEngine = {
    init() {
        // تطبيق الثيم الداكن افتراضياً
        document.body.classList.add('dark-mode');
    },
    toggle() {
        document.body.classList.toggle('light-mode');
    }
};
