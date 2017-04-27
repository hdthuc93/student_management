import { sequelize, Sequelize } from './index';
import Khoi from './khoi-model';
import NamHoc from './namhoc-model';


const LopHoc = sequelize.define('M_LOP_HOC', {
    maLop_pkey: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        field: 'MA_LOP_PKEY'
    },
    maLopHoc: {
        type: Sequelize.STRING,
        notNull: true,
        unique: true,
        field: 'MA_LOP_HOC'
    },
    tenLop: {
        type: Sequelize.STRING,
        notNull: true,
        field: 'TEN_LOP'
    },
    maKhoi: {
        type: Sequelize.INTEGER,
        field: 'MA_KHOI'
    },
    maNamHoc: {
        type: Sequelize.INTEGER,
        field: 'MA_NAM_HOC'
    }
});

Khoi.hasMany(Lophoc, { foreignKey: 'maKhoi', sourceKey: 'maKhoi' });
NamHoc.hasMany(LopHoc, { foreignKey: 'maNamHoc', sourceKey: 'maNamHoc' });

export default LopHoc;