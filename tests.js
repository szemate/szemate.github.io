// Tests with Mocha framework
// (run with `npm test`)

process.env.NODE_ENV = 'test';

const assert = require('assert');
const async = require('async');
const request = require('supertest');

const app = require('./server').app;
const db = require('./db');
const helpers = require('./helpers');

///////////////
// Unit tests

describe('Date parser', () => {
    it('should split a valid date to year, month, day', () => {
        assert.deepEqual(
            helpers.parseDate('2018-01-01'),
            { year: 2018, month: 1, day: 1 }
        );
    });
    [
        'gibberish', undefined, '2018-2-2', '2018-00-02', '2018-02-00',
        '2018-13-02', '2018-02-30'
    ].forEach((dateString) => {
        it(`should detect invalid date "${dateString}"`, () => {
            assert.equal(helpers.parseDate(dateString), null);
        });
    });
});

describe('Date formatter', () => {
    it('should create a string from year, month, day', () => {
        assert.equal(helpers.formatDate(2018, 1, 1), '2018-01-01');
    });
});

//////////////////////
// Integration tests

// Note: `async` module is used at places in order to avoid callback hell
// (i.e. lots of nested callbacks)

before((done) => {  // Setup
    db.init(done);
});

describe('User endpoint', () => {
    describe('POST request', () => {
        it('should create a new user', (done) => {
            request(app).post('/user').send({
                name: 'Joe'
            }).expect(201).end((err, res) => {
                assert.deepEqual(res.body, { id: 1 });
                done(err);
            });
        });
        it('should return Bad Request if user name is missing', (done) => {
            request(app).post('/user').send({}).expect(400, done);
        });
    });
    describe('GET request', () => {
        it('should retrieve the created user', (done) => {
            request(app).get('/user/1').expect(200).end((err, res) => {
                assert.deepEqual(res.body, {
                    id: 1,
                    name: 'Joe',
                    likes: []
                });
                done(err);
            });
        });
        it('should return Bad Request if user ID is invalid', (done) => {
            request(app).get('/user/Joe').expect(400, done);
        });
        it('should return Not Found if the user does not exist', (done) => {
            request(app).get('/user/5').expect(404, done);
        });
    });
    describe('DELETE request', () => {
        it('should delete the created user', (done) => {
            async.series([
                (next) => {
                    request(app).delete('/user/1').expect(200, next);
                },
                (next) => {
                    request(app).get('/user/1').expect(404, next);
                },
            ], done);
        });
        it('should return Bad Request if user ID is invalid', (done) => {
            request(app).delete('/user/Joe').expect(400, done);
        });
        it('should be okay with a user that does not exist', (done) => {
            request(app).delete('/user/5').expect(200, done);
        });
    });
});

describe('Project endpoint', () => {
    describe('POST request', () => {
        it('should create a new project', (done) => {
            request(app).post('/project').send({
                name: 'Foo',
                date: '2018-01-01'
            }).expect(201).end((err, res) => {
                assert.deepEqual(res.body, { id: 1 });
                done(err);
            });
        });
        it('should return Bad Request if project name is missing', (done) => {
            request(app).post('/project').send({
                date: '2018-01-01'
            }).expect(400, done);
        });
        it('should return Bad Request if project date is missing', (done) => {
            request(app).post('/project').send({
                name: 'Foo'
            }).expect(400, done);
        });
        it('should return Bad Request if project date is invalid', (done) => {
            request(app).post('/project').send({
                name: 'Foo',
                date: 'x'
            }).expect(400, done);
        });
    });
    describe('GET request', () => {
        it('should retrieve the created project', (done) => {
            request(app).get('/project/1').expect(200).end((err, res) => {
                assert.deepEqual(
                    res.body,
                    {
                        id: 1,
                        date: '2018-01-01',
                        name: 'Foo',
                        likedBy: []
                    }
                );
                done(err);
            });
        });
        it('should return Bad Request if project ID is invalid', (done) => {
            request(app).get('/project/Foo').expect(400, done);
        });
        it('should return Not Found if the project does not exist', (done) => {
            request(app).get('/project/5').expect(404, done);
        });
    });
    describe('DELETE request', () => {
        it('should delete the created project', (done) => {
            async.series([
                (next) => {
                    request(app).delete('/project/1').expect(200, next);
                },
                (next) => {
                    request(app).get('/project/1').expect(404, next);
                },
            ], done);
        });
        it('should return Bad Request if project ID is invalid', (done) => {
            request(app).delete('/project/Foo').expect(400, done);
        });
        it('should be okay with a project that does not exist', (done) => {
            request(app).delete('/project/5').expect(200, done);
        });
    });
});

describe('Like endpoint', () => {
    before((done) => {  // Setup
        async.series([
            (next) => db.createUser('Jim', next),
            (next) => db.createUser('Rob', next),
            (next) => db.createProject('Bar', 2017, 12, 31, next),
        ], done);
    });

    describe('POST request', () => {
        it('should let users like an existing project', (done) => {
            async.series([
                (next) => {
                    request(app).post('/like').send({
                        userId: 1,
                        projectId: 1
                    }).expect(200, next);
                },
                (next) => {
                    request(app).post('/like').send({
                        userId: 2,
                        projectId: 1
                    }).expect(200, next);
                },
                (next) => {
                    request(app).get('/user/1').expect(200).end((err, res) => {
                        assert.deepEqual(res.body.likes, ["Bar"]);
                        next(err);
                    });
                },
                (next) => {
                    request(app).get('/user/2').expect(200).end((err, res) => {
                        assert.deepEqual(res.body.likes, ["Bar"]);
                        next(err);
                    });
                },
                (next) => {
                    request(app).get('/project/1').expect(200)
                    .end((err, res) => {
                        assert.deepEqual(res.body.likedBy, ["Jim", "Rob"]);
                        next(err);
                    });
                },
            ], done);
        });
        it('should return Bad Request if user ID is missing', (done) => {
            request(app).post('/like').send({
                projectId: 1
            }).expect(400, done);
        });
        it('should return Bad Request if project ID is missing', (done) => {
            request(app).post('/like').send({
                userId: 1
            }).expect(400, done);
        });
        it('should return Server Error if the user/project pair ' +
           'does not exist', (done) => {
            request(app).post('/like').send({
                userId: 5,
                projectId: 6
            }).expect(500, done);
       });
    });
    describe('DELETE request', () => {
        it('should let a user unlike an existing project', (done) => {
            async.series([
                (next) => {
                    request(app).delete('/like').send({
                        userId: 1,
                        projectId: 1
                    }).expect(200, next);
                },
                (next) => {
                    request(app).get('/user/1').expect(200).end((err, res) => {
                        assert.deepEqual(res.body.likes, []);
                        next(err);
                    });
                },
                (next) => {
                    request(app).get('/user/2').expect(200).end((err, res) => {
                        assert.deepEqual(res.body.likes, ["Bar"]);
                        next(err);
                    });
                },
                (next) => {
                    request(app).get('/project/1').expect(200)
                    .end((err, res) => {
                        assert.deepEqual(res.body.likedBy, ["Rob"]);
                        next(err);
                    });
                },
            ], done);
        });
        it('should return Bad Request if user ID is missing', (done) => {
            request(app).delete('/like').send({
                projectId: 1
            }).expect(400, done);
        });
        it('should return Bad Request if project ID is missing', (done) => {
            request(app).delete('/like').send({
                userId: 1
            }).expect(400, done);
        });
        it('should be okay with a user/project pair that does not exist',
           (done) => {
            request(app).delete('/like').send({
                userId: 5,
                projectId: 6
            }).expect(200, done);
       });
    });
});
