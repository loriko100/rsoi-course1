const db = require('../../db/models/index.js');
const {winston} = require('../../../lib/winston');
const log = winston('log.log');
const logged = (lvl, message) => {log.log(lvl, `${message}, time: ${new Date()}`)} ;

const createComment = async (req, res) => {
    try {
        logged("info",`create comment for qid: ${req.body.qid}`);
        const data = await db.Comment.create({
            qid: req.body.qid,
            uid: req.body.uid,
            text: req.body.text,
            date: req.body.date
        });
        logged("success",`success comment was created with text ${text}`);
        return res.status(201).json({});
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const deleteComment = async (req, res) => {
    try {
        logged("info",`delete comment by id: ${req.params.id}`);
        await db.Comment.destroy({
            where: {
                id: req.params.id
            }
        });
        logged("success",`success comment was deleted with id ${req.params.id}`);
        return res.status(200).json({});
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const deleteCommentByQuestionsId = async (req, res) => {
    try {
        logged("info",`delete comment by qid: ${req.params.id}`);
        await db.Comment.destroy({
            where: {
                qid: req.params.id
            }
        });
        logged("success",`success comment was deleted with qid ${req.params.id}`);
        return res.status(200).json({});
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const deleteCommentByUserId = async (req, res) => {
    try {
        logged("info",`delete comment by uid: ${req.params.id}`);
        await db.Comment.destroy({
            where: {
                uid: req.params.id
            }
        });
        logged("success",`success comment was deleted`);
        return res.status(200).json({});
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const getCommentByParam = async (req, res) => {
    try {
        const data = await db.Comment.findAll({
            where: {
                ...req.body
            }
        });
        logged("success",`getCommentByParam`);
        return res.status(200).json(data);
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

module.exports = {
    createComment,
    deleteComment,
    deleteCommentByQuestionsId,
    deleteCommentByUserId,
    getCommentByParam
};
