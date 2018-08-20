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

    componentWillMount(){
        let letters: string[][] = [] 
        let selected: boolean[][] = []
        for (let row = 0; row < 8; row++) {
            let letterRow: string[] = []
            let selectedRow: boolean[] = []
            for (let col = 0; col < 16; col++) {
                letterRow.push(this.randomChoice())
                selectedRow.push(false)
            }
            letters.push(letterRow)
            selected.push(selectedRow)
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
                        selected={false}/>
                  )
            }
            tiles.push(tilerow)
      }
      return tiles.map(row => <div>{row}</div>)
    }

    randomChoice(): string {
        let index = Math.floor(Math.random() * this.OPTIONS.length)
        return this.OPTIONS[index]
    }

    onLetterClick = (row: number, col: number): void => {
        if (this.state.letters[row][col] == null) {
            return
        }
        console.log(row, col, this.state.letters[row][col], "clicked!")
        let neighbours: Coordinate[] = this.getNeighbours(row, col, this.state.letters[row][col])
        console.log(neighbours)
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

