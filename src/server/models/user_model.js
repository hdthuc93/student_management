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
                callback(err, options);

            user.password = hash;
            callback(null, options);
        })
    })
});

// User.sync();

export default User;
