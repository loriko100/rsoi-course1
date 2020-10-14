const users = require('./users');
const comments = require('./comments');
const questions = require('./questions');
const {winston} = require('../../../lib/winston');
const log = winston('log.log');
const logged = (lvl, message) => {log.log(lvl, `${message}, time: ${new Date()}`)} ;

const getQuestionAndComments = async (req, res) => {
    const {
        id
    } = req.params;

    logged("info",`get question by id: ${id}`);
    if (!id) {
        logged("error",`fail not id`);
        return res.status(404).json({error: 'id not exist'});
    }

    const allFetch = [
        comments.getCommentByParams({qid: id}),
        questions.getQuestionByParams({id})
    ];

    Promise
        .all(allFetch)
        .then((values) => {
            const data = {
                comments: values[0],
                question: values[1]
            };
            logged("success",`data getted`);
            return res.status(200).json(data);
        })
        .catch((err) => {
            logged("error",`fail ${err}`);
            return res.status(500).json({message: 'something error'})
        });
};

const createQuestion = async (req, res) => {
    const {
        id,
        title,
        tag,
        text
    } = req.body;

    if (!id) {
        logged("error",`fail: not authorized`);
        return res.status(403).json({message: 'you not authorized!'});
    }

    if (!title || !tag || !text) {
        logged("error",`fail: inputs shouldnt be empty!`);
        return res.status(500).json({message: 'inputs shouldnt be empty!'});
    }

    users.getUserById(id).then(() => {
            questions.createQuestion({
                uid: id,
                title,
                tag,
                text,
                date: new Date()
            })
            .then(() => {
                logged("success",`success: created question`);
                return res.status(201).json({});
            })
            .catch((err) => {
                logged("error",`fail: ${err}`);
                return res.status(500).json({});
            });
        })
        .catch(err => {
            logged("error",`fail: ${err}`);
            return res.status(500).json({});
        });
};

const deleteQuestion = async (req, res) => {
    const {
        id,
        qid
    } = req.body;

    if (!id) {
        logged("error",`fail: not authorized`);
        return res.status(403).json({message: 'you not authorized!'});
    }

    if (!qid) {
        logged("error",`fail: inputs shouldnt be empty!`);
        return res.status(500).json({message: 'inputs shouldnt be empty!'});
    }

    users.getUserById(id)
        .then(() => {
            questions.getQuestionByParams({id: qid})
                .then(async question => {
                    console.log(question[0].uid, id, String(question.uid) === String(id));
                    if (String(question[0].uid) === String(id)) {
                        const fetchDeleteQuestionsAndComments = [
                            questions.deleteQuestion(qid),
                            comments.deleteCommentsByQuestionId(qid)
                        ];

                        await Promise.all(fetchDeleteQuestionsAndComments)
                            .then(() => {
                                logged("success", `success: deleted question`);
                                return res.status(200).json({});
                            })
                            .catch(err => {
                                logged("error",`fail delete user ${err}`);
                                return res.status(500).json({message: 'something error'})
                            });
                    } else {
                        logged("error", `fail: access denied`);
                        return res.status(403).json({message: 'access denied'});
                    }
                })
                .catch(err => {
                    logged("error", `fail: ${err}`);
                    return res.status(500).json({message: 'something error'});
                })
        })
        .catch(err => {
            logged("error", `fail: ${err}`);
            return res.status(500).json({message: 'something error'});
        });
};

const createComment = async (req, res) => {
    const {
        id,
        text,
        qid
    } = req.body;

    if (!id) {
        logged("error",`fail: not authorized`);
        return res.status(403).json({message: 'you not authorized!'});
    }

    if (!qid || !text) {
        logged("error",`fail: inputs shouldnt be empty!`);
        return res.status(500).json({message: 'inputs shouldnt be empty!'});
    }

    users.getUserById(id).then(() => {
        comments.createComment({
            uid: id,
            qid,
            text,
            date: new Date()
        })
            .then(() => {
                logged("success",`success: created comments`);
                return res.status(201).json({});
            })
            .catch((err) => {
                logged("error",`fail: ${err}`);
                return res.status(500).json({});
            });
    })
        .catch(err => {
            logged("error",`fail: ${err}`);
            return res.status(500).json({});
        });
};

