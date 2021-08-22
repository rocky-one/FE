'use strict';
const path = require('path');
const semver = require('semver');
const colors = require('colors');
const userHome = require('user-home');
const commander = require('commander');
const pathExists = require('path-exists').sync;

const pkg = require('../package.json');
const log = require('@nice-cli/log');
const init = require('@nice-cli/init');
const exec = require('@nice-cli/exec');
const { getNpmSemverVersion} = require('@nice-cli/get-npm-info');

const minVersion = '12.0.0';

const program = new commander.Command();

// const utils = require('@nice-cli/utils')
function core() {
    // utils();
    try {
        prepare();
        registerCommand();
    } catch (err) {
        log.error(err);

    }

}

// 1. 版本检测
function getPkgVersion() {
    console.log('nice-cli当前版本号：' + pkg.version)
}

// 2. node 版本检测
function checkNodeVersion() {
    if (!semver.gte(process.version, minVersion)) {
        throw new Error(colors.red(`node 版本不能低于 ${minVersion}`));
    }
}

// 3. root 账户检测
function checkRoot() {
    const rootCheck = require('root-check');
    rootCheck();
}

// 4. 检测用户主目录
function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前用户主目录不存在'));
    }
    process.env.CLI_HOME_PATH = path.join(userHome, '.nice-cli');
}
let args;
// 5. 命令行 参数解析 开启debug模式
function checkInptArgs() {
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2));
    checkArgs();
}
// 设置log模式
function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL;
}

// 6. 检测版本是否需要更新
async function checkGlobalUpdate() {
    const lastVersion = await getNpmSemverVersion(pkg.version, pkg.name);
    if (lastVersion && semver.gt(lastVersion, pkg.version)) {
        log.warn(colors.yellow(`请更新版本 ${pkg.name}， 当前最新版本: ${lastVersion}`))
    }
}

// 7. 注册命令

function registerCommand() {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '是否启动调试模式', false)
        .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '')

    program
        .command('init [projectName]')
        .option('-f, --force', '是否强制初始化项目')
        .action(exec)
        // .action(init)


    program.on('option:debug', function() {
        if (this.opts().debug) {
            process.env.LOG_LEVEL = 'verbose';
        } else {
            process.env.LOG_LEVEL = 'info';
        }
        log.level = process.env.LOG_LEVEL;
        log.verbose('test debug!')
    });

    program.on('option:targetPath', function() {
        process.env.CLI_TARGET_PATH = this.opts().targetPath;
    });

    // 对所有命令监听，过滤未注册的命令并提示
    program.on('command:*', function(obj) {
        const avilableCommands = program.commands.map(cmd => cmd.name());
        if (obj.length) {
            log.error('未注册此命令: ' + obj[0])
        }
    });
    console.log(program.args, 339);

    // 当不输入命令时给一个帮助文档提示
    if (program.args.length < 1) {
        program.outputHelp();
    }

    program.parse(process.argv);
}

function prepare() {
    getPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    // checkInptArgs();
    // log.verbose('debug', 'test-debug');
    checkGlobalUpdate();
}

module.exports = core;