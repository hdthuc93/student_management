import { sequelize, Sequelize } from '../models/index';
import DiemMH from '../models/diemmh-model';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';

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

function getScores(req, res) {
    DiemMH.findAll({
        where: {
            maMonHoc: req.query.subjectID,
            maHocKy: req.query.semesterID,
            maNamHoc: req.query.schoolYearID
        },
        include:[{
            model: HocSinh_LopHoc,
            attributes: [],
            where: {
                maLopHoc: req.query.classID,
                maHocSinh: Sequelize.col('AE_DIEM_MON_HOC.MA_HOC_SINH'),
                maNamHoc: Sequelize.col('AE_DIEM_MON_HOC.MA_NAM_HOC')
            }
        }]
    })
    .then((result) => {
        const classID = Number(req.query.classID);
        const len = result.length;
        let prevStudentID = -1;
        let objReturning = [];
       
        for(let i = 0; i < result.length; ++i) {
            if(result[i].maHocSinh === prevStudentID) {
                continue;
            }

            objReturning[objReturning.length] = {
                subjectID: result[i].maMonHoc,
                semesterID: result[i].maHocKy,
                schoolYearID: result[i].maNamHoc,
                classID: classID,
                studentID: result[i].maHocSinh,
                score1: result[i].diem_15phut,
                score2: result[i].diem_1tiet,
                score3: result[i].diemCuoiKy

            }
            prevStudentID = result[i].maHocSinh;
        }

        
        return res.status(200).json({
            success: true,
            message: "Get score(s) successfully",
            datas: objReturning
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get score(s)"
        });
    })
}

export default { addScores, getScores };