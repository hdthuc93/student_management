import { Sequelize } from '../models/index';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import HocSinh from '../models/hocsinh-model';

function addStuInClass(req, res) {
    HocSinh_LopHoc.create({
        maHocSinh: req.body.studentID,
        maLopHoc: req.body.classID,
        maNamHoc: req.body.schoolYearID
    })
    .then((result) => {
        return res.status(200).json({
            success: true,
            message: "Insert student in class successfully"
        });
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to insert student into class"
        });
    });
}

function delStuInClass(req, res) {
    HocSinh_LopHoc.findOne({ where: {
        maHocSinh: req.body.studentID,
        maNamHoc: req.body.schoolYearID
    }})
    .then((result) => {
        if(result) {
            HocSinh_LopHoc.destroy({ 
                where: {
                    maHocSinh: result.maHocSinh,
                    maNamHoc: result.schoolYearID
                }
            })
            .then((rows) => {
                if(rows > 0) {
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
            maLopHoc: req.query.classID,
            maNamHoc: req.query.schoolYearID
        },
        include: [{
            model: HocSinh,
            where: {
                maHocSinh: Sequelize.col('HOCSINH_LOPHOC.MA_HOC_SINH'),
                delete_flag: '0'
            }
        }]
    })
    .then((result) => {
        let objReturning = [];
        const len = result.length;
        if(len > 0) {
            for(let i = 0; i < len; ++i) {
                objReturning[objReturning.length] = {
                    studentID: result[i]['AE_HOC_SINH'].hocSinh_pkey,
                    studentCode: result[i]['AE_HOC_SINH'].maHocSinh,
                    name: result[i]['AE_HOC_SINH'].hoTen,
                    birthday: result[i]['AE_HOC_SINH'].ngaySinh,
                    gender: result[i]['AE_HOC_SINH'].gioiTinh,
                    address: result[i]['AE_HOC_SINH'].diaChi,
                    email: result[i]['AE_HOC_SINH'].email,
                    schoolYearID: result[i]['AE_HOC_SINH'].namNhapHoc,
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get student(s) in class successfully",
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
            message: "Failed to get student(s) in class"
        });
    });
}

export default { addStuInClass, delStuInClass, getStuInClass };