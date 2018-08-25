import * as React from "react"

import Board from "./Board"
import Dialog from "./Dialog"

interface AppState {dialogOpen: boolean, score: number}

export default class App extends React.Component<{}, AppState> {

    componentWillMount() {
        this.setState({
            dialogOpen: false,
            score: 0
        })
    }

    render() {
        return <div className="container">
            <div className="titleBar">Same Game for Windows</div>
            <div className="toolBar">
                <ul>
                    <li><u>M</u>enu</li>
                    <li><u>O</u>ption</li>
                    <li><u>H</u>elp</li>
                </ul>
            </div>
            <Board onGameOver={this.onGameOver} />
            <Dialog open={this.state.dialogOpen} score={this.state.score} />
        </div>
    }

    onGameOver = (score: number): void => this.setState({dialogOpen: true, score})


}
