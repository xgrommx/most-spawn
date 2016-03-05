import most from 'most';
import {isStream, isObject} from './utils';
import {toStream} from '..';

export default function (obj) {
    return most.fromPromise(most.from(obj).concatMap(o => {
        if(isStream(o) || isObject(o)) {
            return toStream.call(null, o);
        } else {
            return most.of(o);
        }
    }).reduce((acc, next) => acc.concat([next]), []));
}