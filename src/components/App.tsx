import * as React from "react"

import Board from "./Board"
import Dialog from "./Dialog"

export default class App extends React.Component<{}, {}> {

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
        <Board />
        <Dialog open={true} score={420} />
      </div>
  }
}
