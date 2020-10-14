const db = require('../../db/models/index.js');
const {winston} = require('../../../lib/winston');
const log = winston('log.log');
const logged = (lvl, message) => {log.log(lvl, `${message}, time: ${new Date()}`)} ;

const createQuestion = async (req, res) => {
    try {
        logged("info",`create question for uid: ${req.body.qid}`);
        const data = await db.Question.create({
            uid: req.body.uid,
            title: req.body.title,
            text: req.body.text,
            tag: req.body.tag,
            date: req.body.date
        });
        logged("success",`success question was created for uid ${req.body.uid}`);
        return res.status(201).json({});
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const deleteQuestion = async (req, res) => {
    try {
        logged("info",`delete question by id: ${req.params.id}`);
        await db.Question.destroy({
            where: {
                id: req.params.id
            }
        });
        logged("succes",`success question was deleted by id ${req.params.id}`);
        return res.status(200).json({});
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const allQuestion = async (req, res) => {
    try {
        const data = await db.Question.findAll();
        logged("success",`getAllQuestions`);
        return res.status(200).json(data);
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const getQuestionByParam = async (req, res) => {
    try {
        const data = await db.Question.findAll({
            where: {
               ...req.body
            }
        });
        logged("success",`getQuestionByParam ${req.body.id}`);
        return res.status(200).json(data);
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const deleteQuestionByUser = async (req, res) => {
    try {
        logged("info",`delete question by uid: ${req.params.id}`);
        await db.Question.destroy({
            where: {
                uid: req.params.id
            }
        });
        logged("success",`success question was deleted ${req.params.id}`);
        return res.status(200).json({});
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

module.exports = {
    createQuestion,
    deleteQuestion,
    allQuestion,
    getQuestionByParam,
    deleteQuestionByUser
};
