const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzles = require('../controllers/puzzle-strings.js')

let solver = new Solver();
let puzzlesAndSolutions = puzzles.puzzlesAndSolutions

suite('UnitTests', () => {
  let puzzle = puzzlesAndSolutions[0][0]

  test('Logic handles a valid puzzle string of 81 characters', (done) => {
    let validation = solver.validate(puzzle)
    assert.equal(validation.error, null)
    done()
  })

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
    let changedPuzzle = setCharAt(puzzle, 5, 'a')

    let validation = solver.validate(changedPuzzle)
    assert.property(validation, 'error')
    assert.equal(validation.error, 'Invalid characters in puzzle')
    done()
  })

  test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
    let puzzle = puzzle += '1'
    let validation = solver.validate(puzzle)
    assert.property(validation, 'error')
    assert.equal(validation.error, 'Expected puzzle to be 81 characters long')
    done()
  })

  test('Logic handles a valid row placement', (done) => {
    let row = 1
    let col = 2
    let value = 3
    let validation = solver.checkRowPlacement(puzzle, row, col, value)
    assert.equal(validation, true)
    done()
  })

  test('Logic handles an invalid row placement', (done) => {
    let row = 1
    let col = 2
    let value = 5
    let validation = solver.checkRowPlacement(puzzle, row, col, value)
    assert.equal(validation, false)
    done()
  })

  test('Logic handles a valid column placement', (done) => {
    let row = 1
    let col = 2
    let value = 1
    let validation = solver.checkRowPlacement(puzzle, row, col, value)
    assert.equal(validation, false)
    done()
  })

  test('Logic handles an invalid column placement', (done) => {
    let row = 1
    let col = 2
    let value = 2
    let validation = solver.checkRowPlacement(puzzle, row, col, value)
    assert.equal(validation, false)
    done()
  })

  test('Logic handles a valid region (3x3 grid) placement', (done) => {
    let row = 1
    let col = 2
    let value = 3
    let validation = solver.checkRowPlacement(puzzle, row, col, value)
    assert.equal(validation, true)
    done()
  })

  test('Logic handles an invalid region (3x3 grid) placement', (done) => {
    let row = 1
    let col = 2
    let value = 5
    let validation = solver.checkRowPlacement(puzzle, row, col, value)
    assert.equal(validation, false)
    done()
  })

  test('Valid puzzle strings pass the solver', (done) => {
    let solvedPuzzle = puzzlesAndSolutions[0][1]
    let solution = solver.solve(puzzle)
    assert.equal(solution.solution, solvedPuzzle)
    done()
  })

  test('Invalid puzzle strings fail the solver', (done) => {
    let changedPuzzle = setCharAt(puzzle, 1, 1)

    let solution = solver.solve(changedPuzzle)
    assert.equal(solution.error, 'Puzzle cannot be solved')
    done()
  })

  test('Solver returns the expected solution for an incomplete puzzle', (done) => {
    let solution = solver.solve(puzzle)
    assert.equal(solution.error, null)
    done()
  })

});


function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr.toString() + str.substring(index + 1);
}