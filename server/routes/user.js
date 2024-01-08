const { User } = require('../models/User');
const { Receipt } = require('../models/Receipt');
const { Role } = require('../models/Role');
const { Cart } = require('../models/Cart');
const multer = require('multer');
const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const VALIDATOR = require('validator');

const { isAuth, isInRole } = require('../helpers/auth');

SECRET = process.env.SECRET;

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');//.replace(' ','-')
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});
const fileSizeLimit = 5 * 1024 * 1024;

const uploadOptions = multer({
    storage: storage
    , limits: { fileSize: fileSizeLimit },
});


const upload = multer({ dest: 'uploads/' });

function generateToken(userInfo) {
    const User = {
        id: userInfo.id,
        username: userInfo.username,
        avatar: userInfo.avatar,
        isCommentsBlocked: userInfo.isCommentsBlocked,
        isAdmin: userInfo.isAdmin,
        roles: userInfo.roles
    };
    const PAYLOAD = { sub: User };

    return jwt.sign(PAYLOAD, SECRET, { expiresIn: '1d' });

}

router.post('/uploadProfileImage', uploadOptions.single('image'), (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: 'No image selected for upload.' });
    }

    const file = req.file;
    console.log(file)

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    console.log(fileName)
    console.log(basePath)

    const data = {
        imageURL: `${basePath}${fileName}`
    }

    res.status(200).send({
        message: 'User Profile Image Uploaded successfully',
        data: data

    });

});

//http://localhost:8000/api/v1/user/uploadProfileImage/64bab9d3a02778267bd8e2e1
router.put('/uploadProfileImage/:userId', uploadOptions.single('image'), (req, res) => {
    let userId = req.params.userId;

    const userToChange = req.params.userId;

    console.log('uploadProfileImage req ', req)

    const file = req.file;
    console.log('req file', file)
    console.log('re userid', userId)

    if (!file) {
        return res.status(400).json({ message: 'User Profile Image changed successfully!' });
    }


    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    console.log(fileName)
    console.log(basePath)

    const data = {
        imageURL: `${basePath}${fileName}`
    }


    const newAvatar = basePath + fileName;

    User.findByIdAndUpdate({ _id: userToChange }, { $set: { avatar: newAvatar } }, { new: true })
        .then(() => {
            return res.status(200).send({
                message: 'User Profile Image changed successfully!',
                data: newAvatar
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({
                message: 'Something went wrong, please try again.'
            });
        });

});



router.post(`/register`, async (req, res) => {

    let validationResult = validateRegisterForm(req.body);


    if (!validationResult.success) {
        return res.status(400).send({
            message: 'Register form validation failed!',
            errors: validationResult.errors
        });
    }

    const userExistsUserName = await User.findOne({ username: req.body.username })
    const userExistsEmail = await User.findOne({ email: req.body.email })

    if (userExistsUserName) {
        return res.status(400).send({
            message: 'UserName is already taken',
        });
    } else if (userExistsEmail) {
        return res.status(400).send({
            message: 'Email is already taken',
        });
    }
    else {

        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            username: req.body.username,
            avatar: req.body.avatar,
        })

        Role.findOne({ name: 'User' }).then((role) => {
            user.roles = [role._id];

            User.create(user).then((newUser) => {
                role.users.push(newUser._id);
                console.log('role', role)
                role.save();

                let token = generateToken(newUser);

                Cart.create({ user: newUser._id }).then((cart) => {
                    newUser.cart = cart._id;
                    newUser.save();

                    let data = {
                        user: newUser,
                        token: token
                    }
                    res.status(200).send({
                        message: 'User Created Successfully',
                        data: data

                    });
                });
            }).catch((err) => {

                res.status(400).send({
                    message: 'User Creation Failed',
                    data: err,
                });
            });
        });



    }


});

