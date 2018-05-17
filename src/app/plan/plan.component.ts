import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as geojsonExtent from 'geojson-extent';
import * as d3 from 'd3-decompose';  // takes SVG or CSS3 transform strings and converts them into usable values
import * as d3p from 'd3-polygon';   // Operations on polygons

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
    @Input() private colors;  //color schema
    @Input() private centroids: boolean;  //color schema
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
    private transform = `translate(${this.baseOffsetX},${this.baseOffsetY}) scale(${this.baseScale},${this.baseScale})`;
    private movedX: number = 0; // store move state
    private movedY: number = 0; // store move state
    private scaled: number = 1 // store scale state

    // modes
    public panMode: boolean = false;
    public addNodeMode: boolean = false;

    @ViewChild('canvas') private planContainer: ElementRef;

    constructor() { }

    ngAfterViewInit(){
        this.getCanvasSize();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data && changes.data.currentValue) {
            this.data = changes.data.currentValue;
            this.extractRooms();
            this.getScaleOffset();
            this.zoomExtents();
            this.move([0,0]);
        }
        if (changes.colors && changes.colors.currentValue){
            this.defineColors();
        }
    }

    addNode(ev, room){

        var scale = this.scaled;
        var offsetX = this.baseOffsetX+this.movedX;
        var offsetY = this.baseOffsetY+this.movedY;
        var screenX = ev.offsetX;
        var screenY = ev.offsetX;

        var x = (screenX-offsetX)/scale;
        var y = (screenY-offsetY)/scale;
        var coordinates = [x,-y];

        console.log('Coordinates: '+coordinates);
        console.log('Room: '+room.uri);
    }

    defineColors(){
        console.log(this.colors)
        this.rooms.map(x => {
            var match = this.colors.filter(y => y.uri == x.uri);
            if(match.length > 0){
                x.color = match[0].color;
                x.description = match[0].value;
            }
            return x;
        });
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
            var centroid;
            if(room.geometry.type == "Polygon"){
                room.geometry.coordinates.forEach(polygon => {

                    var points = '';
                    // Reflect y coordinates to fit browser coordinate system and extract to polygon
                    polygon.map(coordinate => {
                        var x = coordinate[0];
                        var y = -coordinate[1]; // reflect since SVG uses reflected coordinate system

                        points+= `${x},${y} `;
                        coordinate[1] = y; // Update polygon with new y
                        return coordinate;
                    })
                    points = points.trim();    // remove last space

                    // Get polygon centroid
                    centroid = d3p.polygonCentroid(polygon);

                    polygons.push(points);
                });
            }
            var name = room.properties.name;
            var uri = room.properties.uri;
            var color = room.properties.color;
            var description = '';
            return {name: name, uri: uri, description: description, color: color, polygons: polygons, centroid: centroid}
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
        var offsetY = this.canvasCentroid[1]-scaledDataCentroid[1];

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

    onWindowResize(){
        this.getCanvasSize();
        this.getScaleOffset();
        this.zoomExtents();
        this.move([0,0]);
    }

    zoomExtents(){
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