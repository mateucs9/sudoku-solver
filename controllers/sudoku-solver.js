class SudokuSolver {

  validate(puzzleString) {
    let valid = true

    if (puzzleString.length != 81) {
      return { error: 'Expected puzzle to be 81 characters long' }

    } else if (puzzleString.match(/^[0-9.-]*$/) == null) {
      return ({
        error: 'Invalid characters in puzzle'
      })

    }

    return { valid: true }
  }


  checkRowPlacement(puzzleString, row, column, value) {
    let check = ''

    for (let rowNum = 1; rowNum <= 9; rowNum++) {
      for (let colNum = 1; colNum <= 9; colNum++) {
        let cell = (rowNum * 9) + colNum - 9

        if (rowNum == row) {
          check += puzzleString[cell - 1]
        }
      }
    }

    if (check.includes(value)) {return false}

    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    let check = ''

    for (let rowNum = 1; rowNum <= 9; rowNum++) {
      for (let colNum = 1; colNum <= 9; colNum++) {
        let cell = (rowNum * 9) + colNum - 9

        if (colNum == column) {
          check += puzzleString[cell - 1]
        }
      }
    }

    if (check.includes(value)) {return false}

    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let check = ''

    for (let rowNum = 1; rowNum <= 9; rowNum++) {
      for (let colNum = 1; colNum <= 9; colNum++) {
        let cell = (rowNum * 9) + colNum - 9

        if (Math.ceil(rowNum / 3) * 3 == Math.ceil(row / 3) * 3 && Math.ceil(colNum / 3) * 3 == Math.ceil(column / 3) * 3) {
          check += puzzleString[cell - 1]
        }
      }
    }

    if (check.includes(value)) {return false}

    return true
  }

  solve(puzzleString) {
    let validate = this.validate(puzzleString)
    if (validate.error) { return validate }

    let index = 0
    let answer = puzzleString
    let forward = true
    let val

    for (let i = 0; i <= 10000; i++) {
      if (index < 0) {
        break
      }

      val = answer.charAt(index)

      if (puzzleString.charAt(index) == '.') {
        val = this.findNextValue(answer, index, val)
        
        if (val > 0) {
          answer = this.setCharAt(answer, index, val)
          
          if (index == answer.length - 1) {
            return { solution: answer }
          }
          
          forward = true
          index += 1
        } else {
          answer = this.setCharAt(answer, index, '.')
          forward = false
          index -= 1
        }
      } else {
        index = forward ? index + 1 : index - 1
      }
    }
    return { error: 'Puzzle cannot be solved' }
  }

  setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr.toString() + str.substring(index + 1);
  }

  findNextValue(answer, index, value) {
    answer = this.setCharAt(answer, index, '.')
    let start = value == '.' ? 1 : parseInt(value) + 1

    for (var val = start; val <= 9; val++) {
      if (this.checkPlacement(answer, index, val)) {
        return val
      }
    }
    return -1;
  }

  checkPlacement(puzzleString, index, value) {
    var col = index % 9+1;
    var row = Math.floor(index / 9)+1

    return (
      this.checkRowPlacement(puzzleString, row, col, value) && this.checkColPlacement(puzzleString, row, col, value) && this.checkRegionPlacement(puzzleString, row, col, value)
    )
  }
}

module.exports = SudokuSolver;

