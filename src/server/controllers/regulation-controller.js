import QuyDinh from '../models/quydinh-model';
import NamHoc from '../models/namhoc-model';
import { generateRegulationID } from '../utilities/id_generates';
import commonObj from '../utilities/common_object';

function insertRegulation(req, res, schoolYearID) {
    const insertObj = {
        tuoiMin: commonObj.ageMin,
        tuoiMax: commonObj.ageMax,
        diemChuan: commonObj.minScore,
        dsKhoi10: commonObj.listGrade10,
        dsKhoi11: commonObj.listGrade11,
        dsKhoi12: commonObj.listGrade12,
        dsMonHoc: commonObj.listSubjects,
        maNamHoc: schoolYearID
    };

    return generateRegulationID(schoolYearID)
    .then((regulationID) => {
        insertObj.maQuyDinh = regulationID;

        if(regulationID) {
            QuyDinh.create(insertObj)
            .then();
        }
    })
    .catch((err) => {
        console.log(err);
        throw new Error(err);
    })
}

function updateRegulation(req, res) {
    const updateObj = {
        tuoiMin: req.body.ageMin || req.query.ageMin,
        tuoiMax: req.body.ageMax || req.query.ageMax,
        diemChuan: req.body.minScore || req.query.minScore
    };

    const schoolYearID = req.body.schoolYearID || req.query.schoolYearID

    NamHoc.findOne({ where: { namHoc_pkey: schoolYearID } })
    .then((result) => {
        if(!result) {
            return res.status(200).json({
                success: false,
                message: "No school year ID has been found"
            });
        } else if(result.startFlag === '0') {
            QuyDinh.update(updateObj, { where: { maNamHoc: schoolYearID } })
            .then((result) => {
                if(result.length === 1) {
                    return res.status(200).json({
                        success: true,
                        message: "Update new regulation successfully"
                    });
                } else {
                    return res.status(200).json({
                        success: false,
                        message: "No record regulation is updated"
                    });
                }
            })
        } else {
            return res.status(200).json({
                success: false,
                message: "Cannot update regulation, because the school year has been or is going on"
            });
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to update new regulation"
        });
    });
}

function getRegulation(req, res) {
    QuyDinh.findOne({
        where: { maNamHoc: req.query.schoolYearID }
    })
    .then((result) => {
        let objReturning = {};
        if(result) {
            objReturning = {
                regulationID: result.quyDinh_pkey,
                regulationCode: result.maQuyDinh,
                minAge: result.tuoiMin,
                maxAge: result.tuoiMax,
                minScore: result.diemChuan,
                schoolYearID: result.maNamHoc
            };
            objReturning = Object.assign({}, objReturning, JSON.parse(result.dsKhoi10));
            objReturning = Object.assign({}, objReturning, JSON.parse(result.dsKhoi11));
            objReturning = Object.assign({}, objReturning, JSON.parse(result.dsKhoi12));
            objReturning = Object.assign({}, objReturning, JSON.parse(result.dsMonHoc));
        }

        return res.status(200).json({
            success: true,
            message: "Get regulation successfully",
            data: objReturning
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to get regulation"
        });
    });
}

export default { insertRegulation, updateRegulation, getRegulation };
