/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import { createAction } from 'redux-actions'
import * as actionTypes from '../action-types'
import { get } from '../../../services/request.js';
export const getBlocksPerMin = (curChannel) => dispatch => {
    get('/api/blocksByMinute/' + curChannel + '/1')
        .then(resp => {
            dispatch(createAction(actionTypes.BLOCK_CHART_MIN)(resp))
        }).catch((error) => {
            console.error(error);
        })
}
export const getBlocksPerHour = (curChannel) => dispatch => {
    get('/api/blocksByHour/' + curChannel + '/1')
        .then(resp => {
            dispatch(createAction(actionTypes.BLOCK_CHART_HOUR)(resp))
        }).catch((error) => {
            console.error(error);
        })
}
export const getTxPerMin = (curChannel) => dispatch => {
    get('/api/txByMinute/' + curChannel + '/1')
        .then(resp => {
            dispatch(createAction(actionTypes.TX_CHART_MIN)(resp))
        }).catch((error) => {
            console.error(error);
        })
}
export const getTxPerHour = (curChannel) => dispatch => {
    get('/api/txByHour/' + curChannel + '/1')
        .then(resp => {
            dispatch(createAction(actionTypes.TX_CHART_HOUR)(resp))
        }).catch((error) => {
            console.error(error);
        })
}

export const getTxByOrg = (curChannel) => dispatch => {
    get('/api/txByOrg/' + curChannel)
        .then(resp => {
            dispatch(createAction(actionTypes.TX_CHART_ORG)(resp))
        }).catch((error) => {
            console.error(error);
        })
}