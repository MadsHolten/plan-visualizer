import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

import { QueryService } from './query.service';
import { RoomsService } from './services/rooms.service';
import { SensorsService } from './services/sensors.service';
import { ChartDialogComponent } from './dialogs/chart-dialog.component';

import * as parse from 'wellknown';
import * as _ from 'lodash';
import * as d3 from 'd3-scale';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [QueryService, RoomsService, SensorsService]
})
export class AppComponent implements OnInit {

  public levels;   // Levels in dataset
  public selectedLevel;
  public query: string;
  public showQuery: boolean = false;
  public data;     // geoJSON to be sent to plan component
  public colors;   // color schema to be sent to plan component

  constructor(
    private _qs: QueryService,
    private _rs: RoomsService,
    private _ss: SensorsService,
    private _dialog: MatDialog,
    public snackBar: MatSnackBar,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(){
    this.getLevels();
    this.addSVGicons();
  }

  addSVGicons(){
    this.matIconRegistry.addSvgIcon(
      "zoom_extents",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/zoom_extents.svg")
    );
  }

  getLevels(){

    this._rs.getStoreysWithSpaces()
        .subscribe(x => {
          if(x.length > 0){
            this.levels = x;
            
            // Show first level by default
            this.onLevelChange(x[0].uri);
          }else{
            this.showSnackBar('Could not find any spaces with a 2D space boundary defined');
          }
        }, err => console.log(err));

  }

  onLevelChange(uri){
    this.selectedLevel = uri;

    // Get level
    this._rs.getBoundariesByLevel(this.selectedLevel)
          .subscribe(res => {
            if(res){

              // Convert from WKT to geoJSON
              this.data = this._resToGeoJSON(res);

              // this.showQuery = true;
            }else{
              this.showSnackBar('Could not load 2D space boundaries from the chosen level');
            }
          }, err => console.log(err));

    // Get max temperatures
    this._ss.getRoomMaxTemperaturesAtStorey(this.selectedLevel)
          .subscribe(res => {
            if(res){
              var range = res.map(x => Number(x.value.value));
              var color_scale = d3.scaleLinear().domain([15, 30]).range(['#fee8c8', '#e34a33']);
              this.colors = res.map(x => {
                var uri = x.uri.value;
                var value = x.value.value;
                var color = color_scale(value);
                return {uri: uri, value: value, color:color};
              })
            }
          })
  }

  showSpaceDialog(space){
    let dialogRef = this._dialog.open(ChartDialogComponent, {
      height: '600px',
      width: '800px',
      data: {
        title: `${space.name} measurements`,
        uri: space.uri,
        description: "This is just a test.",
        inputText: "URI"}
    });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 2000,
    });
  }

  private _resToGeoJSON(res){
    var data = res.results.bindings;
    var geoJSON = {type: "FeatureCollection", features: []};

    _.each(res.results.bindings, d => {
      var uri: string = d.uri.value;
      var name: string = d.name.value;
      var geometry2d: string = parse(d.geometry2d.value);

      var properties = {name: name, uri: uri, color: '#eee'};
      var obj = {type: "Feature", id: uri, geometry: geometry2d, properties: properties};
      geoJSON.features.push(obj);
    });

    return geoJSON;
  }

}
