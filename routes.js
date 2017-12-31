// Route handlers

const _ = require('lodash');

const db = require('./db');
const helpers = require('./helpers');

// Users

function createUser(req, res, next) {
    let name = req.body.name;
    if (!name) {
        return res.status(400).send('Missing user name');
    }
    db.createUser(name, (err, row) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(row);
        console.log(`Created user "${name}" with ID ${row.id}`);
        next();
    });
}

function retrieveUser(req, res, next) {
    let userId = parseInt(req.params.id);
    if (!userId) {
        return res.status(400).send('Invalid user ID');
    }
    db.retrieveUser(userId, (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (rows.length == 0) {
            return res.sendStatus(404);
        }
        res.send({
            id: userId,
            name: rows[0].name,
            likes: _.compact(rows.map((row) => row.project_id)),
        });
        next();
    });
}

function deleteUser(req, res, next) {
    let userId = parseInt(req.params.id);
    if (!userId) {
        return res.status(400).send('Invalid user ID');
    }
    db.deleteUser(userId, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.sendStatus(200);
        console.log(`Deleted user with ID ${userId}`);
        next();
    });
}

// Projects

function createProject(req, res, next) {
    let name = req.body.name;
    let date = helpers.parseDate(req.body.date);
    if (!name) {
        return res.status(400).send('Missing project name');
    }
    if (!date) {
        return res.status(400).send('Missing or invalid date');
    }
    db.createProject(name, date.year, date.month, date.day, (err, row) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send(row);
        console.log(`Created project "${name}" with ID ${row.id}`);
        next();
    });
}

function retrieveProject(req, res, next) {
    let projectId = parseInt(req.params.id);
    if (!projectId) {
        return res.status(400).send('Invalid project ID');
    }
    db.retrieveProject(projectId, (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (rows.length == 0) {
            return res.sendStatus(404);
        }
        res.send({
            id: projectId,
            name: rows[0].name,
            date: helpers.formatDate(rows[0].year, rows[0].month, rows[0].day),
            likedBy: _.compact(rows.map((row) => row.user_id)),
        });
        next();
    });
}

function deleteProject(req, res, next) {
    let projectId = parseInt(req.params.id);
    if (!projectId) {
        return res.status(400).send('Invalid user ID');
    }
    db.deleteProject(projectId, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.sendStatus(200);
        console.log(`Deleted project with ID ${projectId}`);
        next();
    });
}

// Likes

function handleLikeRequest(dataAccessFunction, req, res, next) {
    let userId = parseInt(req.body.userId);
    let projectId = parseInt(req.body.projectId);
    if (!userId) {
        return res.status(400).send('Missing or invalid user ID');
    }
    if (!projectId) {
        return res.status(400).send('Missing or invalid project ID');
    }
    dataAccessFunction(userId, projectId, (err) => {
        // It should return Bad Request if the project or the user doesn't
        // exist, but for the sake of simplicity it returns Server Error
        if (err) {
            return res.status(500).send(err);
        }
        res.sendStatus(200);
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
