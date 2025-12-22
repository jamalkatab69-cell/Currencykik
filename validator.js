export const Validator = {
    isValidAmount(value) {
        return !isNaN(value) && value >= 0 && value !== "";
    }
};
