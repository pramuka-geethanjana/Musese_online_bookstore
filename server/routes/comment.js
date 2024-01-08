const { User } = require('../models/User');
const { Book } = require('../models/Book');
const { Comment } = require('../models/Comment');

const express = require('express');
const router = express.Router();

const { isAuth, isInRole } = require('../helpers/auth');

SECRET = process.env.SECRET;

const PAGE_LIMIT = 5

router.get(`/getLatestFiveByUser/:userId`, isAuth, async (req, res) => {
    let userId = req.params.userId;

    Comment
        .find({ user: userId })
        .populate('book')
        .sort({ creationDate: -1 })
        .limit(5)
        .then((comments) => {
            res.status(200).json({
                message: '',
                data: comments
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json({
                message: 'Something went wrong, please try again.'
            });
        });
});

router.get(`/:bookId/:skipCount`, async (req, res) => {
    let bookId = req.params.bookId;
    let skipCount = !isNaN(Number(req.params.skipCount))
        ? Number(req.params.skipCount)
        : 0;

    Comment.find({ book: bookId })
        .populate({ path: 'user', select: 'username avatar' })
        .sort({ creationDate: -1 })
        .skip(skipCount)
        .limit(PAGE_LIMIT)
        .then((comments) => {
            res.status(200).json({
                message: '',
                data: comments
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json({
                message: 'Something went wrong, please try again.'
            });
        });
});

router.post(`/add/:bookId`, isAuth, async (req, res) => {
    let bookId = req.params.bookId;
    let userId = req.user.id;
    let comment = req.body.comment;


    User.findById(userId).then((user) => {
        if (!user || user.isCommentsBlocked) {
            return res.status(401).json({
                message: 'Sorry, you\'re not allowed to comment on books'
            });
        }

        Book.findById(bookId).then((book) => {
            if (!book) {
                return res.status(400).json({
                    message: 'There is no book with the given id in our database.'
                });
            }

            Comment.create({ comment: comment }).then((newComment) => {
                book.comments.push(newComment._id);
                newComment.book = book._id;
                newComment.user = userId;
                user.commentsCount += 1;

                user.save();
                book.save();
                newComment.save().then(() => {
                    Comment
                        .findById(newComment._id)
                        .populate({ path: 'user', select: 'username avatar' })
                        .then((comment) => {
                            return res.status(200).json({
                                message: 'Comment posted successfully!',
                                data: comment
                            });
                        });
                });
            }).catch((err) => {
                console.log(err);
                return res.status(400).json({
                    message: 'Something went wrong, please try again.'
                });
            });
        });
    });
});


router.put(`/edit/:commentId`, isAuth, async (req, res) => {
    let commentId = req.params.commentId;
    let userId = req.user.id;
    let editedComment = req.body.comment;

    //let validationResult = validateCommentForm(req.body);
    /*
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Comment form validation failed!',
                errors: validationResult.errors
            });
        }
    */
    User.findById(userId).then((user) => {
        if (!user || user.isCommentsBlocked) {
            return res.status(401).json({
                message: 'Sorry, but you\'re not allowed to comment on books'
            });
        }

        Comment.findById(commentId)
            .populate({ path: 'user', select: 'username avatar' })
            .then((comment) => {
                if (!comment) {
                    return res.status(400).json({
                        message: 'There is no comment with the given id in our database.'
                    });
                }

                if (comment.user._id.toString() !== userId && !req.user.isAdmin) {
                    return res.status(401).json({
                        message: 'You\'re not allowed to edit other user comments!'
                    });
                }

                comment.content = editedComment;
                comment.save();

                return res.status(200).json({
                    message: 'Comment edited successfully!',
                    data: comment
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(400).json({
                    message: 'Something went wrong, please try again.'
                });
            });
    });
});


router.delete(`/delete/:commentId`, isAuth, async (req, res) => {
    let commentId = req.params.commentId;
    let userId = req.user.id;

    Comment.findById(commentId).then((comment) => {
        if (!comment) {
            return res.status(400).json({
                message: 'There is no comment with the given id in our database.'
            });
        }

        if (comment.user.toString() !== userId && !req.user.isAdmin) {
            return res.status(401).json({
                message: 'You\'re not allowed to delete other user comments!'
            });
        }

        Comment.findByIdAndRemove(comment._id).then(() => {
            Book.updateOne({ _id: comment.book }, { $pull: { comments: comment._id } }).then(() => {
                User.findById(req.user.id).then((user) => {
                    user.commentsCount -= 1;
                    user.save();
                    return res.status(200).json({
                        message: 'Comment deleted successfully!'
                    });
                });
            });
        });
    }).catch((err) => {
        console.log(err);
        return res.status(400).json({
            message: 'Something went wrong, please try again.'
        });
    });
});


module.exports = router;