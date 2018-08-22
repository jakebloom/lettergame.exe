import * as React from "react"

import Board from "./Board"

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
      </div>
  }
}
