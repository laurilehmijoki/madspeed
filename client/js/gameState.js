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

var tick = Bacon.interval(15)

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

var vectorsStream = Bacon.update(Immutable.Map({xVector: 0, yVector: 0}),
  [activeKeys.toEventStream()], (prevVectors, activeKeys) =>
    activeKeys
      .map(activeKey => keyCodeToAxisDelta[activeKey])
      .filter(x => x != undefined)
      .reduce(
        (memo, {axis, delta}) => memo.set(`${axis}Vector`, limitVectorMagnitude(memo.get(`${axis}Vector`) + delta)),
        prevVectors
      )
)

var limitVectorMagnitude = vector => vector < 0 ? Math.max(vector, -5) : Math.min(vector, 5)

var coordinatesStream = Bacon.update(Immutable.Map({xCoord: 0, yCoord: 0}),
  [vectorsStream.toEventStream()], (prevCoords, vectors) =>
    ['x', 'y'].reduce(
      (memo, axis) => memo.set(`${axis}Coord`, prevCoords.get(`${axis}Coord`) + vectors.get(`${axis}Vector`)),
      prevCoords
    )
)

var gameStateStream = Bacon.combineTemplate({
  coordinates: coordinatesStream.map((c) => c.toJS())
})

module.exports = {
  gameStateStream
}