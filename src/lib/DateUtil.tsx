/**
 * Returns a consistent formatted date.
 * @param isoString Date as an ISO formatted date.
 */
export function formatDate(isoString: string) {
    let date = getDate(isoString);
    return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
}
/**
 * Returns a date object.
 * @param isoString Date as an ISO formatted date.
 */
export function getDate(isoString: string) {
    let b = isoString.split(/\D+/);
    let c = +b[1];
    return new Date(Date.UTC(+b[0], --c, +b[2], +b[3], +b[4], +b[5], +b[6]));
}