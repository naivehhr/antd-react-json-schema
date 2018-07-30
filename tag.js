let fs = require('fs')
let name = require('./package.json').name


function jsonStringify(data, space) {
    var seen = [];
    return JSON.stringify(data, function (key, val) {
        if (!val || typeof val !== 'object') {
            return val;
        }
        if (seen.indexOf(val) !== -1) {
            return '[Circular]';
        }
        seen.push(val);
        return val;
    }, space);
}

let hash = fs.readdirSync('./dist')
    .filter(item => item.indexOf('.js') >= 0)
    .reduce((prev, next) => Object.assign({}, prev, { [next.split('-')[0]]: next.split('-')[1].slice(0, 8) }), {})
if(!fs.existsSync('./ver')){
    fs.mkdirSync("./ver");
}
fs.writeFileSync(['./ver/', name || 'ver', '.json'].join(''), jsonStringify({ js: hash }, 4), 'UTF-8')