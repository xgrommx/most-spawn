const isStream = obs => obs && typeof obs.observe === 'function';
const isFunction = fn => typeof fn === 'function';
const isPromise = promiseCtor => promiseCtor && typeof promiseCtor.then === 'function' && typeof promiseCtor.observe !== 'function';
const isGenerator = gen => isFunction(gen.next) && isFunction(gen['throw']);
const isGeneratorFunction = genFn => {
    const ctor = genFn.constructor;
    if(!ctor) return false;
    if(ctor.name === 'GeneratorFunction' || ctor.displayName === 'GeneratorFunction') return true;

    return isGenerator(ctor.prototype);
};
const isObject = obj => obj === Object(obj);

export {
    isStream,
    isFunction,
    isPromise,
    isGenerator,
    isGeneratorFunction,
    isObject
}