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

export function formatDate(date, onlyDate = false) {
    if(date != undefined && date != null) {
        date = date.toString().trim();
        let dateInstance = new Date(date);

        let month = `${dateInstance.getMonth() + 1}`.padStart(2,"0");
        let day = `${dateInstance.getDate()}`.padStart(2,"0");
        let year = `${dateInstance.getFullYear()}`;

        let hour = `${dateInstance.getHours()}`.padStart(2,"0");
        let minutes = `${dateInstance.getMinutes()}`.padStart(2,"0");
        let seconds = `${dateInstance.getSeconds()}`.padStart(2,"0");

        let resultDate = `${day}/${month}/${year}`;

        if (onlyDate) return resultDate;

        return `${resultDate} a las ${hour}:${minutes}:${seconds}`;
    }
    return "No hay fecha"
}

export function calcularEdad(fechaNacimiento) {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    const dia = hoy.getDate() - fechaNac.getDate();

    if (mes < 0 || (mes === 0 && dia < 0)) edad--;

    return edad;
}

export function titleCase(texto) {
    return texto
        .toLowerCase() // Convertimos todo a minúsculas
        .split(" ") // Dividimos en palabras
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)) // Capitalizamos cada palabra
        .join(" "); // Unimos nuevamente
}