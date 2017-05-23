import { sequelize, Sequelize } from '../models/index';
import DiemMH from '../models/diemmh-model';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import HocSinh from '../models/hocsinh-model';
import QuyDinh from '../models/quydinh-model';
import MonHoc from '../models/monhoc-model';
import commonObj from '../utilities/common_object';

function addScores(req, res) {
    const len = req.body.listScores.length;
    let upsertArr = [];
    for(let i = 0; i < len; ++i) {
        upsertArr[i] = {
            maMonHoc: req.body.subjectID,
            maHocKy: req.body.semesterID,
            maLopHoc: req.body.classID,
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
    const reqParams = {
        maMonHoc: req.query.subjectID,
        maHocKy: req.query.semesterID,
        maLopHoc: req.query.classID
    }

    if(req.query.studentID)
        reqParams.maHocSinh = req.query.studentID;

    DiemMH.findAll({
        where: reqParams,
        include:[{
            model: HocSinh_LopHoc,
            attributes: [],
            where: {
                maHocSinh: Sequelize.col('AE_DIEM_MON_HOC.MA_HOC_SINH'),
                maLopHoc: Sequelize.col('AE_DIEM_MON_HOC.MA_LOP_HOC')
            }
        }]
    })
    .then((result) => {
        
        const len = result.length;
        let prevStudentID = -1;
        let objReturning = {};

        objReturning = {
            subjectID: Number(reqParams.maMonHoc),
            semesterID: Number(reqParams.maHocKy),
            classID: Number(reqParams.maLopHoc),
            listScores: []
        }

        for(let i = 0; i < len; ++i) {
            if(result[i].maHocSinh === prevStudentID) {
                continue;
            }

            objReturning.listScores[objReturning.listScores.length] = {
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

async function addSubjects(schoolYearID) {
    let result = await QuyDinh.findOne({
        where: { maNamHoc: schoolYearID }
    });
    
    let arrSubjects = JSON.parse(result.dsMonHoc);
    arrSubjects = arrSubjects.course;
    let arrIns = []
    arrSubjects.forEach((element) => {
        arrIns[arrIns.length] = {
            tenMonHoc: element.courseName,
            maNamHoc: schoolYearID
        }
    });

    MonHoc.bulkCreate(arrIns);
}

function getSubjects(req, res) {
    MonHoc.findAll({ where: { maNamHoc: commonObj.schoolYearID } })
    .then((result) => {
        const len = result.length;

        let objReturning = [];
        for(let i = 0; i < len; ++i) {
            objReturning[objReturning.length] = {
                subjectID: result[i].monHoc_pkey,
                subjectName: result[i].tenMonHoc,
                schoolYearID: result[i].maNamHoc
            }
        }

        return res.status(200).json({
            success: true,
            message: "Get subject successfully",
            datas: objReturning
        });
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get subject"
        });
    });
}

export default { addScores, getScores, addSubjects, getSubjects };