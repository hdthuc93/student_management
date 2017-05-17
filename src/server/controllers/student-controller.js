import HocSinh from '../models/hocsinh-model';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import LopHoc from '../models/lophoc-model';
import { Sequelize } from '../models/index';
import { generateStudentID } from '../utilities/id_generates';
import { changeToYYYYMMDD, changeToDDMMYYYY } from '../utilities/date_times';

function getObjReq(req) {
    let objReq = {
        hoTen: req.body.name,
        ngaySinh: changeToYYYYMMDD(req.body.birthday),
        gioiTinh: req.body.gender,
        diaChi: req.body.address,
        email: req.body.email,
        namNhapHoc: req.body.schoolYearID
    };

    const objKeys = ['hoTen', 'ngaySinh', 'gioiTinh', 'diaChi', 'email', 'namNhapHoc'];

    for(let i = 0; i < objKeys.length; ++i) {
        if(!objReq[objKeys[i]]) 
            delete objReq[objKeys[i]];
    }

    return objReq;
}

function getReqOptionParams(req) {
    let objReq = {};

    objReq.delete_flag = '0';

    if(req.query.studentID)
        objReq.hocSinh_pkey = req.query.studentID;

    if(req.query.studentCode)
        objReq.maHocSinh = req.query.studentCode;

    if(req.query.yearAdmission)
        objReq.namNhapHoc = req.query.yearAdmission;

    if(req.query.email)
        objReq.email = req.query.email;

    if(req.query.gender)
        obj.gioiTinh = req.query.gender;

    if(req.query.name)
        objReq.hoTen = { $like: '%' + req.query.name + '%' }

    if(req.query.address)
        objReq.diaChi = { $like: '%' + req.query.address + '%' }

    if(req.query.birthdayFrom) {
        const temp = changeToYYYYMMDD(req.query.birthdayFrom);
        objReq.ngaySinh = { $gte: temp }
    }
        
    if(req.query.birthdayTo) {
        const temp = changeToYYYYMMDD(req.query.birthdayTo);
        objReq.ngaySinh = Object.assign({}, objReq.ngaySinh, { $lte: temp });
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
            hocSinh_pkey: req.body.studentID || req.query.studentID,
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
    let objReq = getReqOptionParams(req);
    let objReturning = [];
    const reqSchoolYearNow = req.query.schoolYearNow;

    HocSinh.findAll({
        where: objReq,
        include: [{
            model: HocSinh_LopHoc,
            include: [{
                    model: LopHoc,
                    where: {
                        maNamHoc: reqSchoolYearNow //|| Sequelize.col('M_LOP_HOC.MA_NAM_HOC')
                    },
                    required: false
                }
            ],
            required: false
        }]
    })
    .then((result) => {
        if(result.length > 0) {

            for(let i = 0; i < result.length; ++i) {
                let classID = -1;
                let className = '';
                let schoolYearNow = -1;
                
                if(result[i]['HOCSINH_LOPHOCs'][0] && result[i]['HOCSINH_LOPHOCs'][0]['M_LOP_HOC']) {
                    classID = Number(result[i]['HOCSINH_LOPHOCs'][0].maLopHoc);
                    className = result[i]['HOCSINH_LOPHOCs'][0]['M_LOP_HOC'].tenLop;
                    schoolYearNow = Number(result[i]['HOCSINH_LOPHOCs'][0]['M_LOP_HOC'].maNamHoc);
                }

                objReturning[objReturning.length] = { 
                    studentID: result[i].hocSinh_pkey,
                    studentCode: result[i].maHocSinh,
                    name: result[i].hoTen,
                    birthday: changeToDDMMYYYY(result[i].ngaySinh),
                    gender: result[i].gioiTinh,
                    address: result[i].diaChi,
                    email: result[i].email,
                    yearAdmission: result[i].namNhapHoc,
                    inClass: result[i].inClass,
                    classID:  classID,
                    className:  className,
                    schoolYearNow: schoolYearNow
                }
            }

            if(reqSchoolYearNow)
                for(let i = 0; i < objReturning.length; ++i) {
                    if(objReturning[i].schoolYearNow !== Number(reqSchoolYearNow)) {
                        objReturning.splice(i, 1);
                        --i;
                    }
                }

            if(objReturning.length > 0)
                return res.status(200).json({
                    success: true,
                    message: "Get students successfully",
                    datas: objReturning
                });
            else 
                return res.status(200).json({
                    success: false,
                    message: "No student found"
                });
        } else {
            return res.status(200).json({
                success: false,
                message: "No student found"
            });
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get students"
        });
    })
}

export default { createStu, deleteStu, updateStu, findStus };