import { sequelize, Sequelize } from './index';
import HocSinh from './hocsinh-model';
import LopHoc from './lophoc-model';
import MonHoc from './monhoc-model';
import HocKy from './hocky-model';

const DiemMH = sequelize.define('AE_DIEM_MON_HOC', {
    maHocSinh: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        field: 'MA_HOC_SINH'
    },
    maLopHoc: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        field: 'MA_LOP_HOC'
    },
    maMonHoc: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        field: 'MA_MON_HOC'
    },
    maHocKy: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        field: 'MA_HOC_KI'
    },
    diem_15phut: {
        type: Sequelize.DECIMAL(4, 2),
        notNull: true,
        field: 'DIEM_15_PHUT'
    },
    diem_1tiet: {
        type: Sequelize.DECIMAL(4, 2),
        notNull: true,
        field: 'DIEM_1_TIET'
    },
    diemCuoiKy: {
        type: Sequelize.DECIMAL(4, 2),
        notNull: true,
        field: 'DIEM_CUOI_KI'
    }
});

HocSinh.hasMany(DiemMH, { foreignKey: 'maHocSinh', sourceKey: 'hocSinh_pkey' });
DiemMH.belongsTo(HocSinh, { foreignKey: 'maHocSinh', targetKey: 'hocSinh_pkey' });

LopHoc.hasMany(DiemMH, { foreignKey: 'maLopHoc', sourceKey: 'maLop_pkey' });
DiemMH.belongsTo(LopHoc, { foreignKey: 'maLopHoc', targetKey: 'maLop_pkey' });

MonHoc.hasMany(DiemMH, { foreignKey: 'maMonHoc', sourceKey: 'monHoc_pkey' });
DiemMH.belongsTo(MonHoc, { foreignKey: 'maMonHoc', targetKey: 'monHoc_pkey' });

HocKy.hasMany(DiemMH, { foreignKey: 'maHocKy', sourceKey: 'hocKy_pkey' });
DiemMH.belongsTo(HocKy, { foreignKey: 'maHocKy', targetKey: 'hocKy_pkey' });

export default DiemMH;