'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _downloadGitRepo = require('download-git-repo');

var _downloadGitRepo2 = _interopRequireDefault(_downloadGitRepo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const spinner = (0, _ora2.default)('init...');

const templateUrl = {
    react: 'https://github.com:rocky-one/react-scaffold#master',
    vue: 'https://github.com:rocky-one/react-scaffold#master'
};
function initTemplate(answers, projectName) {
    const { template, description } = answers;
    spinner.start();
    (0, _downloadGitRepo2.default)(templateUrl[template], projectName, { clone: true }, err => {
        const packagePath = `${process.cwd()}/${projectName}/package.json`;
        const packageContent = JSON.parse(_fs2.default.readFileSync(packagePath), 'utf8');
        packageContent.name = projectName;
        packageContent.description = description;
        _fs2.default.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
        console.log(err ? err : '\r\n success');
        spinner.stop();
    });
}

exports.default = initTemplate;