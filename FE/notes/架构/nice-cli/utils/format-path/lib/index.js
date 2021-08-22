'use strict';

const path = require('path')

function formatPath(p) {
    if(p) {
        const sep = path.sep;
        if(sep === '/') {
            return p;
        }else {
            // window上路径反斜杠兼容
            return p.replace(/\\/g, '/');
        }
    }
    return p;
}

module.exports = formatPath;
