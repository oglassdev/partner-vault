/**
 * Returns a hex color as a formatted hex color string.
 * @param colorNumber
 */
export function numberToHex(colorNumber: number): string {
    if (colorNumber < 0 || colorNumber > 16777215) throw new Error("Color is not within acceptable range!");
    let hexString = colorNumber.toString(16);
    while (hexString.length < 6) {
        hexString = '0' + hexString;
    }
    return `#${hexString}`;
}
/**
 * Returns a number from a hex string.
 * @param hexColor
 */
export function hexToNumber(hexColor: string): number {
    const hexRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    if (!hexRegex.test(hexColor)) throw new Error("Invalid hex color string");
    if (hexColor.startsWith('#')) hexColor = hexColor.slice(1);
    if (hexColor.length === 3) hexColor = hexColor.split('').map(char => char + char).join('');

    return parseInt(hexColor, 16);
}