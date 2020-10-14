const api = require('../libs/api');
const USER_DB = 'http://localhost:8001/users';
const {winston} = require('../../../lib/winston');
const log = winston('log.log');
const getUrl = (path) => `${USER_DB}${path}`;
const logged = (lvl, message) => {log.log(lvl, `${message}, time: ${new Date()}`)} ;

const login = async (req, res) => {
    const {
        name,
        password
    } = req.body;

    logged("info",`user login name: ${req.body.name}, password: ${req.body.password}`);
    if (!name || !password) {
        logged("error",`fail login`);
        return res.status(403).json({message: 'Login or password is empty!'});
    }

    await api.post(getUrl(`/get`), {
        name
    }).then(user => {
        logged("info",`user from userDB: ${user.id}`);
        if (user.password === password) {
            logged("success",`user login success: ${user.id}`);
            return res.status(200).json({
                uid: user.id,
                name
            });
        } else {
            logged("error",`user login fail: password incorrect`);
            return res.status(403).json({message: 'Incorrect login or password'});
        }
    }).catch(err => {
        logged("error",`user login fail: ${err}`);
        return res.status(403).json({message: 'Incorrect login or password'});
    });
};

const register = async (req, res) => {
    const {
        name,
        password,
        mail
    } = req.body;

    logged("info",`user register by name: ${req.body.name}`);
    if (!name || !password || !mail) {
        logged("error",`fail register`);
        return res.status(500).json({message: 'Name, password or mail is empty!'});
    }

    await api.post(getUrl('/create'), {
        name,
        password,
        mail
    })
    .then((user) => {
        logged("success",`user create with name: ${name}`);
        return res.status(201).json(user);
    })
    .catch(err => {
        logged("error",`user register fail: ${err}`);
        return res.status(500).json({message: 'Login exist'})
    });
};

const allUsers = async (req, res) => {
    await api.get(getUrl('/all'))
        .then(data => {
            logged("success", `success all users`);
            return res.status(200).json(data)
        })
        .catch(err => {
            logged("error",`fail ${err}`);
            return res.status(500).json({message: err.message});
        });
};

const allUsersFromTo = async (req, res) => {
    let {
        from,
        to
    } = req.params;
    await api.get(getUrl(`/all/from/${from}/to/${to}`))
        .then((data) => {
            logged("success", `success all users`);
            return res.status(200).json(data)
        })
        .catch(err => {
            logged("error", `fail ${err}`);
            return res.status(500).json({message: 'some error'})
        });
};

const getUserById = async (id) => {
    return await api.post(getUrl(`/get`), {id})
};

const deleteUser = async (id) => {
    return await api.post(getUrl(`/delete/${id}`), {})
};

module.exports = {
    login,
    register,
    allUsers,
    allUsersFromTo,
    getUserById,
    deleteUser
};
