var React = require('react')
var ReactCanvas = require('react-canvas')

var {Surface, Image} = ReactCanvas

var imgDimension = 20

var Game = React.createClass({
  render: function () {
    var surfaceWidth = window.innerWidth
    var surfaceHeight = window.innerHeight
    var {xCoord, yCoord} = this.props.world.coordinates
    //console.log(this.props.world.coordinates)
    var imageStyle = {
      top: yCoord,
      left: xCoord,
      width: imgDimension,
      height: imgDimension
    }
    return (
      <Surface width={surfaceWidth} height={surfaceHeight} left={0} top={0}>
        <Image style={imageStyle} src='/img/ball.jpg' />
      </Surface>
    )
  }
})

module.exports = Game