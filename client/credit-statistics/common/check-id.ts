export function checkId(id:string) {
    if (id.length != 10) {
        return false;
    }
    let Regx = /^[A-Za-z]*$/;
    if (!Regx.test(id.slice(0, 1))) {
        return false;
    }
    Regx = /^[0-9]*$/;
    if (!Regx.test(id.slice(1, 10))) {
        return false;
    }
    return true;
}