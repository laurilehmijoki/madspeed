var Bacon = require('baconjs')
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

var tick = Bacon.interval(50)

var activeKeys = Bacon.update(Immutable.Set(),
  [keyDownStream], (prev, keyDownCode) => prev.concat(keyDownCode),
  [keyUpStream], (prev, keyUpCode) => prev.filterNot(keyCode => keyCode == keyUpCode)
).sampledBy(tick)

var keyCodeToAxisDelta = {
  37: {axis: 'x', delta: -1},
  38: {axis: 'y', delta: -1},
  39: {axis: 'x', delta: 1},
  40: {axis: 'y', delta: 1}
}

var areaBounds = {
  x: {
    min: 0,
    max: window.innerWidth - 40
  },
  y: {
    min: 0,
    max: window.innerHeight - 20
  }
}

var coordinatesStream = Bacon.update(Immutable.Map({xVector: 0, yVector: 0, xCoord: 0, yCoord: 0}),
  [activeKeys.toEventStream()], function(ballProperties, activeKeys) {
    var limitVectorMagnitude = vector => vector < 0 ? Math.max(vector, -5) : Math.min(vector, 5)
    var vectorDeltasFromKeyboardAdded = activeKeys
      .map(activeKey => keyCodeToAxisDelta[activeKey])
      .filter(x => x != undefined)
      .reduce(
        (memo, {axis, delta}) => memo.update(`${axis}Vector`, (vect) => limitVectorMagnitude(vect + delta)),
        ballProperties
      )
    var vectorDeltasApplied = vectorDeltasFromKeyboardAdded.update('yVector', yVect => yVect + 0.3)
    var coordinateDeltasAdded = ['x', 'y'].reduce(
      (ballProperties, axis) => ballProperties.update(`${axis}Coord`, (coord) => coord + ballProperties.get(`${axis}Vector`)),
      vectorDeltasApplied
    )
    var hasReachedAreaBound = function(axis, ballProperties) {
      var coord = ballProperties.get(`${axis}Coord`)
      return coord <= 0 ? true : coord > areaBounds[axis].max
    }

    var bounchesApplied = ['x', 'y'].reduce(
      (ballProperties, axis) => ballProperties.update(
        `${axis}Vector`,
        vect => hasReachedAreaBound(axis, ballProperties) ? (vect * -0.9) : vect
      ),
      coordinateDeltasAdded
    )
    return bounchesApplied
  }
).doAction(x => console.log(x.toJS()))

var gameStateStream = Bacon.combineTemplate({
  coordinates: coordinatesStream.map((c) => c.toJS())
})

module.exports = {
  gameStateStream
}