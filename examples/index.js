"use strict";

const most = require('most');
const spawn = require('../build').spawn;
const now = require('performance-now');

let start = now();

// sequentially
spawn(function *() {
    const a = yield most.of(10);
    const b = yield most.of(20);

    return a + b;
}).observe(x => console.log('Sequentially ' + x + ' after ' + (now() - start)).toFixed(3) + ' sec');

start = now();
// sequentially with delay
spawn(function *() {
    const a = yield most.of(10).delay(1000);
    const b = yield most.of(20).delay(1000);

    // should be fired after 2 sec
    return a + b;
}).observe(x => console.log('Sequentially with delay ' + x + ' after ' + (now() - start)).toFixed(3) + ' sec');

start = now();
// parallel
spawn(function *() {
    const arr = yield [most.of(10), most.of(20)];

    return arr[0] + arr[1];
}).observe(x => console.log('Parallel ' + x + ' after ' + (now() - start)).toFixed(3) + ' sec');

start = now();
// parallel with delay
spawn(function *() {
    const arr = yield [most.of(10).delay(1000), most.of(20).delay(1000)];

    // should be fired after 2 sec
    return arr[0] + arr[1];
}).observe(x => console.log('Parallel with delay ' + x + ' after ' + (now() - start)).toFixed(3) + ' sec');

start = now();
// complex
spawn(function *() {
    return yield {
        1: {
            3: [
                most.of(20).delay(1000), [
                    most.of(30).delay(2000), most.of(40).delay(1000)
                ]
            ]
        },
        2: Promise.resolve(1000)
    };
}).observe(x => console.log('Complex ' + JSON.stringify(x) + ' after ' + (now() - start)).toFixed(3) + ' sec');