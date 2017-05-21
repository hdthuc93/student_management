import LopHoc from '../models/lophoc-model';
import QuyDinh from '../models/quydinh-model';
import commonObj from '../utilities/common_object';

function getClass(req, res) {
    LopHoc.findAll({
        where: {
            maNamHoc: commonObj.schoolYearID,
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
                    numOfStus: result[i].siSo,
                    maxNum: result[i].siSoMax,
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

function addClass(schoolYearID) {
    QuyDinh.findOne({
        where: { maNamHoc: schoolYearID }
    })
    .then((result) => {
        addClassInGrade(result, 0, schoolYearID)
    })
    .catch((err) => {
        console.log('---------findClass---------', err);
        return new Error(err);
    });
}

function addClassInGrade(data, index, schoolYearID) {
    if(index > 2)
        return true;

    let arrClasses = JSON.parse(data['dsKhoi1' + index]);
    arrClasses = arrClasses['grade1' + index]
    let arrIns = []
    arrClasses.forEach((element) => {
        arrIns[arrIns.length] = {
            maLopHoc: element.className + '_' + schoolYearID,
            tenLop: element.className,
            siSo: element.maxQty,
            maKhoi: index + 1,
            maNamHoc: schoolYearID
        }
    });

    LopHoc.bulkCreate(arrIns)
    .then((result) => {
        addClassInGrade(data, index + 1, schoolYearID);
    })
    .catch((err) => {
        console.log('addClassInGrade', err);
        return new Error(err);
    });
}

export default { getClass, addClass };