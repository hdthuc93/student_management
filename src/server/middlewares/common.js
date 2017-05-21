import commonObj from '../utilities/common_object';
import NamHoc from '../models/namhoc-model';
import QuyDinh from '../models/quydinh-model';

function loadCommonObj() {
    return NamHoc.findOne({
        where: { startFlag: 1 }
    })
    .then((result) => {
        commonObj.schoolYearID = result.namHoc_pkey;
        if(commonObj.schoolYearID)
            return QuyDinh.findOne({
                where: { maNamHoc: commonObj.schoolYearID }
            });
    })
    .then((result) => {
        commonObj.ageMax = result.tuoiMax || 20;
        commonObj.ageMin = result.tuoiMin || 15;
        commonObj.minScore = result.diemChuan || 5;
    });
}

export { loadCommonObj };