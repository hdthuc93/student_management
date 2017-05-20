import { sequelize, Sequelize } from './index';
import NamHoc from './namhoc-model';

const QuyDinh = sequelize.define('M_QUY_DINH', {
    quyDinh_pkey: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        notNull: true,
        autoIncrement: true,
        field: 'QUY_DINH_PKEY'
    },
    maQuyDinh: {
        type: Sequelize.STRING,
        notNull: true,
        unique: true,
        field: 'MA_QUY_DINH'
    },
    tuoiMin: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'TUOI_MIN'
    },
    tuoiMax: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'TUOI_MAX'
    },
    slHocSinh_10: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'SL_HOC_SINH_10'
    },
    slHocSinh_11: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'SL_HOC_SINH_11'
    },
    slHocSinh_12: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'SL_HOC_SINH_12'
    },
    diemChuan: {
        type: Sequelize.DECIMAL(4, 2),
        notNull: true,
        field: 'DIEM_CHUAN'
    },
    maNamHoc: {
        type: Sequelize.INTEGER,
        notNull: true,
        field: 'MA_NAM_HOC'
    }
});

QuyDinh.belongsTo(NamHoc, { foreignKey: 'maNamHoc', targetKey: 'namHoc_pkey' });

export default QuyDinh;