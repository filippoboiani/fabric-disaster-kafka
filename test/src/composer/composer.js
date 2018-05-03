/**
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
* @file, definition of the Composer class, which implements the caliper's NBI for Hyperledger Fabric
*/

'use strict';

var BlockchainInterface = require('../comm/blockchain-interface.js');

// Composer helpers
var composer_utils = require('./composer_utils.js');

class Composer extends BlockchainInterface {

    // sets this.configPath
    constructor(config_path) {
        super(config_path);
    };

    init() {
        console.log('Initializing target platform configuration');
        // initialise the target blockchain, create cards
        var config  = require(this.configPath);
        return this.initialiseFabric(config)
        .then(() => {
            // Create id cards        
            return composer_utils.createAdminBusNetCards(config);
        })
        .catch((err) => {
            console.log('composer.init() failed, ', err);
            return Promise.reject(err);
        });
    };

    initialiseFabric(config) {
        return composer_utils.createChannels(config)
        .then(() => {
            return composer_utils.joinChannels(config);
        })
        .then(() => {
           return new Promise(resolve => setTimeout(resolve, 2000));
        })
        .catch((err) => {
            console.log('composer.init() failed at initialiseFabric(), ', err);
            return Promise.reject(err);
        });
    };

    installSmartContract() {
        console.log('Deploying Composer');
        // Here, this relates to deploying a Composer BusinessNetwork to the Blockchain platform
        // - runtime install on each participating org
        // - start from any participating org
        // - conditionally set log level
        var config = require(this.configPath);
        var chaincodes = config.composer.chaincodes;
        
        // Expand required deployments
        var busnets =[];
        chaincodes.forEach((busnet) => {
            var orgs = busnet.orgs;
            orgs.forEach((org) => {
                busnets.push({"id": busnet.id, "version": busnet.version, "path": busnet.path, "org": org});
            })
        });

        // install runtime on orgs using respective organization cards
        return busnets.reduce((promiseChain, busnet) => {
                return promiseChain.then(() => {
                    return composer_utils.runtimeInstall(busnet, null, 'PerfPeerAdmin@' + busnet.org);
                });
            }, Promise.resolve())  
        .then((result) => {
            // network start on single peer using organization card
            return chaincodes.reduce((promiseChain, busnet) => {
                return promiseChain.then(() => {
                    return composer_utils.networkStart(busnet, 'PerfPeerAdmin@' + busnet.orgs[0], busnet.loglevel);
                });
            }, Promise.resolve()) 
        })
        .then(() => {
            console.log('Composer deployment complete');
        })
        .catch((err) => {
            console.log('composer.installSmartContract() failed, ', err);
            return Promise.reject(err);
        });
    };

    getContext(name) {
        console.log('getting  context for: ', name);
        // Return business network connection
        return composer_utils.getBusNetConnection('PerfNetworkAdmin@' + name);
    }

    releaseContext(context) {
        return Promise.resolve();
    }

    submitTransaction(connection, transaction) {
        let invoke_status = {
            id           : transaction.getIdentifier(),
            status       : 'created',
            time_create  : Date.now(),
            time_final   : 0,
            time_endorse : 0,
            time_order   : 0,
            result       : null
        };
        
        return connection.submitTransaction(transaction)
        .then((complete) => { 
            invoke_status.status = 'success';
            invoke_status.time_final = Date.now();
            return Promise.resolve(invoke_status);
        })
        .catch((err) => {            
            invoke_status.time_final = Date.now();
            invoke_status.status = 'failed';
            invoke_status.result = [];
            
            return Promise.resolve(invoke_status);
        });    
    }

    getDefaultTxStats(stats, results) {
        var minDelayC2E = 100000, maxDelayC2E = 0, sumDelayC2E = 0; // time from created to endorsed
        var minDelayE2O = 100000, maxDelayE2O = 0, sumDelayE2O = 0; // time from endorsed to ordered
        var minDelayO2V = 100000, maxDelayO2V = 0, sumDelayO2V = 0; // time from ordered to recorded
        var hasValue = true;
        for(let i = 0 ; i < results.length ; i++) {
            let stat = results[i];
            if(!stat.hasOwnProperty('time_endorse')) {
                hasValue = false;
                break;
            }
            if(stat.status === 'success') {
                let delayC2E = stat['time_endorse'] - stat['time_create'];
                let delayE2O = stat['time_order'] - stat['time_endorse'];
                let delayO2V = stat['time_valid'] - stat['time_order'];

                if(delayC2E < minDelayC2E) {
                    minDelayC2E = delayC2E;
                }
                if(delayC2E > maxDelayC2E) {
                    maxDelayC2E = delayC2E;
                }
                sumDelayC2E += delayC2E;

                if(delayE2O < minDelayE2O) {
                    minDelayE2O = delayE2O;
                }
                if(delayE2O > maxDelayE2O) {
                    maxDelayE2O = delayE2O;
                }
                sumDelayE2O += delayE2O;

                if(delayO2V < minDelayO2V) {
                    minDelayO2V = delayO2V;
                }
                if(delayO2V > maxDelayO2V) {
                    maxDelayO2V = delayO2V;
                }
                sumDelayO2V += delayO2V;
            }
        }

        if(hasValue) {
            stats['delayC2E'] = {'min': minDelayC2E, 'max': maxDelayC2E, 'sum': sumDelayC2E};
            stats['delayE2O'] = {'min': minDelayE2O, 'max': maxDelayE2O, 'sum': sumDelayE2O};
            stats['delayO2V'] = {'min': minDelayO2V, 'max': maxDelayO2V, 'sum': sumDelayO2V};
        }
    }
}

module.exports = Composer;