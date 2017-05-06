import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';

function addInClass(req, res) {
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

function delInClass(req, res) {
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

export default { addInClass, delInClass };