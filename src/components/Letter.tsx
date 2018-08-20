import * as React from "react"

interface LetterProps {
    col: number;
    letter: string;
    onclick: (row:number, col:number, letter:string) => void;
    row: number;
    selected: boolean;
}

export default class Letter extends React.Component<LetterProps, {}> {
    render() {
        let classes :string = this.props.selected ? "letter selected" : "letter"
        return <span 
            className="letter"
            onClick={() => this.props.onclick(
                this.props.row,
                this.props.col,
                this.props.letter
            )}>
            {this.props.letter}
        </span>
    }
}