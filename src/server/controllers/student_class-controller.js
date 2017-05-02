import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import { getDateNow } from '../utilities/date_times';

function addInClass(req, res) {
    HocSinh_LopHoc.create({
        maHocSinh: req.body.studentID,
        maLopHoc: req.body.classID,
        ngayThamGia: getDateNow()
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

function delInClass(req, res) {
    HocSinh_LopHoc.findOne({ where: {
        maHocSinh: req.body.studentID,
        maLopHoc: req.body.classID,
        ngayThamGia: req.body.joinDate
    }})
    .then((result) => {
        if(result) {
            HocSinh_LopHoc.destroy({ 
                where: {
                    maHocSinh: result.maHocSinh,
                    maLopHoc: result.maLopHoc,
                    ngayThamGia: result.ngayThamGia
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

export default { addInClass, delInClass };