import * as React from "react"

import Board from "./Board"

export default class App extends React.Component<{}, {}> {

  render() {
    return <div className="container">
        <div className="titleBar">Same Game for Windows</div>
        <div className="toolBar">Menu Option Help</div>
        <Board />
      </div>
  }
}
