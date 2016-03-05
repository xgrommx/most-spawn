import most from 'most';
import {isStream, isPromise, isGenerator, isGeneratorFunction, isFunction, isObject} from './helpers/utils';
import {arrayToStream, objectToStream, thunkToStream} from './helpers';

function toStream(obj) {
    if(!obj) return obj;
    if(isStream(obj)) return obj;
    if(isPromise(obj)) return most.fromPromise(obj);
    if(isGeneratorFunction(obj) || isGenerator(obj)) return spawn.call(this, obj);
    if(isFunction(obj)) return thunkToStream.call(this, obj);
    if(Array.isArray(obj)) return arrayToStream.call(this, obj);
    if(isObject(obj)) return objectToStream.call(this, obj);

    return obj;
}

const spawn = most.spawn = function (genFn, ...args) {
    const self = this;

    return most.create((add, end, error) => {
        let unSubscribe = null;
        if(isFunction(genFn)) { genFn = genFn.apply(self, args) }
        if(!genFn || !isFunction(genFn.next)) {
            add(genFn);
            return end();
        }

        function processGenerator(res) {
            const ret = genFn.next.call(genFn, res);

            // TODO: should be implemented error handler
            next(ret);
        }

        processGenerator();

        function next(ret) {
            if(ret.done) {
                add(ret.value);
                end();
                return;
            }
            const stream = toStream.call(self, ret.value);
            let value = null;
            let hasValue = false;

            if(isStream(stream)) {
                unSubscribe = stream.observe(val => {
                    hasValue = true;
                    value = val;
                }).then(() => {
                    hasValue && processGenerator(value);
                });
            }
        }

        return unSubscribe;
    });
};

export {
    toStream,
    spawn
};