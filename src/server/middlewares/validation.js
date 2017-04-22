
function register(req, res, next) {
    if(req.body.password !== req.body.confirmPassword) {
        return res.status(200).json({
                success: false,
                message: "Password and confirm password do not match"
            });
    }

    next();
}

export default { register };