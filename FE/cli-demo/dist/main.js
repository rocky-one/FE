'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _const = require('./utils/const');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _initTemplate = require('./initTemplate');

var _initTemplate2 = _interopRequireDefault(_initTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const actionMap = {
    install: {
        alias: 'i',
        description: 'install template',
        examples: ['cli i', 'cli install']
    },
    config: {
        alias: 'c',
        description: 'config .clirc',
        examples: ['cli config set <k> <v>', 'cli config remove <k>']
    },
    '*': {
        alias: '',
        description: 'not found',
        examples: []
    }
};
const projectName = process.argv[3] || 'app';
console.log(process.argv, projectName, 9);

_commander2.default.command(`create ${projectName}`).description('create one app!').action(() => {
    if (_fs2.default.existsSync(projectName)) {
        console.log(_chalk2.default.red('project name is exist'));
        return;
    }
    _inquirer2.default.prompt([{
        type: 'list',
        name: 'template',
        message: '选择开发框架：',
        choices: ['react', 'vue']
    }]).then(answers => {
        console.log(answers, 9);
        (0, _initTemplate2.default)(answers, projectName);
    });
});

Object.keys(actionMap).forEach(key => {
    _commander2.default.command(key).description(actionMap[key].description).alias(actionMap[key].alias).action(() => {
        console.log(key);
    });
});

function help() {
    console.log('\r\n   ' + 'how to use command');
    Object.keys(actionMap).forEach(key => {
        actionMap[key].examples.forEach(examples => {
            console.log('    ' + examples);
        });
    });
}
_commander2.default.on('-h', help);
_commander2.default.on('--help', help);

_commander2.default.version(_const.VERSION, '-v --version').parse(process.argv);