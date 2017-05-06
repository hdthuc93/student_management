import { sequelize, Sequelize } from './index';
import HocSinh from './hocsinh-model';
import LopHoc from './lophoc-model';
import NamHoc from './namhoc-model';


const HocSinh_LopHoc = sequelize.define('HOCSINH_LOPHOC', {
    maHocSinh: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        field: 'MA_HOC_SINH'
    },
    maLopHoc: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'MA_LOP_HOC'
    },
    maNamHoc: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        field: 'MA_NAM_HOC',
    },
});

HocSinh.hasMany(HocSinh_LopHoc, { foreignKey: 'maHocSinh', sourceKey: 'hocSinh_pkey' });
HocSinh_LopHoc.belongsTo(HocSinh, { foreignKey: 'maHocSinh', targetKey: 'hocSinh_pkey' });

LopHoc.hasMany(HocSinh_LopHoc, { foreignKey: 'maLopHoc', sourceKey: 'maLop_pkey' });
HocSinh_LopHoc.belongsTo(LopHoc, { foreignKey: 'maLopHoc', targetKey: 'maLop_pkey' });

NamHoc.hasMany(HocSinh_LopHoc, { foreignKey: 'maNamHoc', sourceKey: 'namHoc_pkey' });
HocSinh_LopHoc.belongsTo(NamHoc, { foreignKey: 'maNamHoc', targetKey: 'namHoc_pkey' });

export default HocSinh_LopHoc;