import bcrypt from 'bcrypt';
import { sequelize, Sequelize } from './index';

const User = sequelize.define('M_USER', {
    username: {
        type: Sequelize.STRING,
        field: 'USER_NAME'
    },
    password: {
        type: Sequelize.STRING,
        field: 'PASSWORD'
    }
});

User.beforeCreate((user, options, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) 
                return callback(err, options);

            user.password = hash;
            callback(null, options);
        })
    })
});

export default User;
