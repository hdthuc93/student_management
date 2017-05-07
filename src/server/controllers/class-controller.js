import LopHoc from '../models/lophoc-model';

function getClass(req, res) {
    LopHoc.findAll({
        where: {
            maNamHoc: req.query.schoolYearID,
            maKhoi: req.query.gradeID
        }
    })
    .then((result) => {
        let objReturning = [];
        const len = result.length;
        if(len > 0) {
            for(let i = 0; i < len; ++i) {
                objReturning[objReturning.length] = {
                    classID: result[i].maLop_pkey,
                    classCode: result[i].maLopHoc,
                    className: result[i].tenLop,
                    gradeID: result[i].maKhoi,
                    schoolYearID: result[i].maNamHoc,
                }
            }

            return res.status(200).json({
                success: true,
                message: "Get class(s) successfully",
                datas: objReturning
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "No class found"
            });
        }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get class(s)"
        });
    });
}

export default { getClass };