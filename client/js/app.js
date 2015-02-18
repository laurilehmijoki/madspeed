var React = require('react')
var Game = require('./Game')
var {gameStateStream} = require('./gameStateStore')

var App = React.createClass({
  componentWillMount: function() {
    var component = this
    this.props.stateStream.onValue((state) => component.setState(state))
  },
  render: function() {
    return <Game world={this.state}/>
  }
})

React.render(<App stateStream={gameStateStream}/>, document.getElementById('app'))
