export const calculateAge = (birthDate: string): number => {
    const date = birthDate.split(".");
    const year = date[0];
    const month = date[1];
    const day = date[2];
    const bd = `${day}-${month}-${year}`;
    const birth = new Date(bd);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}; 