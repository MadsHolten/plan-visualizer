import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { QueryService } from './query.service';
import { RoomsService } from './services/rooms.service';
import { ChartDialogComponent } from './dialogs/chart-dialog.component';

import * as parse from 'wellknown';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [QueryService, RoomsService]
})
export class AppComponent implements OnInit {

  public levels;   // Levels in dataset
  public selectedLevel;
  public query: string;
  public showQuery: boolean = false;
  public data;     // geoJSON to be sent to plan component

  constructor(
    private _qs: QueryService,
    private _rs: RoomsService,
    private _dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(){
    this.getLevels();
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
    this.snackBar.open(message, undefined {
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

      var properties = {name: name, uri: uri};
      var obj = {type: "Feature", id: uri, geometry: geometry2d, properties: properties};
      geoJSON.features.push(obj);
    });
    // console.log(JSON.stringify(geoJSON, null, 2));

    return geoJSON;
  }

}
