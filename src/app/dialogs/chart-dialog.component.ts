import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { SensorsService } from '../services/sensors.service';

import * as moment from 'moment';

@Component({
    selector: 'chart-dialog',
    templateUrl: './chart-dialog.component.html',
    styleUrls: ['./chart-dialog.component.css'],
    providers: [SensorsService]
})

export class ChartDialogComponent implements OnInit {
    
    title: string;
    inputString: string;
    description: string;
    inputText: string;

    // Sensors in space
    sensors: Object[];
    sensor: any;     // selected sensor

    // Plot data
    rawData: Array<any> = [];
    plotData: Array<any> = [];
    plotLabels: Array<any> = [];

    chartTypes = ['line','bar'];
    chartType = 'line';

    // Range slider
    dateLabels;
    fromDate;
    toDate;
    fromIndex;
    toIndex;

    constructor(
        public dialogRef: MatDialogRef<ChartDialogComponent>,
        private _ss: SensorsService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }
    
    ngOnInit(){

        this.title = this.data.title ? this.data.title : "Type input";
        this.description = this.data.description ? this.data.description : null;
        this.inputText = this.data.inputText ? this.data.inputText : "Input";

        this._ss.getSpaceSensors(this.data.uri)
            .subscribe(res => {
                if(res.length > 0){
                    let x: any = res;
                    this.sensors = x;

                    // default to first in list and get the associated data
                    this.sensor = x[0];
                    this.getSensorObservations(this.sensor)
                }
            });
    }

    getSensorObservations(sensor){
        this._ss.getSensorObservations(sensor.uri)
            .subscribe(res => {
                if(res.length > 0){
                    this.rawData = res;
                    this.processData();
                }
            });
    }

    processData(){

        var raw;

        // filter by range if defined
        if(this.toDate || this.fromDate){
            raw = this.filterToFrom();
        }else{
            raw = this.rawData;
        }

        console.log(raw);

        var data: Array<any> = raw.map(x => Number(x.value));
        var labels: Array<any> = raw.map(x => x.time);

        if(data.length > 200){
            var divider = Math.ceil(data.length/200);
            data = data.filter((value, index, Arr) => index % divider == 0);
            labels = labels.filter((value, index, Arr) => index % divider == 0);
        }
        
        // define labels
        this.plotLabels = labels;

        // override range labels and preselection if not already defined
        if(!this.dateLabels){
            this.dateLabels = labels.map(x => moment(x).format('LL'));
            this.fromDate = this.dateLabels[0];
            this.toDate = this.dateLabels[this.dateLabels.length-1];
        }

        this.plotData[0] = {data: data, label: this.sensor.name};

    }

    changeChartType(type){
        this.chartType = type;
    }

    filterToFrom(){
        return this.rawData.filter(obj => {
            if(obj.time > this.toDate) return false;
            if(obj.time < this.fromDate) return false;
            return true;
        });
    }

    applyRange(range){
        this.fromDate = this.plotLabels[range.from];
        this.toDate = this.plotLabels[range.to];
        this.fromIndex = range.from;
        this.toIndex = range.to;

        this.processData();
    }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}