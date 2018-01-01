// Route handlers

const _ = require('lodash');
const Status = require('http-status-codes');

const db = require('./db');
const helpers = require('./helpers');

// Users

function createUser(req, res, next) {
    let name = req.body.name;
    if (!name) {
        return res.sendStatus(Status.BAD_REQUEST);
    }
    db.createUser(name, (err, row) => {
        if (err) {
            return res.status(Status.INTERNAL_SERVER_ERROR).send(err);
        }
        res.status(Status.CREATED).send(row);
        console.log(`Created user "${name}" with ID ${row.id}`);
        next();
    });
}

function retrieveUser(req, res, next) {
    let userId = parseInt(req.params.id);
    if (!userId) {
        return res.sendStatus(Status.BAD_REQUEST);
    }
    db.retrieveUser(userId, (err, rows) => {
        if (err) {
            return res.status(Status.INTERNAL_SERVER_ERROR).send(err);
        }
        if (rows.length == 0) {
            return res.sendStatus(Status.NOT_FOUND);
        }
        res.send({
            id: userId,
            name: rows[0].name,
            likes: _.compact(rows.map((row) => row.liked_project)),
        });
        next();
    });
}

function deleteUser(req, res, next) {
    let userId = parseInt(req.params.id);
    if (!userId) {
        return res.sendStatus(Status.BAD_REQUEST);
    }
    db.deleteUser(userId, (err) => {
        if (err) {
            return res.status(Status.INTERNAL_SERVER_ERROR).send(err);
        }
        res.sendStatus(Status.OK);
        console.log(`Deleted user with ID ${userId}`);
        next();
    });
}

// Projects

function createProject(req, res, next) {
    let name = req.body.name;
    let date = helpers.parseDate(req.body.date);
    if (!name || !date) {
        return res.sendStatus(Status.BAD_REQUEST);
    }
    db.createProject(name, date.year, date.month, date.day, (err, row) => {
        if (err) {
            return res.status(Status.INTERNAL_SERVER_ERROR).send(err);
        }
        res.status(Status.CREATED).send(row);
        console.log(`Created project "${name}" with ID ${row.id}`);
        next();
    });
}

function retrieveProject(req, res, next) {
    let projectId = parseInt(req.params.id);
    if (!projectId) {
        return res.sendStatus(Status.BAD_REQUEST);
    }
    db.retrieveProject(projectId, (err, rows) => {
        if (err) {
            return res.status(Status.INTERNAL_SERVER_ERROR).send(err);
        }
        if (rows.length == 0) {
            return res.sendStatus(Status.NOT_FOUND);
        }
        res.send({
            id: projectId,
            name: rows[0].name,
            date: helpers.formatDate(rows[0].year, rows[0].month, rows[0].day),
            likedBy: _.compact(rows.map((row) => row.liked_by)),
        });
        next();
    });
}

function deleteProject(req, res, next) {
    let projectId = parseInt(req.params.id);
    if (!projectId) {
        return res.sendStatus(Status.BAD_REQUEST);
    }
    db.deleteProject(projectId, (err) => {
        if (err) {
            return res.status(Status.INTERNAL_SERVER_ERROR).send(err);
        }
        res.sendStatus(Status.OK);
        console.log(`Deleted project with ID ${projectId}`);
        next();
    });
}

// Likes

function handleLikeRequest(dataAccessFunction, req, res, next) {
    let userId = parseInt(req.body.userId);
    let projectId = parseInt(req.body.projectId);
    if (!userId || !projectId) {
        return res.sendStatus(Status.BAD_REQUEST);
    }
    dataAccessFunction(userId, projectId, (err) => {
        // It should return Bad Request or Not Found if the project or the user
        // doesn't exist, but for the sake of simplicity it returns Server Error
        if (err) {
            return res.status(Status.INTERNAL_SERVER_ERROR).send(err);
        }
        res.sendStatus(Status.OK);
        next();
    });
}

function addLike(req, res, next) {
    handleLikeRequest(db.addLike, req, res, next);
}

function removeLike(req, res, next) {
    handleLikeRequest(db.removeLike, req, res, next);
}

module.exports = {
    addLike,
    createProject,
    createUser,
    deleteProject,
    deleteUser,
    removeLike,
    retrieveProject,
    retrieveUser,
};
