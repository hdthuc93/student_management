import HocSinh from '../models/hocsinh-model';
import { generateStudentID } from '../utilities/id_generates';

function create(req, res) {
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

export default { create };