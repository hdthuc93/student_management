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

export default { addInClass };