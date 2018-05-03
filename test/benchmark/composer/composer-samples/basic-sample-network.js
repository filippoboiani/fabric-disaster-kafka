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
*  Basic Sample Network
*  Updates the value of an Asset through a Transaction.
*  - Example test round (txn <= testAssets)
*      {
*        "label" : "basic-sample-network",
*        "txNumber" : [50],
*        "trim" : 0,
*        "rateControl" : [{"type": "fixed-rate", "opts": {"tps" : 10}}],
*        "arguments": {"testAssets": 50},
*        "callback" : "benchmark/composer/composer-samples/basic-sample-network.js"
*      }
*  - Init: 
*    - Single Participant created (PARTICIPANT_0)
*    - Test specified number of Assets created, belonging to a PARTICIPANT_0
*  - Run:
*    - Transactions run against all created assets to update their values
*
*/

'use strict'
module.exports.info  = "Basic Sample Network Performance Test";

const composerUtils = require('../../../src/composer/composer_utils');

const namespace = 'org.acme.sample';
const busNetName = 'basic-sample-network';

var bc;                 // The blockchain main (Composer)
var busNetConnections;  // Global map of all business network connections to be used
var testAssetNum;       // Number of test assets to create
var factory;            // Global Factory

module.exports.init = async function(blockchain, context, args) {
    // Create Participants and Assets to use in main test    
    bc = blockchain;
    busNetConnections = new Map();
    busNetConnections.set('admin', context);
    testAssetNum = args.testAssets;

    try {
        factory = busNetConnections.get('admin').getBusinessNetwork().getFactory();
        let participantRegistry = await busNetConnections.get('admin').getParticipantRegistry(namespace + '.SampleParticipant')
        
        // Create & add participant
        let participant = factory.newResource(namespace, 'SampleParticipant', 'PARTICIPANT_0');
        participant.firstName = 'penguin';
        participant.lastName = 'wombat';
        await participantRegistry.add(participant);

        console.log('About to create new participant card');
        let userName = 'User1';
        let newConnection = await composerUtils.obtainConnectionForParticipant(busNetConnections.get('admin'), busNetName, participant, userName);
        busNetConnections.set(userName, newConnection);

        // Create & add Assets
        let assetRegistry = await busNetConnections.get('admin').getAssetRegistry(namespace + '.SampleAsset')
        let assets = Array();        
        for (let i=0; i<testAssetNum; i++){
            let asset = factory.newResource(namespace, 'SampleAsset', 'ASSET_' + i);
            asset.owner = factory.newRelationship(namespace, 'SampleParticipant', 'PARTICIPANT_0');
            asset.value = 'priceless';            
            assets.push(asset);            
        }
        console.log('Adding ' + assets.length + ' Assets......');
        await assetRegistry.addAll(assets);        
       
        console.log('Asset addition complete');
    } catch (error) {
        console.log('error in test init: ', error);
        return Promise.reject(error);
    }
}

module.exports.run = function() {
    let transaction = factory.newTransaction(namespace, 'SampleTransaction');
    transaction.newValue = 'worthless';
    transaction.asset = factory.newRelationship(namespace, 'SampleAsset', 'ASSET_' + --testAssetNum);
    
    return bc.bcObj.submitTransaction(busNetConnections.get('admin'), transaction);
}

module.exports.end = function(results) {
    return Promise.resolve(true);
};