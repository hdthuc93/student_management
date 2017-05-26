import ThongKeMon from '../models/thongke_mon-model';
import ThongKeHK from '../models/thongke_hk-model';
import DiemMH from '../models/diemmh-model';
import LopHoc from '../models/lophoc-model';
import MonHoc from '../models/monhoc-model';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import commonObj from '../utilities/common_object';

function createSubjectStatistic(subjectID, semesterID) {

    let inputData = [{
        maMonHoc: subjectID,
        maHocKy: semesterID,
        siSo: 0,
        slDat: 0,
        tyLe: 0,
    }];

    DiemMH.findAndCountAll({ 
        where: {
            maMonHoc: subjectID,
            maHocKy: semesterID,
            tongDiem: { $gte: commonObj.minScore }
        }   
    })
    .then((result) => { 
        inputData[0].slDat = result.count;
        return LopHoc.findOne({ where: { maLop_pkey: classID } })
    })
    .then((result) => {
        inputData[0].siSo = result.siSo;
        inputData[0].tyLe = inputData[0].slDat / inputData[0].siSo;

        return ThongKeMon.bulkCreate(inputData, {
            updateOnDuplicate: ['siSo', 'slDat', 'tyLe']
        })
    })
    .then((result) => {
        console.log(result);
        return true;
    })
    .catch((err) => {
        console.log(err);
        return false;
    })
}

function getSubjectStatistic(req, res) {
    const subjectID = req.query.subjectID;
    const semesterID = req.query.semesterID;
    let objReturning = {
        semesterID: semesterID,
        subjectID: subjectID,
    };

    ThongKeMon.findAll({
        where: {
            maMonHoc: subjectID,
            maHocKy: semesterID
        },
        include: [{
            model: MonHoc
        }]
    })
    .then((results) => {
        
        let len = results.length;
        if(len > 0) {
            objReturning.subjectName = result[0]['M_MON_HOC'].tenMonHoc;

            objReturning.list = [];
            for(let i = 0; i < len; ++i) {
                objReturning.list[objReturning.list.length] = {
                    classID: result[i].maLopHoc,
                    numOfStudents: result[i].siSo,
                    numOfPass: result[i].slDat,
                    ratio: result[i].tyLe
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get subject statistic successfully",
                data: objReturning
            });
        } else {
            createSubjectStatistic(subjectID, semesterID)
            .then((result) => {
                if(result)
                    getSubjectStatistic(req, res);
                else
                    throw new Error("Something wrong when create subject statistic");
            })
        }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get subject statistic"
        });
    })
}

async function createSemesterStatistic(semesterID) {
    let classList = await LopHoc.findAll({
        where: { maNamHoc: commonObj.schoolYearID }
    });
    let inputData = [];
    for(let i = 0; i < classList.length; ++i) {
        inputData[i] = {
            maLopHoc: classList[i].maLop_pkey,
            maHocKy: semesterID,
            siSo: 0,
            slDat: 0,
            tyLe: 0,
        }

        let objCondition = {
            maLopHoc: classID,
        }

        if(semesterID == 1)
            objCondition.tongHK1 = { $gte: commonObj.minScore };
        else
            objCondition.tongHK2 = { $gte: commonObj.minScore };

        let hs_lopResult = await HocSinh_LopHoc.findAndCountAll({ 
            where: objCondition
        });
       
        inputData[i].slDat = hs_lopResult.count;
        let lopHocResult = await LopHoc.findOne({ where: { maLop_pkey: classList[i].maLop_pkey } });
        inputData[i].siSo = lopHocResult.siSo;
        inputData[i].tyLe = inputData[i].slDat / inputData[i].siSo;
    }

    return ThongKeHK.bulkCreate(inputData, {
        updateOnDuplicate: ['siSo', 'slDat', 'tyLe']
    })
    .then((result) => {
        console.log(result);
        return true;
    })
    .catch((err) => {
        return false;
    })
}

function getSemesterStatistic(req, res) {
    const semesterID = req.query.semesterID;

    let objReturning = {
        semesterID: semesterID,
    };

    ThongKeHK.findAll({
        where: {
            maHocKy: semesterID
        },
        include: [{
            model: LopHoc,
            where: {
                maNamHoc: commonObj.schoolYearID
            }
        }]
    })
    .then((results) => {
        let len = results.length;

        if(len > 0) {
            objReturning.list = [];
            for(let i = 0; i < len; ++i) {
                objReturning.list[objReturning.list.length] = {
                    classID: result[i].maLopHoc,
                    numOfStudents: result[i].siSo,
                    numOfPass: result[i].slDat,
                    ratio: result[i].tyLe
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get semester statistic successfully",
                data: objReturning
            });
        } else {
            createSemesterStatistic(semesterID)
            .then((result) => {
                if(result)
                    getSemesterStatistic(req, res);
                else
                    throw new Error("Something wrong when create semester statistic");
            });
        }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get semester statistic"
        });
    })
}

export default { createSubjectStatistic, getSubjectStatistic, createSemesterStatistic, getSemesterStatistic };