function authChecker(req, res, next) {
    firstNameChecker(req);
    lastNameChecker(req);
    userNameChecker(req);
    emailChecker(req);
    passwordChecker(req)

    let errors = req.validationErrors();

    if(errors) {
        res.render('register', {error_msg: true, errors: errors})
    } else {

    next()
    }
}

function firstNameChecker(firstName) {
    firstName.check('firstName').notEmpty().withMessage('Please enter your first name.').blacklist(/<>\//)
}
function lastNameChecker(lastName) {
    lastName.check('lastName').notEmpty().withMessage('Please enter your last name.').blacklist(/<>\//)
}
function userNameChecker(username) {
    username.check('username').notEmpty().withMessage('Please enter an username.').isLength({min: 3,
    max: 15}).withMessage('Username must be between 3 and 15 characters.').blacklist(/<>\//)
}

function emailChecker(email) {
    email.check('email').isEmail().withMessage('Please enter a valid email.')
}

function passwordChecker(password){
    password.check('password').notEmpty().withMessage('Password cannot be empty.');

    password.checkBody('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d`~!@#$%^&*()_+]{5,10}$/).withMessage('Password should be a minimum of 5 characters and a maximum of 10 characters, at least one uppercase letter, one lowercase letter, and one number and one special character.')

    password.checkBody('password2').notEmpty().withMessage('Confirm password cannot be empty.').equals(password.body.password).withMessage('Passwords must match.');
}

module.exports = authChecker