/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*  Query of Asset
*  Queries for a specific Asset using a pre-defined query, built from vehicle-lifecycle-network
*  - Example test round (txn <= testAssets)
*      {
*        "label" : "vehicle-lifecycle-network",
*        "txNumber" : [50],
*        "rateControl" : [{"type": "fixed-rate", "opts": {"tps" : 10}}],
*        "arguments": {"testAssets": 10, "testMatches": 5},
*        "callback" : "benchmark/composer/composer-micro/query-asset.js"
*      }
*  - Init: 
*    - Test specified number of Assets created, with color RED (based on how many matches in the query to return), the remaining Assets being created BLUE
*  - Run:
*    - Transactions run to query for created assets that are RED
*
*/

'use strict'

module.exports.info  = "Query Asset Performance Test";

var bc;
var busNetConnection;
var testAssetNum;
var testMatches;
var factory;
var matchColor = 'RED';
const namespace = 'org.acme.sample';

let myQuery;
let qryRef = 0;

const vda_ns = 'org.vda';

module.exports.init = async function(blockchain, context, args) {
    // Create Assets to use in main query test    
    bc = blockchain;
    busNetConnection = context;
    testAssetNum = args.testAssets;
    testMatches = args.testMatches;

    factory = busNetConnection.getBusinessNetwork().getFactory();

    let vehicles = [];
    let createdMatches = 0;    
    let missColor = 'BLUE';

    for(let i = 0; i < testAssetNum; i ++){
        let vehicle = factory.newResource(vda_ns, 'Vehicle', 'VEHICLE_' + i);
        let details = factory.newConcept(vda_ns, 'VehicleDetails');
        details.make = 'testMake';
        details.modelType = 'testModel';

        if(createdMatches<testMatches){
            details.colour = matchColor;
            createdMatches++;
        } else {
            details.colour = missColor;
        }
        
        vehicle.vehicleDetails = details;
        vehicle.vehicleStatus = 'OFF_THE_ROAD';
        vehicles.push(vehicle);
    }

    console.log(`About to add ${vehicles.length} Vehicles to Asset Registry`)
    let vehicleRegistry = await busNetConnection.getAssetRegistry(vda_ns + '.Vehicle');
    await vehicleRegistry.addAll(vehicles);
}

module.exports.run = function() {
    let invoke_status = {
        id           : qryRef++,
        status       : 'created',
        time_create  : Date.now(),
        time_final   : 0,
        time_endorse : 0,
        time_order   : 0,
        result       : null
    };

    // use the pre-compiled query named 'selectAllCarsByColour' that is within the business
    // network queries file
    return busNetConnection.query('selectAllCarsByColour', { colour: matchColor})
    .then((result) => {
        invoke_status.status = 'success';
        invoke_status.time_final = Date.now();
        invoke_status.result = result;
        return Promise.resolve(invoke_status);
    })
    .catch((err) => {
        invoke_status.time_final = Date.now();
        invoke_status.status = 'failed';
        invoke_status.result = [];        
        return Promise.resolve(invoke_status);
    });
}

module.exports.end = function(results) {
    return Promise.resolve(true);
};