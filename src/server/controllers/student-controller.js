import HocSinh from '../models/hocsinh-model';
import { generateStudentID } from '../utilities/id_generates';

function getReqObj(req, sign) {
    let reqObj = {
        hoTen: req.body.name,
        ngaySinh: req.body.birthday,
        gioiTinh: req.body.gender,
        diaChi: req.body.address,
        email: req.body.email,
        namNhapHoc: req.body.schoolYearID
    };

    if(sign === 'get') {
        reqObj = {
            hoTen: req.query.name,
            ngaySinh: req.query.birthday,
            gioiTinh: req.query.gender,
            diaChi: req.query.address,
            email: req.query.email,
            namNhapHoc: req.query.schoolYearID
        };
    }

    const objKeys = ['hoTen', 'ngaySinh', 'gioiTinh', 'diaChi', 'email', 'namNhapHoc'];

    for(let i = 0; i < objKeys.length; ++i) {
        if(!reqObj[objKeys[i]]) 
            delete reqObj[objKeys[i]];
    }

    return reqObj;
}

function createStu(req, res) {
    generateStudentID()
    .then((studentID) => {
        return HocSinh.create({
                maHocSinh: studentID,
                hoTen: req.body.name,
                ngaySinh: req.body.birthday,
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
            let reqObj = getReqObj(req);

            HocSinh.update(reqObj, {
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
    let reqObj = getReqObj(req, 'get');

    reqObj.delete_flag = '0';

    if(req.query.studentID)
        reqObj.hocSinh_pkey = req.query.studentID;

    if(req.query.studentCode)
        reqObj.maHocSinh = req.query.studentCode;

    if(reqObj.hoTen)
        reqObj.hoTen = { $like: '%' + reqObj.hoTen + '%' }

    if(reqObj.diaChi)
        reqObj.diaChi = { $like: '%' + reqObj.diaChi + '%' }

    console.log(reqObj);
    HocSinh.findAll({
        where: reqObj
    })
    .then((result) => {
        // console.log(result);
        if(result.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Get students successfully",
                datas: result
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