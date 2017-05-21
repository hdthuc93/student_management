import { sequelize, Sequelize } from '../models/index';
import NamHoc from '../models/namhoc-model';
import QuyDinh from '../models/quydinh-model';
import regulationCtrl from './regulation-controller';

function getSchoolYear(req, res) {
    NamHoc.findAll().then((result) => {
        const len = result.length;
        if(len > 0) {
            let objReturning = [];
            for(let i = 0; i < len; ++i) {
                objReturning[objReturning.length] = {
                    schoolYearID: result[i].namHoc_pkey,
                    schooYearCode: result[i].maNamHoc,
                    schoolYearName: result[i].tenNamHoc,
                    status: result[i].startFlag
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get school year(s) successfully",
                data: objReturning
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "No school year(s) found"
            });
        }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to school year(s)"
        });
    });
}

function getFutureSchoolYear(req, res) {
    NamHoc.findAll({ 
        where: { startFlag: '0' }
    }).then((result) => {
        const len = result.length;

        let objReturning = [];
        for(let i = 0; i < len; ++i) {
            objReturning[objReturning.length] = {
                schoolYearID: result[i].namHoc_pkey,
                schooYearCode: result[i].maNamHoc,
                schoolYearName: result[i].tenNamHoc,
                status: result[i].startFlag
            }
        }

        return res.status(200).json({
            success: true,
            message: "Get future school year(s) successfully",
            datas: objReturning
        });
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to school year(s)"
        });
    });
}

function addNewSchoolYear(req, res) {
    NamHoc.create({
        maNamHoc: req.body.year,
        tenNamHoc: req.body.year
    }).then((result) => {
        let objReturning = {
            schoolYearID: result.namHoc_pkey,
            schoolYearCode: result.maNamHoc,
            schoolYearName: result.tenNamHoc,
            startFlag: result.startFlag
        };

        regulationCtrl.insertRegulation(req, res, result.namHoc_pkey)
        .then(() => {
            return res.status(200).json({
                success: true,
                message: "Create new school year successfully",
                data: objReturning
            });
        });
    }).catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to create school year"
        });
    });
}

function changeSchoolYear(req, res) {
    const schoolYearID = req.body.schoolYearID || req.query.schoolYearID;
    if(schoolYearID) {
        QuyDinh.findOne({ where: { maNamHoc: schoolYearID } })
        .then((result) => {
            if(result) {
                sequelize.transaction().then((t) => {
                    NamHoc.update({ startFlag: '2' }, { where: { startFlag: '1' }, transaction: t })
                    .then((result) => {
                        return NamHoc.update({ startFlag: '1' }, { where: { namHoc_pkey: schoolYearID, startFlag: '0' }, transaction: t })
                    })
                    .then((result) => {
                        if(result[0] === 0) {
                            t.rollback();
                            return res.status(200).json({
                                success: false,
                                message: "Cannot change school year, because school year want to change in the past"
                            });
                        } else {
                            t.commit();
                            return res.status(200).json({
                                success: true,
                                message: "Change the current school year successfully"
                            });
                        }
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            success: false,
                            message: "Failed to the current school year"
                        });
                    });
                });
            } else {
                return res.status(200).json({
                    success: false,
                    message: "Cannot change school year, because regulation has not found"
                })
            }
        })
    } else {
        return res.status(200).json({
            success: false,
            message: "No school year ID in request"
        });
    }
}

export default { getSchoolYear, getFutureSchoolYear, addNewSchoolYear, changeSchoolYear }