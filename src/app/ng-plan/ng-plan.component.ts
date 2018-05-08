import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as geojsonExtent from 'geojson-extent';

export interface Room {
    name: string;
    polygons: string[];
}

@Component({
    selector: 'ng-plan',
    templateUrl: './ng-plan.component.html',
    styleUrls: ['./ng-plan.component.css']
})
export class NgPlanComponent implements AfterViewInit {

    @Input() private data;  //geoJSON
    private rooms;

    // Canvas
    private canvasWidth;
    private canvasHeight;
    private canvasCentroid;

    // Geometry
    private geometryWidth;
    private geometryHeight;
    private geometryCentroid;
    private xMax;
    private xMin;
    private yMax;
    private yMin;

    // Scale / offset
    private scale = 1;
    private offsetX = 0;
    private offsetY = 0;

    // Modes
    private dragMode: boolean = false;
    private mouseDown: boolean = false;

    // Move geometry
    private clickX: number;
    private clickY: number;
    private transform = 'translate(0,0)';
    private movedX: number = 0; // store move state
    private movedY: number = 0; // store move state

    @ViewChild('canvas') private planContainer: ElementRef;

    constructor() { }

    ngAfterViewInit(){
        this.getCanvasSize();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data.currentValue) {
            this.data = changes.data.currentValue;
            this.extractRooms();
            this.zoomExtends();
        }
    }

    getCanvasSize(){
        const element = this.planContainer.nativeElement;
        const size = element.getBoundingClientRect();
        this.canvasWidth = size.width;
        this.canvasHeight = size.height;
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

                        // Offset to fit
                        x = x+this.offsetX;
                        y = y+this.offsetY;

                        // Scale
                        x = x*this.scale;
                        y = y*this.scale;

                        if(!this.xMax || x > this.xMax) this.xMax = x;
                        if(!this.xMin || x < this.xMin) this.xMin = x;
                        if(!this.yMax || y > this.yMax) this.yMax = y;
                        if(!this.yMin || y < this.yMin) this.yMin = y;
                        points+= `${x},${y} `;
                    })
                    points = points.trim();    // remove last space
                    polygons.push(points);
                });
            }
            var name = room.properties.name;
            return {name: name, polygons: polygons}
        });

        // Save geometry data
        this.geometryWidth = this.xMax - this.xMin;
        this.geometryHeight = this.yMax - this.yMin;
    }

    setTransform(x,y){
        x = this.movedX + x;
        y = this.movedY + y;
        this.transform = `translate(${x},${y})`;
    }

    zoomExtends(){
        var factorX = this.canvasWidth/this.geometryWidth;
        var factorY = this.canvasHeight/this.geometryHeight;
        this.scale = Math.min(factorX,factorY);

        this.geometryCentroid = [this.xMin+this.geometryWidth/2, this.yMin+this.geometryHeight/2];
        this.canvasCentroid = [this.canvasWidth/2, this.canvasHeight/2];

        this.offsetX = this.canvasCentroid[0]-this.geometryCentroid[0];
        this.offsetY = this.canvasCentroid[1]-this.geometryCentroid[1];

        this.extractRooms();
    }

    /**
     * MOUSE EVENTS
     */

    //Alt = activate drag mode
    @HostListener('document:keydown', ['$event'])
    onKeyDown(ev:KeyboardEvent){
        if(ev.key == "Alt"){
            this.dragMode = true;
        }
        if(ev.key == "Esc"){
            this.dragMode = false;
        }
    }
    @HostListener('document:keyup', ['$event'])
    onKeyUp(ev:KeyboardEvent) {
        if(ev.key == "Alt"){
            this.dragMode = false;
        }
    }

    @HostListener('mousedown', ['$event'])
    onMouseClick(ev) {

        this.mouseDown = true;

        // enable drag mode if clicking middle button
        if(ev.button == 1) this.dragMode = true;

        if(this.dragMode){
            this.clickX = ev.offsetX;
            this.clickY = ev.offsetY;
        }
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(ev) {
        if(this.dragMode && this.mouseDown){
            var offsetX = ev.offsetX-this.clickX;
            var offsetY = ev.offsetY-this.clickY;

            this.setTransform(offsetX,offsetY);
        }
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(ev) {
        this.mouseDown = false;
        if(ev.button == 1) this.dragMode = false;

        // Store new move position
        this.movedX = this.movedX+ev.offsetX-this.clickX;
        this.movedY = this.movedY+ev.offsetY-this.clickY;
    }

}