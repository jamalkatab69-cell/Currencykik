.input-card {
    background: var(--card-bg);
    border-radius: 20px;
    padding: 25px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.flag-circle {
    width: 32px; height: 32px;
    border-radius: 50%;
    object-fit: cover;
}

.bottom-nav {
    background: rgba(28, 28, 30, 0.9);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: space-around;
    padding: 15px 0;
    border-top: 0.5px solid #333;
}

.nav-item { color: var(--text-dim); text-align: center; font-size: 11px; cursor: pointer; }
.nav-item.active { color: var(--accent); }
