import QuyDinh from '../models/quydinh-model';
import NamHoc from '../models/namhoc-model';
import { generateRegulationID } from '../utilities/id_generates';

function insertRegulation(req, res) {
    const insertObj = {
        tuoiMin: req.body.minAge,
        tuoiMax: req.body.maxAge,
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
