import most from 'most';

export default function (fn) {
    const self = this;

    return most.create((add, end, error) => {
        fn.call(self, (...args) => {
            let [err, res] = args;
            if(err) return error(err);
            if(args.length > 2) {
                res = args.slice(1);
            }
            add(res);
            end();
        });
    });
}