export function formatIdentification(input) {
    if (!input) return;
    // Elimina cualquier caracter que no sea un número
    let digits = input.replace(/\D/g, '');
    // Verifica que al menos tenga la cantidad mínima de caracteres
    if (digits.length != 11) return input;
    // Aplica el formato XXX-XXXXXXX-X
    return `${digits.slice(0, 3)}-${digits.slice(3, 10)}-${digits.slice(10, 11)}`;
}

export function formatPhoneNumber(input) {
    if (!input) return;
    // Elimina cualquier caracter que no sea un número
    let digits = input.replace(/\D/g, '');
    // Verifica que tenga al menos 10 dígitos
    if (digits.length != 10) return input;
    // Aplica el formato (XXX) XXX-XXXX
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function formatDate(date) {
    if(date) {
        let dateInstance = new Date(date);
        
        let month = `${dateInstance.getMonth() + 1}`.padStart(2,"0");
        let day = `${dateInstance.getDate()}`.padStart(2,"0");
        let year = `${dateInstance.getFullYear()}`;

        let hour = `${dateInstance.getHours()}`.padStart(2,"0");
        let minutes = `${dateInstance.getMinutes()}`.padStart(2,"0");
        let seconds = `${dateInstance.getSeconds()}`.padStart(2,"0");

        let newDate = `${day}/${month}/${year} a las ${hour}:${minutes}:${seconds}`;
        return newDate;
    }
    return "No hay fecha"
}