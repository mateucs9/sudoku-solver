'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let coord = req.body.coordinate
      let value = req.body.value
      let puzzle = req.body.puzzle

      if (coord == '' || value == '' || puzzle == '' || coord == undefined || value == undefined || puzzle == undefined || coord == null || value == null || puzzle == null) {
        res.send({
          error: 'Required field(s) missing'
        })
      } else {
        let coordRow = coord.toUpperCase().charCodeAt(0) - 64
        let coordCol = Number(coord[1])

        if (puzzle.length != 81) {
          res.send({
            error: 'Expected puzzle to be 81 characters long'
          })

        } else if (puzzle.match(/^[1-9.-]*$/) == null) {
          res.send({
            error: 'Invalid characters in puzzle'
          })

        } else if (value.match(/^[1-9]+$/) == null) {
          res.send({
            error: 'Invalid value'
          })
        } else if (coord.match(/^[a-iA-I][1-9]$/) == null) {
          res.send({
            error: 'Invalid coordinate'
          })
        } else if (puzzle[coordRow * 9 + coordCol - 10] != '.') {
          res.send({
            valid: true
          })
        } else {
          let check = { valid: true }
          let data = [
            { row: solver.checkRowPlacement(puzzle, coordRow, coordCol, value) },
            { column: solver.checkColPlacement(puzzle, coordRow, coordCol, value) },
            { region: solver.checkRegionPlacement(puzzle, coordRow, coordCol, value) }]
          for (let section of data) {
            if (!Object.values(section)[0]) {
              if (!check.hasOwnProperty('conflict')) {
                check['conflict'] = []
              }
              check.valid = false
              check.conflict.push(Object.keys(section)[0])
            }
          }
          console.log(check)
          res.send(check)
        }

      }


    });

  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle

      if (puzzle == undefined || puzzle == null || puzzle == '') {
        res.send({
          error: 'Required field missing'
        })
      } else {
        res.send(solver.solve(puzzle));
      }


    });
};
