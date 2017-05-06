import HocSinh from '../models/hocsinh-model';
import { sequelize } from '../models/index';

function generateSchoolYear() {
    const today = new Date();
    const month = today.getUTCMonth() + 1;
    const year = today.getUTCFullYear();
    let id = '';

    id = year.toString().slice(2, 4);

    if(month > 6) {
        const nextYear = year + 1;
        id += nextYear.toString().slice(2, 4); 
    } else {
        const prevYear = year - 1;
        id = prevYear.toString().slice(2, 4) + id;
    }

    return id;
}

function generateStudentID() {
    let id = generateSchoolYear();

    return HocSinh.max('hocSinh_pkey')
    .then((quantity) => {
        if(quantity < 10)
            id += '000' + quantity.toString();
        else if(quantity < 100)
            id += '00' + quantity.toString();
        else if(quantity < 1000)
            id += '0' + quantity.toString();
        else 
            id += '0' + quantity.toString();
            
        return id;
    })
    .catch((err) => {
        return new Error("An error occured while generating the student id");
    });
}

export { generateSchoolYear, generateStudentID }