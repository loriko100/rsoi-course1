const api = require('../libs/api');
const QUESTION_DB = 'http://localhost:8002/questions';
const {winston} = require('../../../lib/winston');
const log = winston('log.log');
const getUrl = (path) => `${QUESTION_DB}${path}`;
const logged = (lvl, message) => {log.log(lvl, `${message}, time: ${new Date()}`)} ;

const createQuestion = async (body) => {
    return await api.post(getUrl('/create'), body)
};

const deleteQuestion = async (id) => {
    return await api.post(getUrl(`/delete/${id}`), {})
};

const deleteQuestionByUser = async (id) => {
    return await api.post(getUrl(`/delete/user/${id}`), {})
};

const allQuestions = async (req, res) => {
    await api.get(getUrl('/all'))
        .then(data => {
            logged("success", `success all questions`);
            res.status(200).json(data)
        })
        .catch(err => {
            logged("error",`fail ${err}`);
            return res.status(500).json({message: err.message});
        });
};

const getQuestionByParams = async (body) => {
    return await api.post(getUrl('/get'), body);
};

module.exports = {
    allQuestions,
    createQuestion,
    deleteQuestion,
    getQuestionByParams,
    deleteQuestionByUser
};

