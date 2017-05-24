import { sequelize, Sequelize } from '../models/index';
import DiemMH from '../models/diemmh-model';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import HocSinh from '../models/hocsinh-model';
import QuyDinh from '../models/quydinh-model';
import MonHoc from '../models/monhoc-model';
import commonObj from '../utilities/common_object';

function addScores(req, res) {
    try{
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
    } catch(ex) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to insert or update score(s)"
        });
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
        maHocKy: req.query.semesterID,
        maLopHoc: req.query.classID
    }

    if(req.query.subjectID)
        reqParams.maMonHoc = req.query.subjectID;

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
            },
            required: true
        }]
    })
    .then((result) => {
        const len = result.length;
        let prevStudentID = -1;
        let objReturning = {};

        objReturning = {
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
                studentName: '',
                subjectID: result[i].maMonHoc,
                subjectName: '',
                score1: result[i].diem_15phut,
                score2: result[i].diem_1tiet,
                score3: result[i].diemCuoiKy,
                totalScore: result[i].tongDiem || 15

            }
            prevStudentID = result[i].maHocSinh;
        }

        (async function (req, res, objReturning) {
            for(let i = 0; i < objReturning.listScores.length; ++i) {
                const resStudent = await HocSinh.findOne({ where: { hocSinh_pkey: objReturning.listScores[i].studentID } });
                const resSubject = await MonHoc.findOne({ where: { monHoc_pkey: objReturning.listScores[i].subjectID }});
                objReturning.listScores[i].studentName = resStudent.hoTen;
                objReturning.listScores[i].subjectName = resSubject.tenMonHoc;
            }

            return res.status(200).json({
                success: true,
                message: "Get score(s) successfully",
                datas: objReturning
            });
        })(req, res, objReturning);
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

function summary(req, res) {
    const inputClassID = req.body.classID;
    const inputSemesterID = req.body.semesterID;
    DiemMH.update({ tongDiem: sequelize.literal('(DIEM_15_PHUT + DIEM_1_TIET*2 + DIEM_CUOI_KI*3) / 6') }, {
        where: { 
            maHocKy: inputSemesterID,
            maLopHoc: inputClassID,
            diem_15phut: { $ne: null },
            diem_1tiet: { $ne: null },
            diemCuoiKy: { $ne: null }
        }
    })
    .then( async (result) => {
        let subjectCount = await MonHoc.findAndCountAll({
                                where: { maNamHoc: commonObj.schoolYearID }
                            });
        subjectCount = subjectCount.count;

        HocSinh_LopHoc.findAll({
            where: { maLopHoc: inputClassID }
        })
        .then( async (result) => {
            for(let i = 0; i < result.length; ++i) {
                const subjects = await DiemMH.findAll({ 
                                    where: { 
                                        maLopHoc: inputClassID,
                                        maHocKy: inputSemesterID,
                                        maHocSinh: result[i].maHocSinh
                                    } 
                                });
                
                let tongHK = 0;
                for(let j = 0; j < subjects.length; ++j) {
                    tongHK += subjects[i].tongDiem || 0;
                }
                tongHK = tongHK / subjectCount;

                if(inputSemesterID == 1)
                    await HocSinh_LopHoc.update({ tongHK1: tongHK }, {
                        where: {
                            maLopHoc: inputClassID,
                            maHocSinh: result[i].maHocSinh
                        }
                    });
                else {
                    let tongCaNam = (result[i].tongHK1 || 0 + tongHK) / 2;
                    let passed = tongCaNam < commonObj.minScore ? false : true; 
                    await HocSinh_LopHoc.update({ tongHK2: tongHK, tongCaNam: tongCaNam, passed: passed }, {
                        where: {
                            maLopHoc: inputClassID,
                            maHocSinh: result[i].maHocSinh
                        }
                    });
                }
            }
        })

        return res.status(200).json({
            success: true,
            message: "Summary school year is successfully"
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to summary school year"
        });
    })
}

export default { addScores, getScores, addSubjects, getSubjects, summary };