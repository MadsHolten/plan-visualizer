import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Input } from '@angular/core';

import * as geojsonExtent from 'geojson-extent';
import * as _ from 'lodash';
import * as d3 from 'd3';

//////
// For tooltips, maybe have a look at this: https://github.com/andyperlitch/ngx-d3-tooltip
//////

@Component({
  selector: 'plan-drawing',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

 private svg;
 private offsetX: number;
 private offsetY: number;
 private width: number;
 @Input() private height: number;
 @Input() private data;

 @ViewChild('plan') private planContainer: ElementRef;
 @ViewChild('tooltip') private tooltipContainer: ElementRef;

  constructor() { }

  ngOnInit() {
    if(this.data){
      // this.data = this.reflectX(this.data);
      this.reflectY(this.data);
      this.createPlan();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.currentValue) {
      this.data = changes.data.currentValue;
      this.data = this.reflectY(this.data);
      // this.data = this.reflectX(changes.data.currentValue);
      if(this.svg){
        this.cleanPlan();
        this.attachData();
      }else{
        this.createPlan();
      }
    }
  }

  reflectY(data){
    // Reflects the X coordinate of the geoJSON object to mirror the plan horizontally
    // The reason is that SVG uses a coordinate system where origo is in the upper left corner
    for(var i in data.features){
      var feature = data.features[i];
      for(var j in feature){
        var polygons = feature[j].coordinates;
        for(var k in polygons){
          var coordinates = polygons[k];
          for(var l in coordinates){
            var coordinate = coordinates[l];
            var x = coordinate[0];
            var y = coordinate[1];
            // Reverse X coordinate
            data.features[i].geometry.coordinates[k][l][0] = x;
            data.features[i].geometry.coordinates[k][l][1] = -y;
          }
        }
      }
    }
    return data;
  }

  getScaleOffset(width,height) {
    // Get bounding box [xMin, yMin, xMax, yMax]
    var bb = geojsonExtent(this.data);

    // Calculate data size
    var dataWidth = bb[2]-bb[0];
    var dataHeight = bb[3]-bb[1];
    var dataCentroid = [dataWidth/2, dataHeight/2];

    // Calculate scale factors
    var scaleWidth = Math.max(dataWidth, width)/Math.min(dataWidth, width);
    var scaleHeight = Math.max(dataHeight, height)/Math.min(dataHeight, height);
    var scale = Math.min(scaleHeight,scaleWidth);

    // Calculate offset factors
    var canvasCentroid = [this.width/2, this.height/2];
    var offsetX = canvasCentroid[0]-scale*(bb[0]+dataCentroid[0]);
    var offsetY = canvasCentroid[1]-scale*(bb[1]+dataCentroid[1]);

    return [scale,offsetX,offsetY]
  }

  createPlan() {
    const element = this.planContainer.nativeElement;
    var margins = 20;
    this.width = element.clientWidth-margins;
    if(!this.height) this.height = 600;

    this.svg = d3.select(element).append('svg')
                  .attr('width', this.width)
                  .attr('height', this.height);
    
    this.attachData();
  }

  attachData(){
    // Get scale and offset factors for scaling and zooming to div extends
    var scaleOffset = this.getScaleOffset(this.width,this.height);

    // Scale function
    function scale (scaleFactor,offsetX,offsetY) {
      return d3.geoTransform({
        point: function(x, y) {
          this.stream.point( (x*scaleFactor+offsetX) , y*scaleFactor+offsetY);
        }
      });
    }

    // Path generator
    var path = d3.geoPath(null)
        .projection(scale(scaleOffset[0],scaleOffset[1],scaleOffset[2]));

    this.svg.append("g")
          .attr('class', 'rooms')
        .selectAll('path')
          .data(this.data.features)
        .enter().append('path')
          .attr('d', path)
          .attr('id', d => d.id)
          .attr('name', d => d.properties.name)
          .attr('class', 'room');
  }

  cleanPlan(){
    // Remove everything below the SVG element
    d3.selectAll("svg > *").remove();
  }

}
