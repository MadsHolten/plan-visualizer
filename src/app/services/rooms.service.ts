import { Injectable } from '@angular/core';

import { TriplestoreService } from './triplestore.service';

export interface Level {
    uri: string;
    name: string;
}

@Injectable()
export class RoomsService  extends TriplestoreService {

    public getStoreys(){

        var q = `
            PREFIX bot:     <https://w3id.org/bot#>
            PREFIX props:   <https://w3id.org/props#>
            PREFIX seas:    <https://w3id.org/seas/>
            PREFIX opm:     <https://w3id.org/opm#>
            PREFIX schema:  <http://schema.org/>
            SELECT DISTINCT ?uri ?name
            WHERE {
            ?uri a bot:Storey ;
                props:identityDataName/seas:evaluation [
                    a opm:CurrentState ;
                    schema:value ?name
                ]
            }`;

        return this.getQuery(q)
                .map(res => {
                    let x: any = res;
                    return x.results.bindings.map(obj => {
                        var uri = obj.uri.value;
                        var name = obj.name.value;
                        return {uri: uri, name: name};
                    });
                });

    }

    public getBoundariesByLevel(uri){

        var q = `
            PREFIX bot:     <https://w3id.org/bot#>
            PREFIX seas:    <https://w3id.org/seas/>
            PREFIX opm:     <https://w3id.org/opm#>
            PREFIX schema:  <http://schema.org/>
            PREFIX props:   <https://w3id.org/props#>
            PREFIX geo:     <http://www.opengis.net/ont/geosparql#>
            SELECT DISTINCT ?uri ?name ?geometry2d
            WHERE {
                <${uri}> bot:hasSpace ?uri .
                ?uri props:identityDataName/seas:evaluation [
                        a opm:CurrentState ;
                        schema:value ?name
                    ] ;
                    props:spaceBoundary ?geometry2d .
            }`;

        return this.getQuery(q);
    }

}