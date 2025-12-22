export const Converter = {
    convert(amount, fromRate, toRate) {
        // التحويل يعتمد على الدولار كأساس: (المبلغ / سعر المصدر) * سعر الهدف
        if (!fromRate || !toRate) return 0;
        return (amount / fromRate) * toRate;
    }
};
