const { validationResult } = require('express-validator');

exports.runValidation = (req, res, next) => {  // next is callback function
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ // 422 = unprocessable entity , couldnt go further because of error
            error: errors.array()[0].msg
        });
    }
    next(); // calling otherwise the function will continue and not stop
};
