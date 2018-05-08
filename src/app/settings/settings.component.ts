import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

// Services
import { ProjectSettingsService } from '../services/project-settings.service';

export interface ProjectSettings {
  endpoint: string;
  username?: string;
  password?: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [ ProjectSettingsService ]
})
export class SettingsComponent implements OnInit {

  panelOpenState: boolean = false;
  projectSettings: ProjectSettings = {endpoint: ''};
  loading: boolean;
  loadingMessage: string;

  @Input() triples: string;

  constructor(
    private _pss: ProjectSettingsService
  ) { }

  ngOnInit() {
    // Get data from local storage
    var data = this._pss.getTriplestoreSettings();
    if(data){
      this.projectSettings = data;
    }else{
      this.projectSettings.endpoint = "http://localhost:5820/test"; //default
      this.projectSettings.username = "admin"; //default
      this.projectSettings.password = "admin"; //default
    }
  }

  onDataChange(){
    // Save to localstore
    this._pss.saveTriplestoreSettings(this.projectSettings);
  }

}