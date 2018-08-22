import * as React from "react"

import Board from "./Board"

export default class App extends React.Component<{}, {}> {

  render() {
    return <div className="container">
        <div className="titleBar">Same Game for Windows</div>
        <div className="toolBar">
            <ul>
                <li>Menu</li>
                <li>Option</li>
                <li>Help</li>
            </ul>
        </div>
        <Board />
      </div>
  }
}
