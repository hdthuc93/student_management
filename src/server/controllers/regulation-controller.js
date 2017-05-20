import QuyDinh from '../models/quydinh-model';
import NamHoc from '../models/namhoc-model';
import { generateRegulationID } from '../utilities/id_generates';

function insertRegulation(req, res) {
    const insertObj = {
        tuoiMin: req.body.ageMin,
        tuoiMax: req.body.ageMax,
        slHocSinh_10: req.body.quanGrade10,
        slHocSinh_11: req.body.quanGrade11,
        slHocSinh_12: req.body.quanGrade12,
        diemChuan: req.body.minScore,
        maNamHoc: req.body.schoolYearID
    };

    generateRegulationID(insertObj.maNamHoc)
    .then((regulationID) => {
        insertObj.maQuyDinh = regulationID;

        if(regulationID) {
            QuyDinh.create(insertObj)
            .then((result) => {
                return res.status(200).json({
                    success: true,
                    message: "Insert new regulation successfully"
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to insert new regulation"
                });
            })
        }
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to generate regulation ID"
        });
    })
}

function updateRegulation(req, res) {
    const updateObj = {
        tuoiMin: req.body.ageMin || req.query.ageMin,
        tuoiMax: req.body.ageMax || req.query.ageMax,
        slHocSinh_10: req.body.quanGrade10 || req.query.quanGrade10,
        slHocSinh_11: req.body.quanGrade11 || req.query.quanGrade11,
        slHocSinh_12: req.body.quanGrade12 || req.query.quanGrade12,
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

export default { insertRegulation, updateRegulation };
