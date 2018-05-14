import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TriplestoreService } from './triplestore.service';

import * as moment from 'moment';

export interface Level {
    uri: string;
    name: string;
}

@Injectable()
export class SensorsService  extends TriplestoreService {

    public getSpaceSensors(spaceURI): Observable<Object[]>{

        const q = `
        PREFIX bot: 	<https://w3id.org/bot#>
        PREFIX rdf: 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX seas: 	<https://w3id.org/seas/>
        PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX dog: 	<http://elite.polito.it/ontologies/dogont.owl#>
        PREFIX skos: 	<http://www.w3.org/2004/02/skos/core#>
        PREFIX sosa:	<http://www.w3.org/ns/sosa/>
         
        SELECT ?uri ?sensorId
        WHERE{
          BIND(<${spaceURI}> AS ?archSpace)
          ?space skos:related ?archSpace ;
            bot:containsElement ?uri .
          ?uri seas:connectsAt/dcterms:identifier ?sensorId .
        }`;

        return this.getQuery(q)
                .map(res => {
                    let x: any = res;
                    return x.results.bindings.map(obj => {
                        var name = obj.sensorId.value;
                        var uri = obj.uri.value;
                        return {name: name, uri: uri};
                    });
                });

    }

    public getSensorObservations(sensorURI){
        
        const q = `
        PREFIX bot: 	<https://w3id.org/bot#>
        PREFIX seas: 	<https://w3id.org/seas/>
        PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX dog: 	<http://elite.polito.it/ontologies/dogont.owl#>
        PREFIX skos: 	<http://www.w3.org/2004/02/skos/core#>
        PREFIX sosa:	<http://www.w3.org/ns/sosa/>
        PREFIX om:	    <http://www.ontology-of-units-of-measure.org/resource/om-2/>
            
        SELECT ?time ?value
        WHERE{
            BIND(<${sensorURI}> AS ?sensor)

            # Observation
            ?obs sosa:madeBySensor | sosa:actuationMadeBy ?sensor ;
            sosa:hasResult/om:hasNumericalValue ?value ;
            sosa:resultTime ?time .
        }
        ORDER BY ?time`;

        return this.getQuery(q)
                .map(res => {
                    let x: any = res;
                    return x.results.bindings.map(obj => {
                        var time = obj.time.value;
                        var value = obj.value.value;
                        return {time: time, value: value}
                    });
                });

    }

    public getTemperatureObservations(spaceURI){

        const q = `
        PREFIX bot: 	<https://w3id.org/bot#>
        PREFIX seas: 	<https://w3id.org/seas/>
        PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX dog: 	<http://elite.polito.it/ontologies/dogont.owl#>
        PREFIX skos: 	<http://www.w3.org/2004/02/skos/core#>
        PREFIX sosa:	<http://www.w3.org/ns/sosa/>
        PREFIX om:	    <http://www.ontology-of-units-of-measure.org/resource/om-2/>
         
        SELECT ?time ?value
        WHERE{
          BIND(<${spaceURI}> AS ?archSpace)

          # Get sensor
          ?space skos:related ?archSpace ;
            bot:containsElement ?tempSensor .
          ?tempSensor a dog:TemperatureSensor .

          # Observation
          ?obs sosa:madeBySensor | sosa:actuationMadeBy ?tempSensor ;
            sosa:hasResult/om:hasNumericalValue ?value ;
            sosa:resultTime ?time .
        }
        ORDER BY ?time`;

        return this.getQuery(q)
                .map(res => {
                    let x: any = res;
                    return x.results.bindings.map(obj => {
                        var time = obj.time.value;
                        var value = obj.value.value;
                        return {time: time, value: value}
                    });
                });

    }

}