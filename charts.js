// توليد رسم بياني SVG صغير
export function generateMiniChart(trend = 'up', width = 60, height = 30) {
    const points = [];
    let y = height / 2;
    const segments = 10;
    const xStep = width / (segments - 1);
    
    // توليد نقاط عشوائية بناءً على الاتجاه
    for (let i = 0; i < segments; i++) {
        const x = i * xStep;
        
        // إضافة تغيير عشوائي
        const change = (Math.random() - 0.5) * 8;
        const trendFactor = trend === 'up' ? -1 : 1;
        
        y += change * trendFactor;
        y = Math.max(5, Math.min(height - 5, y));
        
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    
    const color = trend === 'up' ? '#4ade80' : '#f87171';
    const gradient = trend === 'up' 
        ? 'url(#upGradient)' 
        : 'url(#downGradient)';
    
    // إنشاء مسار للتعبئة
    const pathData = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;
    
    return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
                <linearGradient id="upGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#4ade80;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#4ade80;stop-opacity:0" />
                </linearGradient>
                <linearGradient id="downGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#f87171;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#f87171;stop-opacity:0" />
                </linearGradient>
            </defs>
            <path d="${pathData}" fill="${gradient}" />
            <polyline points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="2" />
        </svg>
    `;
}

// توليد رسم بياني من بيانات حقيقية
export function generateChartFromData(data, width = 60, height = 30) {
    if (!data || data.length === 0) {
        return generateMiniChart('up', width, height);
    }
    
    // إيجاد القيم الدنيا والعليا
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;
    
    // تحويل البيانات إلى نقاط
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const normalizedValue = (d.value - minValue) / range;
        const y = height - (normalizedValue * (height - 10)) - 5;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    
    // تحديد الاتجاه
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const trend = lastValue >= firstValue ? 'up' : 'down';
    const color = trend === 'up' ? '#4ade80' : '#f87171';
    const gradient = trend === 'up' ? 'url(#upGradient)' : 'url(#downGradient)';
    
    // مسار التعبئة
    const pathData = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;
    
    return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
                <linearGradient id="upGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#4ade80;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#4ade80;stop-opacity:0" />
                </linearGradient>
                <linearGradient id="downGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#f87171;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#f87171;stop-opacity:0" />
                </linearGradient>
            </defs>
            <path d="${pathData}" fill="${gradient}" />
            <polyline points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="2" />
        </svg>
    `;
}

// حساب التغيير المئوي
export function calculatePercentageChange(oldValue, newValue) {
    if (!oldValue || oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
}

// تنسيق التغيير المئوي للعرض
export function formatPercentageChange(percentage) {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
}
