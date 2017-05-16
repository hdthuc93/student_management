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
            message: "Create new school year successfully"
        });
    }).catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to create school year"
        });
    });
}

export default { getSchoolYear, addNewSchoolYear }