const deleteComment = async (req, res) => {
    const {
        id,
        cid
    } = req.body;

    if (!id) {
        logged("error",`fail: not authorized`);
        return res.status(403).json({message: 'you not authorized!'});
    }

    if (!cid) {
        logged("error",`fail: inputs shouldnt be empty!`);
        return res.status(500).json({message: 'inputs shouldnt be empty!'});
    }

    users.getUserById(id)
        .then(() => {
            comments.getCommentByParams({id: cid})
                .then(comment => {
                    if (String(comment[0].uid) === String(id)) {
                        comments.deleteComment(cid)
                            .then(() => {
                                logged("success", `success: deleted comment`);
                                return res.status(200).json({});
                            })
                            .catch((err) => {
                                logged("error", `fail: ${err}`);
                                return res.status(500).json({});
                            });
                    } else {
                        logged("error", `fail: access denied`);
                        return res.status(403).json({message: 'access denied'});
                    }
                })
                .catch(err => {
                    logged("error", `fail: ${err}`);
                    return res.status(500).json({message: 'something error'});
                })
    }).catch(err => {
        logged("error", `fail: ${err}`);
        return res.status(500).json({message: 'something error'});
    });
};

const deleteUser = async (req, res) => {
    const {
        id: deleteId // айди которое хотим удалить
    } = req.params;

    const {
        id // айди пользователя который пришел
    } = req.body;

    if (!id || !deleteId) {
        logged("error",`success: id shouldnt by empty`);
        return res.status(403).json({message: 'id shouldnt by empty'});
    }

    if (String(deleteId) !== String(id)) {
        logged("error",`success: created comments`);
        return res.status(403).json({message: 'not access'});
    }

    const allFetch = [
        users.deleteUser(id),
        questions.getQuestionByParams({uid: id}),
        comments.deleteCommentsByUserId(id)
    ];

    Promise
        .all(allFetch)
        .then(async (values) => {
            const respQuestions = values[1] || [];
            await respQuestions.forEach(async (question) => {
                const fetchDeleteQuestionsAndComments = [
                    questions.deleteQuestion(question.id),
                    comments.deleteCommentsByQuestionId(question.id)
                ];

                await Promise.all(fetchDeleteQuestionsAndComments)
                    .catch(err => {
                        logged("error",`fail delete user ${err}`);
                        return res.status(500).json({message: 'something error'})
                    })
            });

            logged("success",`user was deleted with id: ${id}`);
            return res.status(200).json({});
        })
        .catch(err => {
            logged("error",`fail delete user ${err}`);
            return res.status(500).json({message: 'something error'})
        });
};

const allUserComments = async (req, res) => {
    const {
        id
    } = req.params;

    if (!id) {
        logged("info",`fail: not authorized`);
        return res.status(403).json({message: 'you not authorized!'});
    }

    users.getUserById(id).then(() => {
        comments.getCommentByParams({
            uid: id
        })
            .then((data) => {
                logged("success",`success: all comments`);
                return res.status(200).json(data);
            })
            .catch((err) => {
                logged("error",`fail: ${err}`);
                return res.status(500).json({});
            });
    })
        .catch(err => {
            logged("error",`fail: ${err}`);
            return res.status(500).json({});
        });
};

const allUserQuestions = async (req, res) => {
    const {
        id
    } = req.params;

    if (!id) {
        logged("error",`fail: not authorized`);
        return res.status(403).json({message: 'you not authorized!'});
    }

    users.getUserById(id).then(() => {
        questions.getQuestionByParams({
            uid: id
        })
            .then((data) => {
                logged("success",`success: all questions`);
                return res.status(200).json(data);
            })
            .catch((err) => {
                logged("error",`fail: ${err}`);
                return res.status(500).json({});
            });
    })
        .catch(err => {
            logged("error",`fail: ${err}`);
            return res.status(500).json({});
        });
};

module.exports = {
    users,
    questions,
    comments,
    getQuestionAndComments,
    createQuestion,
    createComment,
    deleteUser,
    deleteComment,
    deleteQuestion,
    allUserComments,
    allUserQuestions
};

