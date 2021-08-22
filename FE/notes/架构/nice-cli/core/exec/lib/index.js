'use strict';
const path = require('path');
const Package = require('@nice-cli/package');
const log = require('@nice-cli/log');
const SETTINGS = {
    // init: '@nice-cli/init'
    init: 'nice-cli'
}
const packageVision = '1.0.0';
const CACHE_DIR = 'dependencies';

async function exec() {
    let targetPath = process.env.CLI_TARGET_PATH;
    const homePath = process.env.CLI_HOME_PATH;
    const cmdObj = arguments[arguments.length - 1];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];
    // const packageVision = 'latest';
    let storeDir = '';
    let pkg;
    if(!targetPath) {
        // 缓存路径
        targetPath = path.resolve(homePath, CACHE_DIR);
        storeDir = path.resolve(targetPath, 'node_modules');
        pkg = new Package({
            targetPath,
            storeDir,
            packageName,
            packageVision
        });
        // 已经安装package
        if(await pkg.exists()) {
            // 更新
            pkg.update();
            console.log('更新')
        } else {
            // 安装
            pkg.install();
        }
    } else {
        pkg = new Package({
            targetPath,
            packageName,
            packageVision
        });

        const rootFile = pkg.getRootFilePath();
        console.log(await pkg.exists(),rootFile, 980);

        require(rootFile).apply(null, arguments);
    }

}

module.exports = exec;
