import React, { Component } from 'react';
import d3 from 'd3';
import './App.css';
import ImageCanvas from './ImageCanvas.js'


class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {file: '',
                  imagePreviewUrl: '', 
                  setCoords: false,
                  trace: false,
                  c_x1: 0,
                  c_x2: 100,
                  c_y1: 0,
                  c_y2: 100,
                  d_x1: 0,
                  d_x2: 100,
                  d_y1: 0,
                  d_y2: 100,
                  xScale: d3.scale.linear().domain([0,100]).range([0,100]),
                  yScale: d3.scale.linear().domain([0,100]).range([0,100]),
                  traceNumber: -1,
                  data:[],
                  coordsSet: false
                };
  }

  componentDidMount(){
    window.onresize = () => this.forceUpdate()      
    window.onscroll = () => this.forceUpdate()      
  }

  componentDidUpdate(){
    // if (this.state.coordsSet)
    //   {    console.log('updated')
    //   }
  }

  _handleExportClick(e) {

    // create download function:
    function download(filename, text) {
        var a
        a = document.createElement('a');
        document.body.appendChild(a);
        a.download = filename;
        a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
        a.click();
    }

    // scale data from viewbox coordinates to user coordinates
    var xScale = this.state.xScale;
    var yScale = this.state.yScale;

    var save_data = [];

    var data = this.state.data.map(function(d, idx){
      var scaled_data = {
            x: d.x.map(function(elx){return xScale(elx)}),
            y: d.y.map(function(ely){return yScale(ely)}),
            trace: d.trace
          };
      save_data[idx] = scaled_data;
      })
    download('TraceData.json', JSON.stringify(save_data));
  }

 _handleExportClick_csv(e) {

    // create download function:
    function download(filename) {
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link); // Required for FF

        link.click(); 
    }

    // scale data from viewbox coordinates to user coordinates
    var xScale = this.state.xScale;
    var yScale = this.state.yScale;

    var save_data = [];

    var data = this.state.data.map(function(d, idx){
      var scaled_data = {
            x: d.x.map(function(elx){return xScale(elx)}),
            y: d.y.map(function(ely){return yScale(ely)}),
            trace: d.trace
          };
      save_data[idx] = scaled_data;
      })

    var csvContent = "data:text/csv;charset=utf-8,";
    save_data.forEach(function(infoArray, index){
       var xArray = infoArray.x.join(",");
       var yArray = infoArray.y.join(",");
       csvContent += index*2-1 < data.length ? xArray+ "\n" : xArray;
       csvContent += index*2 < data.length ? yArray+ "\n" : yArray;
    }); 

    var encodedUri = encodeURI(csvContent);

    download('TraceData.csv');
  }


  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
        setCoords: false,
        trace: false,
        traceNumber:-1,
        data:[]
      });
      console.log('File provided:', this.state.file, ' is now saved in "state.file".')
    }

    reader.readAsDataURL(file);
    var el = document.getElementById( 'svgOverlay' );
    while( el.hasChildNodes() ){
      el.removeChild(el.lastChild);
    }

    d3.selectAll(".coord-label").remove();
    // console.log('handle uploading-', this.state.file);    
  }

  _handleCoordClick(e){
    this.setState({
      setCoords: true,
      trace: false,
      traceNumber:-1,
      // data:[]
    })

    d3.selectAll(".line").remove();
    d3.selectAll(".coord-label").remove();
    // d3.selectAll(".dataPoint").remove();

    var id = "coord0"
    var width = document.getElementById("svgOverlay").getBoundingClientRect().width;
    var height = document.getElementById("svgOverlay").getBoundingClientRect().height;


    d3.select("#svgOverlay").append("line")
                  .attr("x1",width/2).attr("x2",width/2)
                  .attr("y1",0).attr("y2",height)
                  .attr("class","line")
                  .attr("id", id);
  }

  _handleTraceClick(e){
    // console.log(this.state.d_x1," ",this.state.d_x2," ",this.state.c_x1," ",this.state.c_x2," ",)
    this.setState({
      setCoords: false,
      trace: true,
      xScale: d3.scale.linear().range([parseFloat(this.state.d_x1), parseFloat(this.state.d_x2)]).domain([this.state.c_x1, this.state.c_x2]),
      yScale: d3.scale.linear().range([parseFloat(this.state.d_y1), parseFloat(this.state.d_y2)]).domain([this.state.c_y1, this.state.c_y2]),       
      traceNumber: this.state.traceNumber+1
    })
    // console.log(this.state.traceNumber)
  }

  _handlePointSelect(coords){
    var x_pos = coords[0];
    var y_pos = coords[1];

    if (this.state.trace){
      // console.log('x: ', coords[0], 'y: ', coords[1], 'trace: ', coords[2]);

      var idx = coords[2];

      console.log('x: ', coords[0], 'y: ', coords[1], 'trace: ', coords[2]);

      var newdata = this.state.data.map(function(el){return el})

      if (newdata.length <= idx)
        {
        newdata[idx] = {x:[], y:[], trace:coords[2]};
        newdata[idx].x[newdata[idx].x.length] = coords[0];
        newdata[idx].y[newdata[idx].y.length] = coords[1];        
        }

      else 
        {
        newdata[idx].x[newdata[idx].x.length] = coords[0];
        newdata[idx].y[newdata[idx].y.length] = coords[1];        
        }

      this.setState({data:newdata})

    }


    else if (this.state.setCoords){
      this.setState({coordsSet: false})
        if (coords[2] === 0)
          { this.setState({
            c_x1: coords[0],
            xScale: d3.scale.linear().range([parseFloat(this.state.d_x1), parseFloat(this.state.d_x2)]).domain([coords[0], this.state.c_x2])
          });
            console.log('x1', coords[0]);
            d3.select("#svgOverlay").append("line")
                  .attr("x1",x_pos).attr("x2",x_pos)
                  .attr("y1",0).attr("y2",100)
                  .attr("class","line")
                  .attr("id", "coord1");
            const component = this;
            d3.select("#canvasContainer").append("input").attr("type","text")
              .attr("class","coord-label")
              .attr("id","coord_label_x1")
              .style("left",x_pos+'%')
              .style("top", 100 +"%")
              .on("click", function(){this.value = ""})
              .on("change",function(){
                component.setState(
                  {d_x1: this.value,
                  xScale: d3.scale.linear().range([parseFloat(this.value), parseFloat(component.state.d_x2)]).domain([coords[0], component.state.c_x2])
                  });                
            });
            document.getElementById("coord_label_x1").value = "0";

          }
        if (coords[2] === 1)
          {this.setState({
            c_x2: coords[0],
            xScale: d3.scale.linear().range([parseFloat(this.state.d_x1), parseFloat(this.state.d_x2)]).domain([this.state.c_x1, coords[0]])
          });
            console.log('x2', coords[0]);
            d3.select("#svgOverlay").append("line")
                  .attr("x1",0).attr("x2",100)
                  .attr("y1",y_pos).attr("y2",y_pos)
                  .attr("class","line")
                  .attr("id", "coord2");
            const component = this;
            d3.select("#canvasContainer").append("input").attr("type","text")
              .attr("class","coord-label")
              .attr("id","coord_label_x2")
              .style("left",x_pos+'%')
              .style("top", 100 +"%")
              .on("click", function(){this.value = ""})
              .on("change",function(){
                component.setState(
                  {d_x2: this.value,
                  xScale: d3.scale.linear().range([parseFloat(component.state.d_x1), parseFloat(this.value)]).domain([component.state.c_x1, coords[0]])
                  });                
            });
            document.getElementById("coord_label_x2").value = "100";
        }
        if (coords[2] === 2)
          {this.setState({
            c_y1: coords[1],
            yScale: d3.scale.linear().range([parseFloat(this.state.d_y1), parseFloat(this.state.d_y2)]).domain([coords[1], this.state.c_y2])
         });
            console.log('y1', coords[1]);
            d3.select("#svgOverlay").append("line")
                  .attr("x1",0).attr("x2",100)
                  .attr("y1",100/2).attr("y2",100/2)
                  .attr("class","line")
                  .attr("id", "coord3");
            const component = this;
            d3.select("#canvasContainer").append("input").attr("type","text")
              .attr("class","coord-label")
              .attr("id","coord_label_y1")
              .style("top",y_pos+'%')
              .style("left",100+'%')
              .on("click", function(){this.value = ""})
              .on("change",function(){
                component.setState(
                  {d_y1: this.value,
                  yScale: d3.scale.linear().range([parseFloat(this.value), parseFloat(component.state.d_y2)]).domain([coords[1], component.state.c_y2])
                  });                 
            });
            document.getElementById("coord_label_y1").value = "0";        
          }
        if (coords[2] === 3)
          {
            this.setState({
              c_y2: coords[1],
              yScale: d3.scale.linear().range([parseFloat(this.state.d_y1), parseFloat(this.state.d_y2)]).domain([this.state.c_y1, coords[1]])
            });
            console.log('y2', coords[1]);
            const component = this;
            d3.select("#canvasContainer").append("input").attr("type","text")
              .attr("class","coord-label")
              .attr("id","coord_label_y2")
              .style("top",y_pos+'%')
              .style("left",100+'%')
              .on("click", function(){this.value = ""})
              .on("change",function(){
                component.setState(
                  {d_y2: this.value,
                  yScale: d3.scale.linear().range([parseFloat(component.state.d_y1), parseFloat(this.value)]).domain([component.state.c_y1, coords[1]])
                  });                
              });
            document.getElementById("coord_label_y2").value = "100";  
            this.setState({setCoords: false, coordsSet: true});
          }
      }
  }

  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {

      var cScale = d3.scale.ordinal()
        .domain([-1,0,1,2,3,4,5,6,7,8,9,10])
        .range(["#158d54","#dc39ba","#3bb6fc","#8e50ff","#f0c731","#ff9449","#61e0c1","#d79774","#0923b5","#62374b","#72ed87"]);

      if (this.state.setCoords){var buttonCoordsClass = "blue button"}
        else if (this.state.setCoords == false){var buttonCoordsClass = "green button"}      

      if (this.state.trace){
        var buttonTraceText = "Add trace";
        var col = cScale(this.state.traceNumber%10);
        // console.log(cScale(this.state.traceNumber))
      }
        else if (this.state.trace == false){
          var buttonTraceText = "Add trace"}      

      $imagePreview = (
        <div>
          <div className="flexrow">
              <input style={{display: 'none'}} id="file" type="file" onChange={(e)=>{this._handleImageChange(e); }} />
              <label className="green button" htmlFor="file">Change image</label> 
            <div className={buttonCoordsClass} onClick={(e)=>this._handleCoordClick(e)} > Set up coordinate system</div>
            <div className="green button" style={{background: col}} onClick={(e)=>this._handleTraceClick(e)} > {buttonTraceText} </div>
            <div className="green button" onClick={(e)=>this._handleExportClick(e)} > Export JSON  data </div>
            <div className="green button" onClick={(e)=>this._handleExportClick_csv(e)} > Export CSV  data </div>
          </div>
          <div id="boundingbox">
          <ImageCanvas xScale={this.state.xScale} yScale={this.state.yScale} cScale={cScale} onClick={(coords)=>this._handlePointSelect(coords)} setCoords={this.state.setCoords} trace={this.state.trace} traceNumber={this.state.traceNumber} file={this.state.file.name} src={imagePreviewUrl} />
          </div>
        </div>
        );
    } else {
      $imagePreview = (
        <div>
          <input style={{display: 'none'}} id="file" type="file" onChange={(e)=>{this._handleImageChange(e); }} />
          <label className="green button" htmlFor="file">Upload image</label> 
        </div>
        );
    }

    return (
      <div className="previewComponent">
        <div className="imgContainer">
          {$imagePreview}
        </div>
      </div>
    )
  }
}
  
export default ImageUpload;
