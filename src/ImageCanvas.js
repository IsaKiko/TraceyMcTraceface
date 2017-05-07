import d3 from 'd3';
import React, { Component } from 'react';
import './App.css';

class ImageCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordNumber: 0
    };  
  }

  componentDidMount(){
    var component = this

    // window.onresize = () => this.forceUpdate()      
    d3.select("#svgOverlay").on('click', function(){
      const mouse = d3.mouse(this);
      component._handleImageClick(mouse)
    })
    d3.select("#svgOverlay").on('mousemove', function(){
      const mouse = d3.mouse(this);
      component._handleMouseOver(mouse)
    })


  }

  componentDidUpdate(){
    // var top = window.scrollY + document.getElementById("imgTrace").getBoundingClientRect().top;
    // var left = window.scrollX +   document.getElementById("imgTrace").getBoundingClientRect().left;
    // var width = document.getElementById("imgTrace").getBoundingClientRect().width;
    // var height = document.getElementById("imgTrace").getBoundingClientRect().height;

    // d3.select("#svgOverlay")
    //       .style('width', width).style('height', height)
    //       .style('top', top).style('left', left)

   }


  _handleImageClick(mouse_event){
    var x_pos = mouse_event[0];
    var y_pos = mouse_event[1];

    if (this.props.setCoords){
        var coordNumber = this.state.coordNumber;
        this.props.onClick([x_pos, y_pos, coordNumber]);  
        this.setState({coordNumber: this.state.coordNumber+1})

      // }
      // onClick is a function that's handed down as a prop, which means, if i give it the 
      // two values now, they will be handed up to the parent component, because that's
      // where this function is getting executed
    }
    else if (this.props.trace){
      var traceNumber = this.props.traceNumber;
      this.props.onClick([x_pos, y_pos, traceNumber]);

      var x_circ = x_pos;
      var y_circ = y_pos //-top; 
      var component = this;
      d3.select("#svgOverlay").append("circle")
        .attr("cx", x_circ)
        .attr("cy", y_circ)
        .attr("fill", component.props.cScale((component.props.traceNumber-1)%10))
        .attr("class","dataPoint")
        .attr("r", 1)
      console.log("Data coordinates are: x = " + this.props.xScale(x_pos) + ", y = " + this.props.yScale(y_pos))
      console.log("Coordinates on the page are: x = " + x_pos + ", y = " + y_pos)

    }

    else {
      console.log("Coordinates on the page are: x = " + x_pos + ", y = " + y_pos)
      console.log("...just in case you were wondering")
    }
  }


  _handleMouseOver(mouse_event){
    var x_pos = mouse_event[0];
    var y_pos = mouse_event[1];
       
    if (this.state.coordNumber == 4) 
        {
          this.setState({coordNumber:0})
        }

    if (this.props.setCoords){

      var id = '#coord' + this.state.coordNumber;

      if (this.state.coordNumber == 0 || this.state.coordNumber == 1) 
        {
          d3.select(id)
          .attr("x1",x_pos).attr("x2",x_pos)
          .attr("y1",0).attr("y2",100)}
      else if (this.state.coordNumber == 2 || this.state.coordNumber ==  3) 
        {
          d3.select(id)
          .attr("x1",0).attr("x2",100)
          .attr("y1",y_pos).attr("y2",y_pos)}
    }
    // else {console.log("nah")}
  }
  


  render() {
    return (
      <div className="canvasContainer" id='canvasContainer' style={{backgroundImage: 'url(' + this.props.src + ')'}}>
        <svg id="svgOverlay" viewBox="0 0 100 100"></svg>
      </div>
    )
  }
}

export default ImageCanvas;

        // <svg id="svgOverlay" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet"></svg>

