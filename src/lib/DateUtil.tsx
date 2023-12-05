export function formatDate(isoString: string) {
    let b = isoString.split(/\D+/);
    let c = +b[1];
    let date = new Date(Date.UTC(+b[0], --c, +b[2], +b[3], +b[4], +b[5], +b[6]));

    return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
}