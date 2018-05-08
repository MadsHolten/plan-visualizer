import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-store';
import { HttpClient }   from '@angular/common/http';

// Interface
import { ProjectSettings } from '../settings/settings.component';

@Injectable()
export class ProjectSettingsService {

  public endpointSettings: ProjectSettings;

  constructor(
    public lss: LocalStorageService
  ) { }

  public saveTriplestoreSettings(object: ProjectSettings) {
    // Save object to {prefix}endpointSettings
    this.lss.set('EndpointSettings', object);
  }

  public getTriplestoreSettings() {
    // Get object from {prefix}endpointSettings
    this.endpointSettings = this.lss.get('EndpointSettings');
    return this.endpointSettings;
  }

}