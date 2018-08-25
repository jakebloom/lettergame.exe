import * as React from "react"

import Letter from "./Letter"

interface BoardState {
    letters: string[][],
    selected: boolean[][],
    mark: number,
    point: number,
    score: number
}

interface BoardProps {
    onGameOver: (score: number) => void
}

interface Coordinate {
    col: number,
    row: number
}

export default class Board extends React.Component<BoardProps, BoardState> {
    OPTIONS = ["A", "B", "C", "D", "E"]
    NUM_ROWS = 10
    NUM_COLS = 20

    componentWillMount(){
        let letters: string[][] = []
        let selected: boolean[][] = Array(this.NUM_ROWS).fill(null).map(() => Array(this.NUM_COLS).fill(false))
        let mark: number = 0
        let point: number = 0
        let score: number = 0

        for (let row = 0; row < this.NUM_ROWS; row++) {
            let letterRow: string[] = []
            for (let col = 0; col < this.NUM_COLS; col++) {
                letterRow.push(this.randomChoice())
            }
            letters.push(letterRow)
        }

        this.setState({letters, selected, mark, point, score})
    }

    render() {
        let tiles = []
        for (let row = 0; row < this.NUM_ROWS; row++) {
              let tilerow = []
              for (let col = 0; col < this.NUM_COLS; col++) {
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
            <div className="boardContent">
                {tiles.map(row => <div>{row}</div>)}
                <div className="scoreBar">
                    Mark : {this.state.mark} (Point : {this.state.point}) Score : {this.state.score}
                </div>
            </div>
        </div>
    }

    randomChoice(): string {
        let index = Math.floor(Math.random() * this.OPTIONS.length)
        return this.OPTIONS[index]
    }

    onLetterClick = (row: number, col: number): void => {
        let mark: number = 0
        let score: number = this.state.score
        let point: number = 0
        if (this.state.letters[row][col] == null) {
            return
        }

        let neighbours: Coordinate[] = this.getNeighbours(row, col, this.state.letters[row][col])
        let selected: boolean[][] = Array(this.NUM_ROWS).fill(null).map(() => Array(this.NUM_COLS).fill(false))
        let letters: string[][] = this.state.letters

        if (this.state.selected[row][col]) {
            neighbours.forEach((node: Coordinate) => {
                selected[node.row][node.col] = false
                letters[node.row][node.col] = null
            })
            score += this.state.point
        } else if (neighbours.length > 1) {
            neighbours.forEach((node: Coordinate) => {selected[node.row][node.col] = true})
            mark = neighbours.length
            point = mark * mark - 3 * mark + 4
        }

        letters = this.consolidate(letters)
        this.setState({letters, selected, mark, point, score})

        if (!this.isPlayable(letters)) {
            this.props.onGameOver(score)
        }
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
                for (let row: number = 0; row < this.NUM_ROWS; row++) {
                    letters[row][this.NUM_COLS - 1] = null
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
                curr.row != this.NUM_ROWS - 1 &&
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
                curr.col != this.NUM_COLS - 1 &&
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

    isPlayable(letters: string[][]): boolean {
        for (let row: number = 0; row < this.NUM_ROWS; row++) {
            for (let col: number = 0; col < this.NUM_COLS; col++) {
                if (letters[row][col] != null) {
                    if (
                        row !== 0 && 
                        letters[row][col] === letters[row - 1][col]
                    ) {
                        return true
                    }

                    if (
                        row !== this.NUM_ROWS - 1 && 
                        letters[row][col] === letters[row + 1][col]
                    ) {
                        return true
                    }

                    if (
                        col !== 0 &&
                        letters[row][col] === letters[row][col - 1]
                    ) {
                        return true
                    }

                    if (
                        col !== this.NUM_COLS - 1 &&
                        letters[row][col] === letters[row][col + 1]
                    ) {
                        return true
                    }
                }
            }
        }
        return false
    }
}

