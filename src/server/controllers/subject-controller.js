import DiemMH from '../models/diemmh-model';

function addScores(req, res) {
    const len = req.body.listScores.length;
    let upsertArr = [];
    for(let i = 0; i < len; ++i) {
        upsertArr[i] = {
            maMonHoc: req.body.subjectID,
            maHocKy: req.body.semesterID,
            maNamHoc: req.body.schoolYearID,
            maHocSinh: req.body.listScores[i].studentID,
            diem_15phut: req.body.listScores[i].score1 || 15,
            diem_1tiet: req.body.listScores[i].score2 || 15,
            diemCuoiKy: req.body.listScores[i].score3 || 15
        };
    }

    DiemMH.bulkCreate(upsertArr, {
        updateOnDuplicate: ['diem_15phut', 'diem_1tiet', 'diemCuoiKy']
    })
    .then((result) => {
        return res.status(200).json({
            success: true,
            message: "Insert or update score(s) successfully"
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to insert or update score(s)"
        });
    });
}

export default { addScores };