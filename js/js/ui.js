export const UI = {
    // تحديث الأعلام بناءً على أسماء ملفات GitHub التي زودتني بها
    updateFlag(elementId, currencyCode, mapping) {
        const imgName = mapping[currencyCode];
        const imgElement = document.getElementById(elementId);
        // استبدل USERNAME و REPO ببياناتك الحقيقية على GitHub
        imgElement.src = `https://raw.githubusercontent.com/USERNAME/REPO/main/images/${imgName}`;
    },
    
    renderResult(value) {
        document.getElementById('result').value = value.toFixed(2);
    },
    
    updateStatus(text) {
        document.getElementById('exchange-info').innerText = text;
    }
};
