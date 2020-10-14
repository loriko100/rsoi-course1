const db = require('../../db/models/index.js');
const {winston} = require('../../../lib/winston');
const log = winston('log.log');
const logged = (lvl, message) => {log.log(lvl, `${message}, time: ${new Date()}`)} ;

const createUser = async (req, res) => {
    try {
        const dataExist = await db.User.findOne({
            where: {
                ...req.body.name
            }
        });

        if (dataExist) {
            logged("error", `fail user exist`);
            return res.status(500).json({})
        }

        logged("info",`create user: ${req.body.name}`);
        const data = await db.User.create({
            name: req.body.name,
            password: req.body.password,
            mail: req.body.mail
        });
        logged("success",`success user was created: ${req.body.name}`);
        return res.status(201).json({});
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const deleteUser = async (req, res) => {
    try {
        logged("info",`delete user by id: ${req.params.id}`);
        await db.User.destroy({
            where: {
                id: req.params.id
            }
        });
        logged("success",`success user was deleted ${req.params.id}`);
        return res.status(200).json({});
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const getUserByParam = async (req, res) => {
    try {
        logged("info",`getting user: ${req.body.id}`);

        const data = await db.User.findOne({
            where: {
                ...req.body
            }
        });

        if (data) {
            logged("success", `ok ${req.body.id}`);
            return res.status(200).json(data);
        } else {
            logged("error", `fail user exist`);
            return res.status(500).json({});
        }

    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const allUsers = async (req, res) => {
    try {
        const data = await db.User.findAll();
        logged("success",`getAllUsers`);
        return res.status(200).json(data);
    } catch (err) {
        logged("error", `fail ${err}`);
        return res.status(500).json({})
    }
};

const getUsersSlice = async (req, res) => {
    try {
        const data = await db.User.findAll();
        let {
            from,
            to
        } = req.params;

        if (from < 0) {
            from = 0;
        }
        if (to > data.length) {
            to = data.length;
        }
        logged("success",`getAllUsers`);
        return res.status(200).json(data.slice(from, to));
    } catch (error) {
        logged("error", `fail ${error}`);
        return res.status(500).json({})
    }
};

module.exports = {
    createUser,
    deleteUser,
    getUserByParam,
    allUsers,
    getUsersSlice
};
