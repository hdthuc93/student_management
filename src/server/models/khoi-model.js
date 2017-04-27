import { sequelize, Sequelize } from './index';


const Khoi = sequelize.define('M_KHOI', {
    maKhoi_pkey: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true,
        field: ''
    },
    maKhoi: {
        type: Sequelize.STRING,
        notNull: true,
        unique: true
    },
    tenKhoi: {
        type: Sequelize.STRING,
        notNull: true
    }
});

export default Khoi;