### `most-spawn`
========
A library which spawns a generator function which allows for Promises, Streams sequences, Arrays, Objects, Generators and functions. Also it support complicated Objects and Array which contains nested Streams, Promises, Objects, Arrays.

### Todo
* Create some tests.
* Create a library for ES5 (umd support will be better).
* Publish this library to npm.
* Make some documentation.

### A simple example (complicated object)

```js
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
}).observe(x => console.log(x));
```