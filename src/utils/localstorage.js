export const getAppliedVacancies = () => {
    const applied = localStorage.getItem('appliedVacancies');
    return applied ? JSON.parse(applied) : [];
};
  
export const applyToVacancy = (id) => {
    const applied = getAppliedVacancies();
    if (!applied.includes(id)) {
        applied.push(id);
        localStorage.setItem('appliedVacancies', JSON.stringify(applied));
    }
};