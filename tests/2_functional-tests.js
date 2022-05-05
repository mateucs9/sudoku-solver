const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const puzzles = require('../controllers/puzzle-strings.js')
let puzzlesAndSolutions = puzzles.puzzlesAndSolutions

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzlesAndSolutions[0][0] })
      .end((err, res) => {
        assert.property(res.body, 'solution')
        assert.equal(res.body.solution, puzzlesAndSolutions[0][1])
        done()
      })
  })

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'error')
        assert.notEqual(res.body.error, null)
        done()
      })
  })

  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: setCharAt(puzzlesAndSolutions[0][0], 2, 'C') })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Invalid characters in puzzle')
        done()
      })
  })

  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzlesAndSolutions[0][0].slice(0, 40) })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
        done()
      })
  })

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: setCharAt(puzzlesAndSolutions[0][0], 0, 9) })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Puzzle cannot be solved')
        done()
      })
  })

  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: '1'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'valid')
        done()
      })
  })

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: '8'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'valid')
        assert.property(res.body, 'conflict')
        assert.equal(res.body.conflict.length, 1)
        done()
      })
  })

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: '2'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'valid')
        assert.property(res.body, 'conflict')
        assert.isAbove(res.body.conflict.length, 1)
        done()
      })
  })


  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: '2'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'valid')
        assert.property(res.body, 'conflict')
        assert.equal(res.body.conflict.length, 3)
        done()
      })
  })

  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Required field(s) missing')
        done()
      })
  })

  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: setCharAt(puzzlesAndSolutions[0][0], 2, 'C'),
        coordinate: 'A2',
        value: '1'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Invalid characters in puzzle')
        done()
      })
  })

  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0] + '1',
        coordinate: 'A2',
        value: '1'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
        done()
      })
  })

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'Z2',
        value: '1'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Invalid coordinate')
        done()
      })
  })

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: 'Z'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.isObject(res.body)
        assert.property(res.body, 'error')
        assert.equal(res.body.error, 'Invalid value')
        done()
      })
  })

});

function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr.toString() + str.substring(index + 1);
}