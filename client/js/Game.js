var React = require('react')
var Bacon = require('baconjs')
var ReactCanvas = require('react-canvas')

var Immutable = require('immutable')

var {Surface, Image} = ReactCanvas

var imgDimension = 20

var Game = React.createClass({
  getInitialState: function() { 
    return {
      imageTop: 0,
      imageLeft: 0,
      yVector: 0,
      xVector: 0
    }
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this
    var update = (prop, delta) => function() {
      var nextDelta = component.state[prop] + delta
      var nextValue = delta > 0 ? Math.min(6, nextDelta) : Math.max(-6, nextDelta)
      component.setState(
        Immutable.Map({}).set(prop, nextValue).toJS()
      )
    }
    var key = (filteredKeyCode) => nextProps.world.activeKeys.filter((keyCode) => keyCode == filteredKeyCode)
    key(37).forEach(update('xVector', -1))
    key(38).forEach(update('yVector', -1))
    key(39).forEach(update('xVector', 1))
    key(40).forEach(update('yVector', 1))
    var leftWall = 0
    var topWall = 0
    var rightWall = window.innerWidth - imgDimension
    var bottomWall = window.innerHeight - imgDimension
    component.setState({
      imageTop: Math.max(topWall, Math.min(this.state.imageTop + this.state.yVector, bottomWall)),
      imageLeft: Math.max(leftWall, Math.min(this.state.imageLeft + this.state.xVector, rightWall))
    }, function() {
      var didHitLeftWall = component.state.imageLeft <= leftWall
      if (didHitLeftWall) component.setState({xVector: -(component.state.xVector * 0.8)})
      var didHitTopWall = component.state.imageTop <= topWall
      if (didHitTopWall) component.setState({yVector: -(component.state.yVector * 0.8)})
      var didHitRightWall = component.state.imageLeft >= rightWall
      if (didHitRightWall) component.setState({xVector: -(component.state.xVector * 0.8)})
      var didHitBottomWall = component.state.imageTop >= bottomWall
      if (didHitBottomWall) component.setState({yVector: -(component.state.yVector * 0.8)})

      setTimeout(update('yVector', 0.1), 10)
    })
  },

  render: function () {
    var surfaceWidth = window.innerWidth;
    var surfaceHeight = window.innerHeight;
    var imageStyle = this.getImageStyle();
    return (
      <Surface width={surfaceWidth} height={surfaceHeight} left={0} top={0}>
        <Image style={imageStyle} src='http://www.aplusrstore.com/photos/large/idearoot_color.jpg' />
      </Surface>
    );
  },

  getImageStyle: function () {
    return {
      top: this.state.imageTop,
      left: this.state.imageLeft,
      width: imgDimension,
      height: imgDimension
    };
  }
});

module.exports = Game