export function bufferToBase64(buffer, mime) {
    const byteArray = new Uint8Array(buffer);
    const image = Buffer.from(byteArray).toString('base64');
    return `data:${mime};base64,${image}`;
}