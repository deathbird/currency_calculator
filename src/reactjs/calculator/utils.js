/**
 * Utility functions module.
 */

import { APP_DEBUG } from './constants';

/**
 * Log to console useful messages if APP_DEBUG is true.
 */
export function log() {
    if (APP_DEBUG) {
        console.log.apply(undefined, arguments)
    }
}

/**
 * Determine if an object does not have keys / properties.
 *
 * @param obj
 * @returns {boolean}
 */
export function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

/**
 * Decimal/Float rounding function.
 *
 * @param value
 * @param decimals
 * @returns {number}
 */
export function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}





