import * as React from 'react'

interface Score {
    name: string,
    score: number
}

interface DialogProps {
    open: boolean,
    score: number
}

interface DialogState {
    scores: Score[],
    submitted: boolean
}

export default class Dialog extends React.Component<DialogProps, DialogState> {
    componentWillMount() {
        let scores: Score[] = JSON.parse(localStorage.getItem("lettergame_scores")) || []
        scores = scores.sort((a: Score, b: Score) => b.score - a.score)
        this.setState({scores, submitted: false})
    }

    render() {
        let top20: boolean = this.state.scores.length < 20 || this.props.score > this.state.scores[19].score
        return <dialog className="modal" open={this.props.open}>
            <p>Game Over. Your score is {this.props.score}</p>
            {top20 &&
                <p>
                    Enter Name:
                    <input 
                        id="nameInput"
                        className="nameInput"
                        type="text"
                        onKeyPress={this.onKeyPress}
                        disabled={this.state.submitted}/>
                </p>
            }
            <div>
                {this.state.scores.map(
                    (score: Score, idx: number) =>
                        <div key={"score" + idx}>{idx + 1}: {score.name} {score.score}</div>
                )}
            </div>
        </dialog>
    }

    onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            let scores: Score[] = this.state.scores
            scores.push({name: e.currentTarget.value, score: this.props.score})
            scores.sort((a: Score, b: Score) => b.score - a.score)
            localStorage.setItem("lettergame_scores", JSON.stringify(scores))
            this.setState({scores, submitted: true})
        }
    }
}