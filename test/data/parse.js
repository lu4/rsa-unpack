var fs = require('fs');
var src = fs.readFileSync(__dirname + '/keys.txt', 'utf8');

var rows = src.match(new RegExp(
    '^\\S+:('
    + '\\n((\\s+\\S+:\\n)*(\\s+\\S+\\n))'
    + '|[^\n]+)',
    'gm'
));
var fields = rows.reduce(function (acc, row) {
    var key = row.split(':')[0];
    var s = row.slice(row.indexOf(':') + 1);
    
    if (/^\n/.test(s)) {
        // multi-line
        acc[key] = Buffer(s.replace(/[\s:]+/g, ''), 'hex');
        return acc;
    }
    
    // single-line
    var v = s.replace(/^\s+/, '');
    if (key === 'Private-Key') {
        acc.bits = Number(/\((\d+) bit\)/.exec(v)[1]);
    }
    else if (key === 'publicExponent') {
        acc[key] = Number(/^(\d+)/.exec(v)[1]);
    }
    else acc[key] = v;
    
    return acc;
}, {});

console.dir(fields);
