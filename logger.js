export const Logger = {
    log(msg) { console.log(`[INFO] ${new Date().toLocaleTimeString()}: ${msg}`); },
    error(msg) { console.error(`[ERROR] ${new Date().toLocaleTimeString()}: ${msg}`); }
};
