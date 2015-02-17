var React = require('react')
var Bacon = require('baconjs')
var Game = require('./Game')
var Immutable = require('immutable')

var el = document.getElementsByTagName("html")[0]
var keyDownStream = Bacon.fromBinder(function(sink) {
  el.onkeydown = function(evt) {
    evt = evt || window.event;
    sink(evt.keyCode)
  }
})
var keyUpStream = Bacon.fromBinder(function(sink) {
  el.onkeyup = function(evt) {
    evt = evt || window.event;
    sink(evt.keyCode)
  }
})

var activeKeysStream = Bacon.update(Immutable.Set(),
  [keyDownStream], (activeKeys, keyCode) => activeKeys.concat(keyCode),
  [keyUpStream], (activeKeys, keyCode) => activeKeys.filterNot((activeKey) => activeKey === keyCode)
).map((list) => list.toJS()).sampledBy(Bacon.interval(25))

var globalStateStream = Bacon.combineTemplate({
  activeKeys: activeKeysStream
})

var App = React.createClass({
  componentWillMount: function() {
    var component = this
    this.props.stateStream.onValue((state) => component.setState(state))
  },
  render: function() {
    return <Game world={this.state}/>
  }
})

React.render(<App stateStream={globalStateStream}/>, document.getElementById('app'))
