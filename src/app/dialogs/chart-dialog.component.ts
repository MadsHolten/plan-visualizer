import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { RoomsService } from '../services/rooms.service';

@Component({
    selector: 'chart-dialog',
    templateUrl: './chart-dialog.component.html',
    styleUrls: ['./chart-dialog.component.css'],
    providers: [RoomsService]
})

export class ChartDialogComponent implements OnInit {
    
    title: string;
    inputString: string;
    description: string;
    inputText: string;

    // Plot data
    plotData: Array<any> = [];
    plotLabels: Array<any> = [];

    chartTypes = ['line','bar'];
    chartType = 'line';

    sensorIdent: string;

    constructor(
        public dialogRef: MatDialogRef<ChartDialogComponent>,
        private _rs: RoomsService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }
    
    ngOnInit(){
        this.title = this.data.title ? this.data.title : "Type input";
        this.description = this.data.description ? this.data.description : null;
        this.inputText = this.data.inputText ? this.data.inputText : "Input";

        this._rs.getTemperatureObservations(this.data.uri)
            .subscribe(res => {
                if(res.length > 0){
                    this.sensorIdent = 'hep';
                    var data = res.map(x => Number(x.value));
                    var labels = res.map(x => x.time);
                    this.plotData.push({data: data, label: "Temperature"});
                    this.plotLabels = labels;
                }
            });
    }

    changeChartType(){
        console.log(this.chartType);
    }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}