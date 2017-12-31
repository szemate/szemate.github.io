// Service

const express = require('express');
const bodyParser = require('body-parser');

const db = require('./db');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());

app.all('*', (_, res, next) => {
    res.set('Content-Type', 'application/json');
    next();
});

// Status
app.get('/', (_, res, next) => {
    res.send({ status: 'alive' });
    next();
});

// Users
app.post('/user', routes.createUser);
app.get('/user/:id', routes.retrieveUser);
app.delete('/user/:id', routes.deleteUser);

// Projects
app.post('/project', routes.createProject);
app.get('/project/:id', routes.retrieveProject);
app.delete('/project/:id', routes.deleteProject);

// Likes
app.post('/like', routes.addLike);
app.delete('/like', routes.removeLike);

// Initialisation
if (process.env.NODE_ENV !== 'test') {
    db.init((err) => {
        if (err) {
            throw err;
        }
        app.listen(8080, () => console.log('Listening on port 8080'));
    });
}

module.exports = {
    app,
};
