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

var spinner = (0, _ora2.default)('init...');

var templateUrl = {
    react: 'https://github.com:rocky-one/react-scaffold#master',
    vue: 'https://github.com:rocky-one/react-scaffold#master'
};
function initTemplate(answers, projectName) {
    var template = answers.template,
        _answers$description = answers.description,
        description = _answers$description === undefined ? '' : _answers$description;

    spinner.start();
    (0, _downloadGitRepo2.default)(templateUrl[template], projectName, { clone: true }, function (err) {
        var packagePath = process.cwd() + '/' + projectName + '/package.json';
        var packageContent = JSON.parse(_fs2.default.readFileSync(packagePath), 'utf8');
        packageContent.name = projectName;
        // packageContent.description = description
        _fs2.default.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
        console.log(err ? err : '\r\n success');
        spinner.stop();
    });
}

exports.default = initTemplate;