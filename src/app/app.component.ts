import { Component, OnInit } from '@angular/core';
import { QueryService } from './query.service';

import * as parse from 'wellknown';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [QueryService]
})
export class AppComponent implements OnInit {

  private levels;   // Levels in dataset
  private selectedLevel;
  private query: string;
  private data;     // geoJSON to be sent to plan component

  constructor(
    private _qs: QueryService
  ) {}

  triples = `
@prefix bot:      <https://w3id.org/bot#> .
@prefix rdfs:     <http://www.w3.org/2000/01/rdf-schema#> .
@prefix rvt:      <https://example.org/rvt#> .
@prefix cdt:      <http://w3id.org/lindt/custom_datatypes#> .
@prefix nir:  	  <https://Niras.dk/XXXX#> .
@prefix prop:     <https://w3id.org/prop#> .
@prefix geo:      <http://www.opengis.net/ont/geosparql#> .

# STOREYS
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> a bot:Storey .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> rdfs:label "Level 1" .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> a bot:Storey .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> rdfs:label "Level 2" .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/052baddb-ec77-457a-8fe9-c10a6a5858da-00020e96> a bot:Storey .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/052baddb-ec77-457a-8fe9-c10a6a5858da-00020e96> rdfs:label "T/FDN" .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/25950afa-f028-4e7a-9994-e1ed964bb928-0002132b> a bot:Storey .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/25950afa-f028-4e7a-9994-e1ed964bb928-0002132b> rdfs:label "Roof" .

# SPACES
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f> rdfs:label "Living Room A102" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f> nir:space_area" 30141645,2499999 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f> nir:space_volumen" 71390689708,9998 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2> rdfs:label "Kitchen A103" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2> nir:space_area" 13897500,9999999 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2> nir:space_volumen" 33512179089,9997 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5> rdfs:label "Bathroom 1 A104" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5> nir:space_area" 3997752,00000005 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5> nir:space_volumen" 8177444912,00012 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8> rdfs:label "Foyer A101" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8> nir:space_area" 17936236,7499998 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8> nir:space_volumen" 40241253701,9994 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1> rdfs:label "Hallway A201" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1> nir:space_area" 7799954,69999988 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1> nir:space_volumen" 18115464263,001 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5> rdfs:label "Bathroom 2 A204" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5> nir:space_area" 5415819,4013112 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5> nir:space_volumen" 12240220859,4189 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8> rdfs:label "Bedroom 2 A203" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8> nir:space_area" 26177994,25 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8> nir:space_volumen" 56893581792,0039 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb> rdfs:label "Bedroom 1 A202" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb> nir:space_area" 26119314,25 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb> nir:space_volumen" 56893581792,0039 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe> rdfs:label "Living Room B102" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe> nir:space_area" 30141645,25 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe> nir:space_volumen" 71390689708,9999 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201> rdfs:label "Kitchen B103" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201> nir:space_area" 13897500,9999998 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201> nir:space_volumen" 33512179089,9995 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204> rdfs:label "Bathroom 1 B104" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204> nir:space_area" 3997752,00000007 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204> nir:space_volumen" 8177444912,00017 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207> rdfs:label "Foyer B101" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207> nir:space_area" 17936236,7499999 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207> nir:space_volumen" 40241253701,9999 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d> rdfs:label "Hallway B201" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d> nir:space_area" 7799954,69999998 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d> nir:space_volumen" 18115464263,0012 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211> rdfs:label "Bathroom 2 B204" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211> nir:space_area" 5441473,05868456 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211> nir:space_volumen" 12301076335,7825 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214> rdfs:label "Bedroom 2 B203" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214> nir:space_area" 26177994,25 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214> nir:space_volumen" 56893581792,0039 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217> rdfs:label "Bedroom 1 B202" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217> rvt:guid "0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217> nir:space_area" 26119314,2499998 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217> nir:space_volumen" 56893581792,0035 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a> rdfs:label "Utility A205" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a> rvt:guid "aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a> nir:space_area" 1754048,59868888 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a> nir:space_volumen" 3672064308,58246 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79> rdfs:label "Utility B205" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79> rvt:guid "aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79> nir:space_area" 1728394,94131539 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79> nir:space_volumen" 3611208832,21851 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e> rdfs:label "Stair A105" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e> rvt:guid "40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e> nir:space_area" 4922172,50000002 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e> nir:space_volumen" 20796062240,0008 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781> rdfs:label "Room B105" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781> rvt:guid "40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781> nir:space_area" 4922172,50000005 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781> nir:space_volumen" 20796062240,0008 cm3"^^cdt:volumemm3  .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925> a bot:Space .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925> rdfs:label "Roof R301" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925> rvt:guid "335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925" .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925> nir:space_area" 145721689 mm2 "^^cdt:ucum .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925> nir:space_volumen" 405453467999,999 cm3"^^cdt:volumemm3  .

# ROOMS AT EACH STOREY
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/458c0e49-01bb-11d5-9302-0000863f27ad-000002b6> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/e3e052f9-0156-11d5-9301-0000863f27ad-00000137> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781> .
<https://forge-sparql.herokuapp.com/projects/P000001/Levels/25950afa-f028-4e7a-9994-e1ed964bb928-0002132b> bot:hasSpace <https://forge-sparql.herokuapp.com/projects/P000001/Rooms/335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925> .

# ROOM BOUNDARIES
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ff9f> prop:spaceBoundary "POLYGON((0.2085 -17.5915, 6.262 -17.5915, 6.262 -13.8, 6.2 -13.8, 6.2 -12.6, 6.0882304 -12.6, 0.2085 -12.6, 0.2085 -17.5915))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa2> prop:spaceBoundary "POLYGON((0.2085 -10.294, 0.2085 -12.6, 6.226 -12.6, 6.226 -10.995, 6.288 -10.995, 6.288 -10.308, 4.694 -10.308, 4.694 -10.294, 0.2085 -10.294))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa5> prop:spaceBoundary "POLYGON((6.288 -7.8, 4.694 -7.8, 4.694 -10.294, 4.694 -10.308, 6.288 -10.308, 6.288 -7.8))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffa8> prop:spaceBoundary "POLYGON((8.5915 -17.5915, 8.5915 -11.825, 7.3686 -11.825, 7.3686 -7.8, 6.288 -7.8, 6.288 -10.308, 6.288 -10.995, 6.226 -10.995, 6.226 -12.4622304, 6.226 -12.6, 6.2 -12.6, 6.2 -13.8, 6.262 -13.8, 6.262 -17.5915, 8.5915 -17.5915))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb1> prop:spaceBoundary "POLYGON((8.5915 -8.075, 8.5915 -6.188, 6.356 -6.188, 6.356 -6.728, 6.356 -7.78338423507, 6.356 -11.042, 6.356 -11.612, 7.3686 -11.612, 7.3686 -8.075, 8.5915 -8.075))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb5> prop:spaceBoundary "POLYGON((6.356 -11.042, 6.356 -7.78338423507, 4.694 -7.78338423507, 4.694 -11.042, 6.356 -11.042))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffb8> prop:spaceBoundary "POLYGON((4.4 -11.042, 4.4 -11.072, 4.4 -17.5915, 8.5915 -17.5915, 8.5915 -11.612, 7.3686 -11.612, 6.356 -11.612, 6.356 -11.042, 4.694 -11.042, 4.4 -11.042))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0002ffbb> prop:spaceBoundary "POLYGON((4.4 -0.2085, 4.4 -6.728, 4.694 -6.728, 6.356 -6.728, 6.356 -6.188, 8.5915 -6.188, 8.5915 -0.2085, 4.4 -0.2085))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-000301fe> prop:spaceBoundary "POLYGON((8.5915 -0.2085, 2.538 -0.2085, 2.538 -4.0, 2.6 -4.0, 2.6 -5.2, 2.7117696 -5.2, 8.5915 -5.2, 8.5915 -0.2085))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030201> prop:spaceBoundary "POLYGON((8.5915 -7.506, 8.5915 -5.2, 2.574 -5.2, 2.574 -6.805, 2.512 -6.805, 2.512 -7.492, 4.106 -7.492, 4.106 -7.506, 8.5915 -7.506))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030204> prop:spaceBoundary "POLYGON((2.512 -7.492, 2.512 -10.0, 4.106 -10.0, 4.106 -7.506, 4.106 -7.492, 2.512 -7.492))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030207> prop:spaceBoundary "POLYGON((2.538 -0.2085, 0.2085 -0.2085, 0.2085 -5.975, 1.4314 -5.975, 1.4314 -10.0, 2.512 -10.0, 2.512 -7.492, 2.512 -6.805, 2.574 -6.805, 2.574 -5.3377696, 2.574 -5.2, 2.6 -5.2, 2.6 -4.0, 2.538 -4.0, 2.538 -0.2085))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-0003020d> prop:spaceBoundary "POLYGON((0.2085 -9.725, 0.2085 -11.612, 2.444 -11.612, 2.444 -11.072, 2.444 -10.0320511785, 2.444 -6.758, 2.444 -6.188, 1.4314 -6.188, 1.4314 -9.725, 0.2085 -9.725))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030211> prop:spaceBoundary "POLYGON((2.444 -6.758, 2.444 -10.0320511785, 4.106 -10.0320511785, 4.106 -6.758, 2.444 -6.758))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030214> prop:spaceBoundary "POLYGON((4.4 -6.728, 4.4 -0.2085, 0.2085 -0.2085, 0.2085 -6.188, 1.4314 -6.188, 2.444 -6.188, 2.444 -6.758, 4.106 -6.758, 4.4 -6.758, 4.4 -6.728))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/0b74b3fa-1a92-405e-9ac9-d59067bce2dd-00030217> prop:spaceBoundary "POLYGON((4.4 -17.5915, 4.4 -11.072, 4.106 -11.072, 2.444 -11.072, 2.444 -11.612, 0.2085 -11.612, 0.2085 -17.5915, 4.4 -17.5915))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f6a> prop:spaceBoundary "POLYGON((6.356 -7.78338423507, 6.356 -6.728, 4.694 -6.728, 4.694 -7.78338423507, 6.356 -7.78338423507))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/aa6e13ea-b5bc-4245-93bf-8b2355872cb5-00031f79> prop:spaceBoundary "POLYGON((2.444 -10.0320511785, 2.444 -11.072, 4.106 -11.072, 4.106 -10.0320511785, 2.444 -10.0320511785))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-0003364e> prop:spaceBoundary "POLYGON((8.5915 -11.825, 8.5915 -7.8, 7.3686 -7.8, 7.3686 -11.825, 8.5915 -11.825))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/40c2d70d-8d3b-49a9-9702-6756a4ed76b3-00033781> prop:spaceBoundary "POLYGON((0.2085 -5.975, 0.2085 -10.0, 1.4314 -10.0, 1.4314 -5.975, 0.2085 -5.975))"^^geo:wktLiteral .
<https://forge-sparql.herokuapp.com/projects/P000001/Rooms/335fc1b3-63ca-474d-9c21-6d5abbdb0485-00033925> prop:spaceBoundary "POLYGON((8.5915 -0.2085, 0.2085 -0.2085, 0.2085 -17.5915, 8.5915 -17.5915, 8.5915 -0.2085))"^^geo:wktLiteral .
`
  ngOnInit(){
    this.getLevels().then(levels => {
      // Choose first item as the selected level
      this.selectedLevel = levels[0].uri;

      this.query = this._getGeometryQuery(this.selectedLevel);
      
      // Query for the plan geometry
      return this._qs.doQuery(this.query, this.triples);
    })
    .then(res => {
      if(res){
        this.data = this._resToGeoJSON(res);
      }
    })
    .catch(err => console.log(err));
  }

