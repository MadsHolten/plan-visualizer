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

    sensorIdent: string;

    constructor(
        public dialogRef: MatDialogRef<ChartDialogComponent>,
        private _rs: RoomsService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }
    
    ngOnInit(){
        this.title = this.data.title ? this.data.title : "Type input";
        this.description = this.data.description ? this.data.description : null;
        this.inputText = this.data.inputText ? this.data.inputText : "Input";

        this._rs.getTemperatureSensorIdent(this.data.uri)
            .subscribe(res => {
                this.sensorIdent = res[0];
                console.log(res);
            });
    }

    // Close when clicking outside
    onNoClick(): void {
        this.dialogRef.close();
    }

}