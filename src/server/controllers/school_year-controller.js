import NamHoc from '../models/namhoc-model';

function getSchoolYear(req, res) {
    NamHoc.findAll().then((result) => {
        const len = result.length;
        if(len > 0) {
            let objReturning = [];
            for(let i = 0; i < len; ++i) {
                objReturning[objReturning.length] = {
                    schoolYearID: result[i].namHoc_pkey,
                    schooYearCode: result[i].maNamHoc,
                    schoolYearName: result[i].tenNamHoc
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

function addNewSchoolYear(req, res) {
    NamHoc.create({
        maNamHoc: req.body.year,
        tenNamHoc: req.body.year
    }).then((result) => {
        return res.status(200).json({
            success: true,
            message: "Create new school year successfully",
            data: result
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
        NamHoc.update({ startFlag: '2' }, { where: { startFlag: '1' } })
        .then((result) => {
            return NamHoc.update({ startFlag: '1' }, { where: { namHoc_pkey: schoolYearID } })
        })
        .then((result) => {
            return res.status(200).json({
                success: true,
                message: "Change the current school year successfully"
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: "Failed to the current school year"
            });
        })
    } else {
        return res.status(200).json({
            success: false,
            message: "No school year ID in request"
        });
    }
}

export default { getSchoolYear, addNewSchoolYear, changeSchoolYear }