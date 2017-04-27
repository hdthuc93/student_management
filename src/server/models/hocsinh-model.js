import { sequelize, Sequelize } from './index';
import NamHoc from './namhoc-model';

const HocSinh = sequelize.define('AE_HOC_SINH', {
    hocSinh_pkey: {
        type: Sequelize.INTEGER,
        notNull: true,
        primaryKey: true,
        autoIncrement: true,
        field: 'HOC_SINH_PKEY'
    },
    maHocSinh: {
        type: Sequelize.STRING,
        notNull: true,
        unique: true,
        field: 'MA_HOC_SINH'
    },
    hoTen: {
        type: Sequelize.STRING,
        notNull: true,
        field: 'HO_TEN',
    },
    ngaySinh: {
        type: Sequelize.DATEONLY,
        notNull: true,
        field: 'NGAY_SINH'
    },
    gioiTinh: {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        notNull: true,
        field: 'GIOI_TINH'
    },
    diaChi: {
        type: Sequelize.STRING,
        notNull: true,
        field: 'DIA_CHI'
    },
    email: {
        type: Sequelize.STRING,
        field: 'EMAIL'
    },
    namNhapHoc: {
        type: Sequelize.INTEGER,
        field: 'NAM_NHAP_HOC'
    },
    delete_flag: {
        type: Sequelize.ENUM,
        values: ['0', '1'],
        defaultValue: '0',
        field: 'DELETE_FLAG'
    }
});

NamHoc.hasMany(HocSinh, { foreignKey: 'namNhapHoc', sourceKey: 'namHoc_pkey' });
HocSinh.belongsTo(NamHoc, { foreignKey: 'namNhapHoc', targetKey: 'namHoc_pkey' });

export default HocSinh;