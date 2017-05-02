import HocSinh from '../models/hocsinh-model';


function create(req, res) {
    HocSinh.create({
        maHocSinh: 'abc123',
        hoTen: req.body.name,
        ngaySinh: req.body.birthday,
        gioiTinh: req.body.gender,
        diaChi: req.body.address,
        email: req.body.email,
        namNhapHoc: 1
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