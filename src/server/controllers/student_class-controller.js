import { sequelize, Sequelize } from '../models/index';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import HocSinh from '../models/hocsinh-model';
import LopHoc from '../models/lophoc-model';
import { changeToDDMMYYYY } from '../utilities/date_times';

function canAdd(studentID, classID) {
    let resultStudent;
    return HocSinh_LopHoc.findAll({
        where: {
            maHocSinh: studentID
        },
        include: [{
            model: LopHoc,
            where: {
                maLop_pkey: Sequelize.col('HOCSINH_LOPHOC.MA_LOP_HOC')
            }
        }]
    })
    .then((result) => {
        resultStudent = result;
        return LopHoc.findOne({
            where: { maLop_pkey: classID }
        })
        
    })
    .then((resultClass) => {
        if(resultStudent.length > 0)
            for(let i = 0; i < resultStudent.length; ++i) {
                if(resultClass.maNamHoc === resultStudent[i]['M_LOP_HOC'].maNamHoc)
                    return false;
            }
        return true;
    });
}

function addStuInClass(req, res) {
    const studentID = req.body.studentID;
    const classID = req.body.classID;

    canAdd(studentID, classID).then((result) => {
        if(result) {
            return HocSinh_LopHoc.create({
                maHocSinh: studentID,
                maLopHoc: classID
            })
        } else {
            return res.status(200).json({
                success: false,
                message: "A student exist in another class"
            });
        }
    })
    .then((result) => {
        if(result.maHocSinh) { 
            HocSinh.update({
                inClass: true
            }, {
                where: { hocSinh_pkey: result.maHocSinh }
            });

            LopHoc.update({
                siSo: sequelize.literal('siSo + 1')
            }, { 
                where: { maLop_pkey: result.maLopHoc }
            })

            return res.status(200).json({
                    success: true,
                    message: "Insert student in class successfully"
                });
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to insert student into class"
        });
    });
}

function delStuInClass(req, res) {
    HocSinh_LopHoc.findOne({ where: {
        maHocSinh: req.body.studentID || req.body.studentID,
        maLopHoc: req.body.classID || req.body.classID
    }})
    .then((result) => {
        if(result) {
            HocSinh_LopHoc.destroy({ 
                where: {
                    maHocSinh: result.maHocSinh,
                    maLopHoc: result.maLopHoc
                }
            })
            .then((rows) => {
                if(rows > 0) {
                    HocSinh.update({
                        inClass: false
                    }, {
                        where: { hocSinh_pkey: result.maHocSinh }
                    });

                    LopHoc.update({
                        siSo: sequelize.literal('siSo - 1')
                    }, { 
                        where: { maLop_pkey: result.maLopHoc }
                    });

                    return res.status(200).json({
                        success: true,
                        message: "Delete student in class successfully"
                    });
                } else {
                    return res.status(200).json({
                        success: false,
                        message: "No student in class is deleted"
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
        return res.status(500).json({
            success: false,
            message: "Failed to delete student into class"
        });
    });
}

function getStuInClass(req, res) {
    HocSinh_LopHoc.findAll({
        where: {
            maLopHoc: req.query.classID
        },
        include: [{
            model: HocSinh,
            where: {
                hocSinh_pkey: Sequelize.col('HOCSINH_LOPHOC.MA_HOC_SINH'),
                delete_flag: '0'
            }
        }]
    })
    .then((result) => {
        let objReturning = [];
        const len = result.length;
        for(let i = 0; i < len; ++i) {
            objReturning[objReturning.length] = {
                studentID: result[i]['AE_HOC_SINH'].hocSinh_pkey,
                studentCode: result[i]['AE_HOC_SINH'].maHocSinh,
                name: result[i]['AE_HOC_SINH'].hoTen,
                birthday: changeToDDMMYYYY(result[i]['AE_HOC_SINH'].ngaySinh),
                gender: result[i]['AE_HOC_SINH'].gioiTinh,
                address: result[i]['AE_HOC_SINH'].diaChi,
                email: result[i]['AE_HOC_SINH'].email,
                schoolYearID: result[i]['AE_HOC_SINH'].namNhapHoc,
                inClass: result[i]['AE_HOC_SINH'].inClass
            }
        }

        return res.status(200).json({
            success: true,
            message: "Get student(s) in class successfully",
            datas: objReturning
        });
        // } else {
        //     return res.status(200).json({
        //         success: false,
        //         message: "No student found"
        //     });
        // }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get student(s) in class"
        });
    });
}

export default { addStuInClass, delStuInClass, getStuInClass };