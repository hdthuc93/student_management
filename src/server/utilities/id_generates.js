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

    HocSinh.findAll({
        attributes: [[ sequelize.fn('COUNT', sequelize.col('HOC_SINH_PKEY')), 'quantity' ]]
    })
    .then((result) => {
        id += result.quantity.toString();
        return id;
    })
    .catch((err) => {
        return new Error("An error occured while generating the student id");
    });
}

export { generateSchoolYear, generateStudentID }