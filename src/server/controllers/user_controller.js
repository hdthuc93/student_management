import User from '../models/user_model';

function register(req, res) {
    User.create({
        username: req.body.username,
        password: req.body.password
    }).then((user) => {
        res.json({
            success: true,
            message: "Successfully create user"
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: "Failed create user"
        })
    });
}

export default { register };
