// Data access module
//
// Note: creating an ORM model for this project would be overkill; data access
// functions are used instead.

const sqlite3 = require('sqlite3');
const session = new sqlite3.Database(':memory:');

function init(callback) {
    session.serialize(() => {
        session.run("PRAGMA foreign_keys = ON");
        session.run(
            `CREATE TABLE IF NOT EXISTS user (
                 id INTEGER PRIMARY KEY ASC,
                 name TEXT NOT NULL)`
        );
        session.run(
            `CREATE TABLE IF NOT EXISTS project (
                 id INTEGER PRIMARY KEY ASC,
                 name TEXT NOT NULL,
                 year INTEGER NOT NULL,
                 month INTEGER NOT NULL,
                 day INTEGER NOT NULL)`
        );
        session.run(
            `CREATE TABLE IF NOT EXISTS like (
                 user_id INTEGER,
                 project_id INTEGER,
                 PRIMARY KEY (user_id, project_id),
                 FOREIGN KEY (user_id) REFERENCES user(id),
                 FOREIGN KEY (project_id) REFERENCES project(id))`,
            callback
        );
    });
}

function close(callback) {
    session.close(callback);
}

function getLastId(callback) {
    // `last_insert_rowid` is not thread-safe but good enough for this project
    session.get("SELECT last_insert_rowid() AS id", callback);
}

// Users

function createUser(name, callback) {
    session.serialize(() => {
        session.run("INSERT INTO user (name) values (?)", name);
        getLastId(callback);
    });
}

function retrieveUser(userId, callback) {
    session.all(
        `SELECT user.name, project.name AS liked_project
         FROM user
         LEFT JOIN like ON user.id = like.user_id
         LEFT JOIN project ON project.id = like.project_id
         WHERE user.id = ?`,
        userId,
        callback
    );
}

function deleteUser(userId, callback) {
    session.run(
        "DELETE FROM user WHERE id = ?",
        userId,
        callback
    );
}

// Projects

function createProject(name, year, month, day, callback) {
    session.serialize(() => {
        session.run(
            "INSERT INTO project (name, year, month, day) values (?, ?, ?, ?)",
            [name, year, month, day]
        );
        getLastId(callback);
    });
}

function retrieveProject(projectId, callback) {
    session.all(
        `SELECT project.name, project.year, project.month, project.day,
                user.name as liked_by
         FROM project
         LEFT JOIN like ON project.id = like.project_id
         LEFT JOIN user ON user.id = like.user_id
         WHERE project.id = ?`,
        projectId,
        callback
    );
}

function deleteProject(projectId, callback) {
    session.run(
        "DELETE FROM project WHERE id = ?",
        projectId,
        callback
    );
}

// Likes

function addLike(userId, projectId, callback) {
    session.run(
        "INSERT INTO like (user_id, project_id) values (?, ?)",
        [userId, projectId],
        callback
    );
}

function removeLike(userId, projectId, callback) {
    session.run(
        "DELETE FROM like WHERE user_id = ? AND project_id = ?",
        [userId, projectId],
        callback
    );
}

module.exports = {
    addLike,
    close,
    createProject,
    createUser,
    deleteProject,
    deleteUser,
    init,
    removeLike,
    retrieveProject,
    retrieveUser,
};
