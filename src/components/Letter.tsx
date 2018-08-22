import * as React from "react"

interface LetterProps {
    col: number;
    letter: string;
    onclick: (row: number, col: number, letter: string) => void;
    row: number;
    selected: boolean;
}

export default class Letter extends React.Component<LetterProps, {}> {
    render() {
        let classes: string = "letter"
        if (this.props.letter !== null) {
            classes += " letterBorder " + this.props.letter
        } else {
            classes += " empty"
        }

        if (this.props.selected) {
            classes += " selected"
        }

        return <span 
            className={classes}
            onClick={() => this.props.onclick(
                this.props.row,
                this.props.col,
                this.props.letter
            )}>
            {this.props.letter}
        </span>
    }
}