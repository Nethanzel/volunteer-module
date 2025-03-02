export function blobToFile(data, filename) {
    // Crear un enlace para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename); // Nombre del archivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}