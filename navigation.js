export const Navigation = {
    init() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const screenId = item.getAttribute('data-screen');
                this.switchScreen(screenId);
                
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    },

    switchScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.add('hidden'));
        document.getElementById(`${screenId}-screen`).classList.remove('hidden');
    }
};
