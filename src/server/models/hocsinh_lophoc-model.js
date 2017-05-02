import { sequelize, Sequelize } from './index';
import HocSinh from './hocsinh-model';
import LopHoc from './lophoc-model';


const HocSinh_LopHoc = sequelize.define('HOCSINH_LOPHOC', {
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
    ngayThamGia: {
        type: Sequelize.DATE,
        primaryKey: true,
        notNull: true,
        field: 'NGAY_THAM_GIA',
    },
});

HocSinh.hasMany(HocSinh_LopHoc, { foreignKey: 'maHocSinh', sourceKey: 'hocSinh_pkey' });
HocSinh_LopHoc.belongsTo(HocSinh, { foreignKey: 'maHocSinh', targetKey: 'hocSinh_pkey' });

LopHoc.hasMany(HocSinh_LopHoc, { foreignKey: 'maLopHoc', sourceKey: 'maLop_pkey' });
HocSinh_LopHoc.belongsTo(LopHoc, { foreignKey: 'maLopHoc', targetKey: 'maLop_pkey' });

export default HocSinh_LopHoc;