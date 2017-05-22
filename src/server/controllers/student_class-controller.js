import { sequelize, Sequelize } from '../models/index';
import HocSinh_LopHoc from '../models/hocsinh_lophoc-model';
import HocSinh from '../models/hocsinh-model';
import LopHoc from '../models/lophoc-model';
import { changeToDDMMYYYY } from '../utilities/date_times';

async function canAdd(studentList) {
    let resultStudent;
    for(let i = 0; i < studentList.length; ++i) {
        let flag = await HocSinh.findOne({ where: { hocSinh_pkey: studentList[i] }});
                        
        if(flag)
            return false;
    }
}

async function addStuInClass(req, res) {
    const studentList = req.body.studentList;
    const len = studentList.length;
    const classID = req.body.classID;

    

    if(canAdd(studentList)) {
        let arrIns = [];
        for(let i = 0; i < len; ++i) {
            arrIns[arrIns.length] = {
                maHocSinh: studentList[i],
                maLopHoc: classID
            }
        }
        try {
            let result = await HocSinh_LopHoc.bulkCreate(arrIns);
            for(let i = 0; i < len; ++i) {
                await HocSinh.update({
                    inClass: true
                }, {
                    where: { hocSinh_pkey: studentList[i] }
                });
            }
        } catch(ex) {
            console.log(ex);
            return res.status(500).json({
                success: false,
                message: "Failed to insert student(s) into class"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Insert student in class successfully"
        });
    } else {
        return res.status(200).json({
            success: false,
            message: "A student exist in another class"
        });
    }
    
    // if(result) {
    //     return HocSinh_LopHoc.create({
    //         maHocSinh: studentID,
    //         maLopHoc: classID
    //     })
    // } else {
    //     return res.status(200).json({
    //         success: false,
    //         message: "A student exist in another class"
    //     });
    // }
    // .then((result) => {
    //     if(result.maHocSinh) { 
    //         HocSinh.update({
    //             inClass: true
    //         }, {
    //             where: { hocSinh_pkey: result.maHocSinh }
    //         });

    //         LopHoc.update({
    //             siSo: sequelize.literal('siSo + 1')
    //         }, { 
    //             where: { maLop_pkey: result.maLopHoc }
    //         })

    //         return res.status(200).json({
    //                 success: true,
    //                 message: "Insert student in class successfully"
    //             });
    //     }
    // })
    // .catch((err) => {
    //     console.log(err);
    //     return res.status(500).json({
    //         success: false,
    //         message: "Failed to insert student into class"
    //     });
    // });
}

function delStuInClass(req, res) {
    let studentList = req.body.studentList || req.body.studentList || [];
    let classID = req.body.classID || req.body.classID;
    delStudents(res, studentList, 0, classID);
}

function delStudents(res, studentList, index, classID) {
    if(index > studentList.length - 1)
        return res.status(200).json({
            success: true,
            message: "Delete student in class successfully"
        });
    else {
        HocSinh_LopHoc.findOne({ where: {
            maHocSinh: studentList[index],
            maLopHoc: classID
        }})
        .then((result) => {
            if(result) {
                HocSinh_LopHoc.destroy({ 
                    where: {
                        maHocSinh: result.maHocSinh,
                        maLopHoc: result.maLopHoc
                    }
                })
                .then((rows) => {
                    if(rows > 0) {
                        HocSinh.update({
                            inClass: false
                        }, {
                            where: { hocSinh_pkey: result.maHocSinh }
                        });

                        LopHoc.update({
                            siSo: sequelize.literal('siSo - 1')
                        }, { 
                            where: { maLop_pkey: result.maLopHoc }
                        });
                    }
                    delStudents(res, studentList, index + 1, classID);
                });
            } else {
                delStudents(res, studentList, index + 1, classID);
            }
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: "Failed to delete student into class"
            });
        });
    }
}

function getStuInClass(req, res) {
    HocSinh_LopHoc.findAll({
        where: {
            maLopHoc: req.query.classID
        },
        include: [{
            model: HocSinh,
            where: {
                hocSinh_pkey: Sequelize.col('HOCSINH_LOPHOC.MA_HOC_SINH'),
                delete_flag: '0'
            }
        }]
    })
    .then((result) => {
        let objReturning = [];
        const len = result.length;
        for(let i = 0; i < len; ++i) {
            objReturning[objReturning.length] = {
                studentID: result[i]['AE_HOC_SINH'].hocSinh_pkey,
                studentCode: result[i]['AE_HOC_SINH'].maHocSinh,
                name: result[i]['AE_HOC_SINH'].hoTen,
                birthday: changeToDDMMYYYY(result[i]['AE_HOC_SINH'].ngaySinh),
                gender: result[i]['AE_HOC_SINH'].gioiTinh,
                address: result[i]['AE_HOC_SINH'].diaChi,
                email: result[i]['AE_HOC_SINH'].email,
                schoolYearID: result[i]['AE_HOC_SINH'].namNhapHoc,
                inClass: result[i]['AE_HOC_SINH'].inClass
            }
        }

        return res.status(200).json({
            success: true,
            message: "Get student(s) in class successfully",
            datas: objReturning
        });
        // } else {
        //     return res.status(200).json({
        //         success: false,
        //         message: "No student found"
        //     });
        // }
    })
    .catch((err) => {
        return res.status(500).json({
            success: false,
            message: "Failed to get student(s) in class"
        });
    });
}

export default { addStuInClass, delStuInClass, getStuInClass };