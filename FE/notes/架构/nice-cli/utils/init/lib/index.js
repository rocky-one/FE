'use strict';

module.exports = init;

function init(name, options, command) {
    console.log(name, options, process.env.CLI_TARGET_PATH, '11')
}
