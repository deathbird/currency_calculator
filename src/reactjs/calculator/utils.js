import { APP_DEBUG } from './constants';

/**
 * Log to console useful messages if LAYOUT_EDITOR_DEBUG is true.
 */
export function log() {
    if (APP_DEBUG) {
        console.log.apply(undefined, arguments)
    }
}

export function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}





