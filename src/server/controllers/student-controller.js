import HocSinh from '../models/hocsinh-model';
import { generateStudentID } from '../utilities/id_generates';
import { changeToYYYYMMDD, changeToDDMMYYYY } from '../utilities/date_times';

function getObjReq(req, sign) {
    let objReq = {
        hoTen: req.body.name,
        ngaySinh: changeToYYYYMMDD(req.body.birthday),
        gioiTinh: req.body.gender,
        diaChi: req.body.address,
        email: req.body.email,
        namNhapHoc: req.body.schoolYearID
    };

    if(sign === 'get') {
        objReq = {
            hoTen: req.query.name,
            gioiTinh: req.query.gender,
            diaChi: req.query.address,
            email: req.query.email,
            namNhapHoc: req.query.schoolYearID
        };
    }

    const objKeys = ['hoTen', 'ngaySinh', 'gioiTinh', 'diaChi', 'email', 'namNhapHoc'];

    for(let i = 0; i < objKeys.length; ++i) {
        if(!objReq[objKeys[i]]) 
            delete objReq[objKeys[i]];
    }

    return objReq;
}

function createStu(req, res) {
    generateStudentID()
    .then((studentID) => {
        return HocSinh.create({
                maHocSinh: studentID,
                hoTen: req.body.name,
                ngaySinh: changeToYYYYMMDD(req.body.birthday),
                gioiTinh: req.body.gender,
                diaChi: req.body.address,
                email: req.body.email,
                namNhapHoc: req.body.schoolYearID
            });
    })
    .then((student) => {
        res.status(200).json({
            success: true,
            message: "Created student successfully"
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Failed to create student"
        })
    });
}

function deleteStu(req, res) {
    HocSinh.findOne({
        where: {
            hocSinh_pkey: req.body.studentID,
        }
    })
    .then((result) => {
        if(result) {
            HocSinh.update({
                delete_flag: '1'
            }, {
                where: {
                    hocSinh_pkey: result.hocSinh_pkey
                }
            })
            .then((rows) => {

                if(rows[0] === 1) {
                     return res.status(200).json({
                        success: true,
                        message: "Delete student successfully"
                    });
                } else {
                    return res.status(200).json({
                        success: false,
                        message: "No student is deleted"
                    });
                }
            });

        } else {
            return res.status(200).json({
                success: false,
                message: "No student found to delete"
            });
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete student"
        });
    });
}

function updateStu(req, res) {
    HocSinh.findOne({
        where: {
            hocSinh_pkey: req.body.studentID,
            delete_flag: '0'
        }
    })
    .then((result) => {
        if(result) {
            let objReq = getObjReq(req);

            HocSinh.update(objReq, {
                where: {
                    hocSinh_pkey: result.hocSinh_pkey
                }
            })
            .then((rows) => {

                if(rows[0] === 1) {
                     return res.status(200).json({
                        success: true,
                        message: "Update student successfully"
                    });
                } else {
                    return res.status(200).json({
                        success: false,
                        message: "No student is updated"
                    });
                }
            });

        } else {
            return res.status(200).json({
                success: false,
                message: "No student found to update"
            });
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to update student"
        });
    });
}

function findStus(req, res) {
    let objReq = getObjReq(req, 'get');

    objReq.delete_flag = '0';

    if(req.query.studentID)
        objReq.hocSinh_pkey = req.query.studentID;

    if(req.query.studentCode)
        objReq.maHocSinh = req.query.studentCode;

    if(objReq.hoTen)
        objReq.hoTen = { $like: '%' + objReq.hoTen + '%' }

    if(objReq.diaChi)
        objReq.diaChi = { $like: '%' + objReq.diaChi + '%' }

    if(req.query.birthdayFrom) {
        console.log(req.query.birthdayFrom);
        const temp = changeToYYYYMMDD(req.query.birthdayFrom);
        objReq.ngaySinh = { $gte: temp }
    }
        

    if(req.query.birthdayTo) {
        const temp = changeToYYYYMMDD(req.query.birthdayTo);
        objReq.ngaySinh = Object.assign({}, objReq.ngaySinh, { $lte: temp });
    }

    console.log(objReq);
    HocSinh.findAll({
        where: objReq
    })
    .then((result) => {
        // console.log(result);
        if(result.length > 0) {
            let objReturning = [];

            for(let i = 0; i < result.length; ++i) {
                objReturning[objReturning.length] = { 
                    studentID: result[i].hocSinh_pkey,
                    studentCode: result[i].maHocSinh,
                    name: result[i].hoTen,
                    birthday: changeToDDMMYYYY(result[i].ngaySinh),
                    gender: result[i].gioiTinh,
                    address: result[i].diaChi,
                    email: result[i].email,
                    schoolYearID: result[i].namNhapHoc
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get students successfully",
                datas: objReturning
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "No student found"
            });
        }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get students"
        });
    })
}

export default { createStu, deleteStu, updateStu, findStus };