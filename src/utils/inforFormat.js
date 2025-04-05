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
        dateInstance = new Date(dateInstance.setHours(dateInstance.getHours() + 8));
        
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

export function isValidDate(dateString) {
    if (dateString.length < 8) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

export function convertToBase64(texto) {
    if (!texto) return;

    const buffer = Buffer.from(texto, 'utf8');
    const base64 = buffer.toString('base64');
    return base64;
}

export function getFilters(filters) {
    let resultFilters = {};

    Object.keys(filters).forEach(i => {
        if (filters[i].value) {
            let queryParts = getParts(filters[i]);
            let filter = { 
                [filters[i].key] : {
                    description: filters[i].filterDescription,
                    value: queryParts.value,
                    type: queryParts.op
                }
            }
            resultFilters = { ...filter, ...resultFilters }
        }
    });

    return Object.keys(resultFilters).length == 0 ? null : resultFilters;
}

export function getParts(param, convert = true) {
    let values = param.op.split('/');

    let op = values[0];
    const dataType = values[1];

    let value = null;

    if (dataType == 'text') value = param.value
    else if (dataType == 'number') 
    {
        if (op == 'between') {
            let v = param.value.split('-');
            if (v.length == 1) op = 'eq';
            v.forEach((x, i) => v[i] = Number(x));
            value = v;
        }
        else {
            value = Number(param.value);
        }
    }
    else if (dataType == 'bool') {
        value = JSON.parse(param.value);
    }
    else if (dataType == 'date') 
    {
        if (op == 'between') {
            let v = param.value.split('-');
            if (v.length == 1) op = 'eq';
            v.forEach((x,i) => v[i] = convert ? getDate(x) : x);
            v = v.sort((a ,b) => a - b);
            v.forEach((x,i) => v[i] = convert ? new Date(x).toISOString() : x);
            value = v;
        }
        else {
            value = getDate(param.value);
        }
    }
    else if (dataType == 'age')
    {
        if (op == 'between') 
        {
            let v = param.value.split('-');
            if (v.length == 1) op = 'eq';
            let dates = convert ? getDateRange(v[0], v[1]) : null;
            value = convert ? [dates.fechaMinima, dates.fechaMaxima] : v;
        }
        else 
        {
            value = convert ? getDateRange(param.value) : param.value;
        }
    }

    return { value, op }
}

function getDate(age) {
    let today = new Date();
    let newDate = new Date(today.setFullYear(today.getFullYear() - age));

    newDate.setHours(0);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    return newDate.getTime();
}

function getDateRange(minAge, maxAge) {
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();
  
    let fechaMinima;
    let fechaMaxima;
  
    if (maxAge === undefined) {
      // Si solo se proporciona una edad, genera un rango de un año.
      fechaMaxima = new Date(añoActual - minAge, fechaActual.getMonth(), fechaActual.getDate() -1, 20, 0, 0, 0);
      fechaMinima = new Date(añoActual - minAge - 1, fechaActual.getMonth(), fechaActual.getDate() + 1, 20, 0, 0, 0);
    } else {
      // Si se proporciona un rango de edades, genera el rango correspondiente.
      fechaMaxima = new Date(añoActual - minAge, fechaActual.getMonth(), fechaActual.getDate() -1, 20, 0, 0, 0);
      fechaMinima = new Date(añoActual - maxAge - 1, fechaActual.getMonth(), fechaActual.getDate(), 20, 0, 0, 0);
    }
  
    return {
      fechaMinima: fechaMinima.toISOString(),
      fechaMaxima: fechaMaxima.toISOString(),
    };
}