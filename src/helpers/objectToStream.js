import most from 'most';
import {toStream} from '..';
import {isStream} from './utils';

export default function (obj) {
    let results = new obj.constructor();
    let keys = Object.keys(obj);
    let streams = new Array(keys.length);

    for(let i = 0, len = keys.length; i < len; i++) {
        let key = keys[i];
        let stream = toStream.call(this, obj[key]);

        if(stream && isStream(stream)) {
            defer(stream, key);
        } else {
            results[key] = obj[key];
        }
    }
    
    return most.fromPromise(
        Promise.all(
            streams.map(
                stream => stream.reduce((a, b) => b, null)
            )
        )
    ).map(() => results);

    function defer(stream, key) {
        results[key] = undefined;
        streams.push(stream.map(next => results[key] = next));
    }
}