import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as geojsonExtent from 'geojson-extent';
import * as d3 from 'd3-decompose';  // takes SVG or CSS3 transform strings and converts them into usable values

export interface Room {
    name: string;
    polygons: string[];
}

@Component({
    selector: 'ng-plan',
    templateUrl: './plan.component.html',
    styleUrls: ['./plan.component.css']
})
export class PlanComponent implements AfterViewInit {

    @Output() clickedRoom = new EventEmitter();

    @Input() private data;  //geoJSON
    public rooms;

    private selectedRoom;

    // Canvas
    private canvasWidth;
    private canvasHeight;
    private canvasCentroid;

    // Scale / offset
    // These factors are calculated from geometry extends
    private baseScale = 0.9;
    private baseOffsetX = 0;
    private baseOffsetY = 0;

    // geometry
    public panMode: boolean = false;
    private transform = `translate(${this.baseOffsetX},${this.baseOffsetY}) scale(${this.baseScale},${this.baseScale})`;
    private movedX: number = 0; // store move state
    private movedY: number = 0; // store move state
    private scaled: number = 1 // store scale state

    @ViewChild('canvas') private planContainer: ElementRef;

    constructor() { }

    ngAfterViewInit(){
        this.getCanvasSize();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data.currentValue) {
            this.data = changes.data.currentValue;
            this.getScaleOffset();
            this.extractRooms();
            this.zoomExtends();
            this.move([0,0]);
        }
    }

    getCanvasSize(){
        const element = this.planContainer.nativeElement;
        const size = element.getBoundingClientRect();
        this.canvasWidth = size.width;
        this.canvasHeight = size.height;
        this.canvasCentroid = [this.canvasWidth/2, this.canvasHeight/2];        
    }

    extractRooms(){
        this.rooms = this.data.features.map(room => {
            var polygons = [];

            if(room.geometry.type == "Polygon"){
                room.geometry.coordinates.forEach(polygon => {
                    var points = '';
                    polygon.forEach(coordinate => {
                        var x = coordinate[0];
                        var y = -coordinate[1]; // reflect since SVG uses reflected coordinate system

                        // Scale
                        // x = x*this.baseScale;
                        // y = y*this.baseScale;

                        points+= `${x},${y} `;
                    })
                    points = points.trim();    // remove last space
                    polygons.push(points);
                });
            }
            var name = room.properties.name;
            var uri = room.properties.uri;
            return {name: name, uri: uri, polygons: polygons}
        });

    }

    getScaleOffset() {
        // Get bounding box [xMin, yMin, xMax, yMax]
        var bb = geojsonExtent(this.data);
    
        // Calculate data size
        var dataWidth = bb[2]-bb[0];
        var dataHeight = bb[3]-bb[1];

        // Calculate scale factors
        var scaleWidth = this.canvasWidth/dataWidth;
        var scaleHeight = this.canvasHeight/dataHeight;
        var scale = Math.min(scaleHeight,scaleWidth);

        var scaledDataCentroid = [scale*(bb[0]+dataWidth/2), scale*(bb[1]+dataHeight/2)];
    
        // Calculate offset factors
        var offsetX = this.canvasCentroid[0]-scaledDataCentroid[0];
        var offsetY = this.canvasCentroid[1]+scaledDataCentroid[1];

        // Set global variables
        this.baseOffsetX = offsetX;
        this.baseOffsetY = offsetY;
        this.baseScale = scale;
    
        return [scale,offsetX,offsetY]
    }

    move(displacement){
        var x = displacement[0];
        var y = displacement[1];

        if(!isNaN(x) && !isNaN(y)){
            x = this.baseOffsetX + this.movedX + x;
            y = this.baseOffsetY + this.movedY + y;

            var oldTrns = d3.decompose(this.transform).translate;
            var newTrns = `translate(${x},${y})`;
            this.transform = this.transform.replace(oldTrns, newTrns);
        }
    }

    moveEnd(displacement){
        // Update moved coordinates
        this.movedX = this.movedX+displacement[0];
        this.movedY = this.movedY+displacement[1];
    }

    zoomExtends(){
        this.scaled = this.baseScale*0.95;
        var oldScale = d3.decompose(this.transform).scale;
        var newScale = `scale(${this.scaled},${this.scaled})`;
        this.transform = this.transform.replace(oldScale, newScale);
    }

    zoomOut(){
        var scaleFactor = this.baseScale/20;
        this.scaled = this.scaled-scaleFactor;
        var oldScale = d3.decompose(this.transform).scale;
        var newScale = `scale(${this.scaled},${this.scaled})`;
        this.transform = this.transform.replace(oldScale, newScale);
    }

    zoomIn(){
        var scaleFactor = this.baseScale/20;
        this.scaled = this.scaled+scaleFactor;
        var oldScale = this.transform.match(/\([^\)]+\)/g)[1];
        var newScale = `(${this.scaled},${this.scaled})`;
        this.transform = this.transform.replace(oldScale, newScale);
    }

    selectRoom(ev){
        this.clickedRoom.emit(ev);
        this.selectedRoom = ev;
    }

}