

function getDateNow() {
    const now =  new Date();
    const month = now.getUTCMonth() + 1;
    const year = now.getUTCFullYear();
    const date = now.getUTCDate() + 1;

    let result = year.toString();

    if(month < 10) {
        result += '/0' + month.toString();   
    } else {
        result += '/' + month.toString();
    }

    if(date < 10) {
        result += '/0' + date.toString();   
    } else {
        result += '/' + date.toString();
    }

    return result;
}

export { getDateNow };