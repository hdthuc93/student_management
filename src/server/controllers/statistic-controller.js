import ThongKeMon from '../models/thongke_mon-model';
import ThongKeHK from '../models/thongke_hk-model';
import DiemMH from '../models/diemmh-model';
import LopHoc from '../models/lophoc-model';
import MonHoc from '../models/monhoc-model';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import commonObj from '../utilities/common_object';

function createSubjectStatistic() {
    const subjectID = '';
    const semesterID = '';

    let inputData[0] = {
        maMonHoc: subjectID,
        maHocKy: semesterID,
        siSo: 0,
        slDat: 0,
        tyLe: 0,
    }

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

    })
    .catch((err) => {

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
        if(len > 0)
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
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get subject statistic"
        });
    })
}

function createSemesterStatistic() {
    const classID = '';
    const semesterID = '';

    let inputData[0] = {
        maLopHoc: classID,
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

    HocSinh_LopHoc.findAndCountAll({ 
        where: objCondition
    })
    .then((result) => { 
        inputData[0].slDat = result.count;
        return LopHoc.findOne({ where: { maLop_pkey: classID } })
    })
    .then((result) => {
        inputData[0].siSo = result.siSo;
        inputData[0].tyLe = inputData[0].slDat / inputData[0].siSo;

        return ThongKeHK.bulkCreate(inputData, {
            updateOnDuplicate: ['siSo', 'slDat', 'tyLe']
        })
    })
    .then((result) => {

    })
    .catch((err) => {
        
    })
}

function getSemesterStatistic(req, res) {
    const semesterID = req.query.semesterID;

    let objReturning = {
        semesterID: semesterID,
    };

    ThongKeHK.findAll({
        where: {
            maMonHoc: subjectID,
            maHocKy: semesterID
        }
    })
    .then((results) => {
        let len = results.length;

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
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get semester statistic"
        });
    })
}

export default { createSubjectStatistic, getSubjectStatistic, createSemesterStatistic, getSemesterStatistic };