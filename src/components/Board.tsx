import * as React from "react"

import Letter from "./Letter"

interface BoardState {
    letters: string[][],
    selected: boolean[][]
}

interface Coordinate {
    col: number,
    row: number
}

export default class Board extends React.Component<{}, BoardState> {
    OPTIONS = ["A", "B", "C", "D", "E"]
    NUM_ROWS = 8
    NUM_COLS = 16

    componentWillMount(){
        let letters: string[][] = []
        let selected: boolean[][] = Array(8).fill(null).map(() => Array(16).fill(false))
        for (let row = 0; row < 8; row++) {
            let letterRow: string[] = []
            for (let col = 0; col < 16; col++) {
                letterRow.push(this.randomChoice())
            }
            letters.push(letterRow)
        }

        this.setState({letters, selected})
    }

    render() {
        let tiles = []
        for (let row = 0; row < 8; row++) {
              let tilerow = []
              for (let col = 0; col < 16; col++) {
                    tilerow.push(
                      <Letter 
                          col={col}
                          key={String(row) + "." + String(col)}
                          letter={this.state.letters[row][col]}
                          onclick={this.onLetterClick}
                          row={row}
                          selected={this.state.selected[row][col]}/>
                    )
              }
              tiles.push(tilerow)
        }
        return <div className="board">
            {tiles.map(row => <div>{row}</div>)}
            <div className="scoreBar">
                Mark : 0 (Point : 0) Score 0
            </div>
        </div>
    }

    randomChoice(): string {
        let index = Math.floor(Math.random() * this.OPTIONS.length)
        return this.OPTIONS[index]
    }

    onLetterClick = (row: number, col: number): void => {
        if (this.state.letters[row][col] == null) {
            return
        }

        let neighbours: Coordinate[] = this.getNeighbours(row, col, this.state.letters[row][col])
        let selected: boolean[][] = Array(8).fill(null).map(() => Array(16).fill(false))
        let letters: string[][] = this.state.letters

        if (this.state.selected[row][col]) {
            neighbours.forEach((node: Coordinate) => {
                selected[node.row][node.col] = false
                letters[node.row][node.col] = null
            })

        } else if (neighbours.length > 1) {
            neighbours.forEach((node: Coordinate) => {selected[node.row][node.col] = true})
        }

        letters = this.consolidate(letters)
        this.setState({letters, selected})
    }

    consolidate(letters: string[][]): string[][] {
        let highCol: number = this.NUM_COLS
        let col: number = 0
        while (col < highCol) {
            // drop rows down
            let lowLimit: number = 0
            let row: number = this.NUM_ROWS - 1
            while (row > lowLimit) {
                if (letters[row][col] == null) {
                    for (let currRow: number = row; currRow > lowLimit; currRow--) {
                        letters[currRow][col] = letters[currRow - 1][col]
                    }
                    letters[0][col] = null
                    lowLimit++
                } else {
                    row--
                }
            }

            // move columns accross
            let empty: boolean = true
            for (let row: number = 0; row < this.NUM_ROWS; row++) {
                if (letters[row][col] != null) {
                    empty = false
                }
            }

            if (empty) {
                for (let currCol: number = col; currCol < highCol - 1; currCol++) {
                    for (let row: number = 0; row < this.NUM_ROWS; row++) {
                        letters[row][currCol] = letters[row][currCol + 1]
                    }
                }
                highCol--
            } else {
                col++
            }
        }
        return letters;
    }

    getNeighbours(row: number, col: number, letter: string): Coordinate[] {
        let stack: Coordinate[] = [{row, col}]
        let neighbours: Coordinate[] = [{row, col}]

        while (stack.length != 0) {
            let curr: Coordinate = stack.pop()

            if (
                curr.row != 0 &&
                this.state.letters[curr.row - 1][curr.col] == letter &&
                !this.checkInclusion(neighbours, curr.row - 1, curr.col)
            ) {
                neighbours.push({row: curr.row - 1, col: curr.col})
                stack.push({row: curr.row - 1, col: curr.col})
            }

            if (
                curr.row != 7 &&
                this.state.letters[curr.row + 1][curr.col] == letter &&
                !this.checkInclusion(neighbours, curr.row + 1, curr.col)
            ) {
                neighbours.push({row: curr.row + 1, col: curr.col})
                stack.push({row: curr.row + 1, col: curr.col})
            }

            if (
                curr.col != 0 &&
                this.state.letters[curr.row][curr.col - 1] == letter &&
                !this.checkInclusion(neighbours, curr.row, curr.col - 1)
            ) {
                neighbours.push({row: curr.row, col: curr.col - 1})
                stack.push({row: curr.row, col: curr.col - 1})
            }

            if (
                curr.col != 15 &&
                this.state.letters[curr.row][curr.col + 1] == letter &&
                !this.checkInclusion(neighbours, curr.row, curr.col + 1)
            ) {
                neighbours.push({row: curr.row, col: curr.col + 1})
                stack.push({row: curr.row, col: curr.col + 1})
            }

        }

        return neighbours
    }

    checkInclusion(a: Coordinate[], row: number, col: number): boolean {
        for (let i = 0; i < a.length; i++) {
            if (a[i].row == row && a[i].col == col) {
                return true
            }
        }
        return false
    }
}