  getLevels(): Promise<any>{
    var q = `
        PREFIX bot:      <https://w3id.org/bot#>
        PREFIX rdfs:     <http://www.w3.org/2000/01/rdf-schema#>
        SELECT DISTINCT ?uri ?label
        WHERE {
          ?uri a bot:Storey ;
            rdfs:label ?label .
        }`;
    return this._qs.doQuery(q, this.triples)
          .then(res => {
            if(res){
              var levels = _.map(res.results.bindings, obj => {
                return _.mapValues(obj, x => x.value);
              });
              this.levels = levels;

              // Return levels
              return this.levels;
            }
          });
  }

  onLevelChange(uri){
    this.selectedLevel = uri;

    // Update query
    this.query = this._getGeometryQuery(this.selectedLevel);

    // Update plan geometry
    this._qs.doQuery(this.query, this.triples)
          .then(res => {
            if(res){
              this.data = this._resToGeoJSON(res);
            }
          })
          .catch(err => console.log(err));
  }

  private _getGeometryQuery(levelURI){
    return `
PREFIX bot:      <https://w3id.org/bot#>\n
PREFIX rdfs:     <http://www.w3.org/2000/01/rdf-schema#>\n
PREFIX prop:     <https://w3id.org/prop#>\n
PREFIX geo:      <http://www.opengis.net/ont/geosparql#>\n\n
SELECT DISTINCT ?uri ?name ?geometry2d\n
WHERE {\n
\t<${levelURI}> bot:hasSpace ?uri .\n
\t?uri a bot:Space ;\n
\t\trdfs:label ?name ;\n
\t\tprop:spaceBoundary ?geometry2d .\n
}`;
  }

  private _resToGeoJSON(res){
    var data = res.results.bindings;
    var geoJSON = {type: "FeatureCollection", features: []};

    _.each(res.results.bindings, d => {
      var uri: string = d.uri.value;
      var name: string = d.name.value;
      var geometry2d: string = parse(d.geometry2d.value);

      var properties = {name: name};
      var obj = {type: "Feature", id: uri, geometry: geometry2d, properties: properties};
      geoJSON.features.push(obj);
    });

    return geoJSON;
  }

}
