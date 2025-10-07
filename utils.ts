const nowISO = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);

export { nowISO, uid };
