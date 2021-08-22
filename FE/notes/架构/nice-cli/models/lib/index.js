'use strict';
const path = require('path');
const pkgDir = require('pkg-dir').sync;
const npminstall = require('npminstall');
const pathExists = require('path-exists').sync;
const fse = require('fs-extra');
const formatPath = require('@nice-cli/format-path');
const { isObject } = require('@nice-cli/utils');
const { getRegistry, getNpmLatestVersion } = require('@nice-cli/get-npm-info');

class Package {
    constructor(options) {
        if (!isObject(options)) {
            throw new Error('options is not Object in Package constructor!')
        }
        this.targetPath = options.targetPath;
        this.storePath = options.storePath;
        // install缓存目录
        this.storeDir = options.storeDir;
        this.packageName = options.packageName;
        this.packageVision = options.packageVision;
        // package缓存目录前缀
        this.cacheFilePathPrefix = this.packageName.replace('/', '_');
    }
    // 获取入口文件路径
    getRootFilePath() {
        function _getRootFile(targetPath) {
            // package.json所在的目录
            const dir = pkgDir(targetPath);
            if (dir) {
                const pkgFile = require(path.resolve(dir, 'package.json'));
                if (pkgFile && pkgFile.main) {
                    return formatPath(path.resolve(dir, pkgFile.main));
                }
                return null;
            }
        }
        // 有缓存
        if(this.storeDir) {
            return _getRootFile(this.cacheFilePath);
        }else {
            return _getRootFile(this.targetPath);
        }
    }
    async prepare() {
        if (this.storeDir && !pathExists()) {
            fse.mkdirpSync(this.storeDir);
        }
        if (this.packageVision === 'latest') {
            this.packageVision = await getNpmLatestVersion(this.packageName)
        }
    }
    get cacheFilePath() {
        return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVision}@${this.packageName}`)
    }
    getcacheFilePath(packageVision) {
        return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${packageVision}@${this.packageName}`)
    }
    // 判断当前package是否存在
    async exists() {
        if (this.storeDir) {
            await this.prepare();
            return pathExists(this.cacheFilePath)
        } else {
            return pathExists(this.targetPath);
        }
    }
    // 
    async install() {
        await this.prepare();
        npminstall({
            // 目标路径
            root: this.targetPath,
            // 缓存package路径
            storeDir: this.storeDir,
            registry: getRegistry(),
            pkgs: [
                {
                    name: this.packageName,
                    version: this.packageVision
                }
            ]
        })
    }
    async update() {
        await this.prepare();
        // 1. 获取最新npm模块的版本号
        const latestPackageVersion = await getNpmLatestVersion(this.packageName);
        // 2.查询最新版本号对应的文件路径是否存在
        const latestFilePath = this.getcacheFilePath(latestPackageVersion);
        // 不存在 安装最新
        if (!pathExists(latestFilePath)) {
            await npminstall({
                // 目标路径
                root: this.targetPath,
                // 缓存package路径
                storeDir: this.storeDir,
                registry: getRegistry(),
                pkgs: [
                    {
                        name: this.packageName,
                        version: latestPackageVersion
                    }
                ]
            });
            this.packageVision = latestPackageVersion;
        }
    }
}

module.exports = Package;
