import DiemMH from '../models/diemmh-model';

function addScores(req, res) {
    const len = req.body.listScores.length;

    for(let i = 0; i < len; ++i) {
        console.log('--------------before: ', i);
        DiemMH.upsert({
            maLopHoc: req.body.classID,
            maMonHoc: req.body.subjectID,
            maHocKy: req.body.semesterID,
            maHocSinh: req.body.listScores[i].studentID,
            diem_15phut: req.body.listScores[i].score1 || 15,
            diem_1tiet: req.body.listScores[i].score2 || 15,
            diemCuoiKy: req.body.listScores[i].score3 || 15
        })
        .then((result) => {
            console.log('--------------after: ', i);
            if(i === len - 1)
                return returnAddScore(req, res);
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: "Failed to insert or update score(s)"
            });
        });
    }
}

function returnAddScore(req, res) {
    return res.status(200).json({
        success: true,
        message: "Insert or update score(s) successfully"
    });
}

export default { addScores };