router.post(`/login`, async (req, res) => {
    let validationResult = validateLoginForm(req.body);

    if (!validationResult.success) {
        return res.status(400).send({
            message: 'Login form validation failed!',
            errors: validationResult.errors
        });
    }
    const user = await User.findOne({ username: req.body.username })

    const secret = process.env.SECRET;
    if (!user) {
        return res.status(400).send({
            message: 'The user not found!',
            errors: validationResult.errors
        });

    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        let token = generateToken(user);

        const userRes = await User.findOne({ username: req.body.username }).select('-passwordHash');
        let data = {
            user: userRes,
            token: token
        }
        return res.status(200).send({
            message: 'Login Successfull',
            data: data
        });
    } else {
        return res.status(400).send({
            message: 'password is wrong!',
            data: null,
        });
    }

});

router.get(`/profile/:username`, isAuth, async (req, res) => {


    let username = req.params.username;

    User.findOne({ username: username })
        .populate('favoriteBooks')
        .then((user) => {
            if (!user) {
                return res.status(400).send({
                    message: `User ${username} not found in our database`
                });
            }

            let userToSend = {
                id: user.id,
                isAdmin: user.isAdmin,
                username: user.username,
                avatar: user.avatar,
                commentsCount: user.commentsCount,
                favoriteBooks: user.favoriteBooks,
            };

            return res.status(200).send({
                message: '',
                data: userToSend
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).send({
                message: 'Something went wrong, please try again.'
            });
        });


});

router.get(`/purchaseHistory`, isAuth, async (req, res) => {

    let userId = req.user.id;
    Receipt.find({ user: userId })
        .sort({ creationDate: -1 })
        .then((receipts) => {
            return res.status(200).send({
                message: '',
                data: receipts
            });
        });
});

router.post(`/changeAvatar`, isAuth, async (req, res) => {
    let requesterId = req.user.id;
    let requesterIsAdmin = req.user.isAdmin;
    let userToChange = req.body.id;
    let newAvatar = req.body.avatar;

    let validationResult = validateAvatarForm(req.body);

    if (!validationResult.success) {
        return res.status(400).send({
            message: 'Avatar form validation failed!',
            errors: validationResult.errors
        });
    }

    if (requesterId !== userToChange && !requesterIsAdmin) {
        return res.status(401).send({
            message: 'You\'re not allowed to change other user avatar!'
        });
    }

    User.update({ _id: userToChange }, { $set: { avatar: newAvatar } })
        .then(() => {
            return res.status(200).send({
                message: 'Avatar changed successfully!'
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({
                message: 'Something went wrong, please try again.'
            });
        });
});

router.post(`/blockComments/:userId`, isInRole('Admin'), async (req, res) => {
    let userId = req.params.userId;

    User.findById(userId).then((user) => {
        if (!user) {
            return res.status(400).send({
                message: `User ${user.username} not found in our database`
            });
        }

        user.isCommentsBlocked = true;
        user.save();

        return res.status(200).send({
            message: `User ${user.username} blocked from posting comments!`
        });
    }).catch((err) => {
        console.log(err);
        return res.status(400).send({
            message: 'Something went wrong, please try again.'
        });
    });
});

router.post(`/unlockComments/:userId`, isInRole('Admin'), async (req, res) => {
    let userId = req.params.userId;

    User.findById(userId).then((user) => {
        if (!user) {
            return res.status(400).send({
                message: `User ${user.username} not found in our database`
            });
        }

        user.isCommentsBlocked = false;
        user.save();

        return res.status(200).send({
            message: `User ${user.username} can now post comments!`
        });
    }).catch((err) => {
        console.log(err);
        return res.status(400).send({
            message: 'Something went wrong, please try again.'
        });
    });
});


function validateRegisterForm(payload) {
    let errors = {};
    let isFormValid = true;

    if (!payload || typeof payload.email !== 'string' || !VALIDATOR.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Please provide a correct email address.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 3) {
        isFormValid = false;
        errors.password = 'Password must have at least 3 characters.';
    }

    if (!payload || payload.password !== payload.confirmPassword) {
        isFormValid = false;
        errors.passwordsDontMatch = 'Passwords do not match!';
    }

    if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Please provide your name.';
    }

    return {
        success: isFormValid,
        errors
    };
}

function validateLoginForm(payload) {
    let errors = {};
    let isFormValid = true;

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
        isFormValid = false;
        errors.password = 'Please provide your password.';
    }

    if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Please provide your name.';
    }

    return {
        success: isFormValid,
        errors
    };
}




module.exports = router;