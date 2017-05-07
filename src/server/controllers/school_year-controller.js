import NamHoc from '../models/namhoc-model';

function getSchoolYear(req, res) {
    NamHoc.findAll().then((result) => {
        const len = result.length;
        if(len > 0) {
            const objReturning = {};
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

export default { getSchoolYear }