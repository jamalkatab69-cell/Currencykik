export const ChartService = {
    drawSimpleLine(canvasId) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        ctx.strokeStyle = '#30d158';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        for(let i=0; i<100; i+=10) {
            ctx.lineTo(i, Math.random() * 20);
        }
        ctx.stroke();
    }
};
