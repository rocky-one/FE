'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

function getNpmInfo(npmName, registry) {
    if(!npmName) return null;
    const regi= registry || getRegistry();
    const npmInfoUrl = urlJoin(regi, npmName);
    return axios.get(npmInfoUrl).then(res => {
        if (res.status === 200) {
            return res.data;
        }
        return {data:{}}
    }).catch(err=> {
        // console.log(err, 'rrrrrrr')
    });
}

function getRegistry(isOriginal = false) {
    return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org'
}

async function getNpmVersions(npmName, registry) {
    const data = await getNpmInfo(npmName, registry);
    return Object.keys(data.versions);
}
function getSemverVersions(baseVersion, versions) {
    versions = versions.filter(v => {
        return semver.satisfies(v, `${baseVersion}`)
    }).sort((a, b) => semver.gt(b, a));
    return versions;
}

// 获取npm中的最新版本号
async function getNpmSemverVersion(baseVersion, npmName) {
    const versions = await getNpmVersions(npmName);
    const newVersions = getSemverVersions(baseVersion, versions);
    if (newVersions && newVersions.length) {
        return newVersions[0];
    }
    return null;
}

// 获取最新版本号
async function getNpmLatestVersion(npmName, registry) {
    let versions = await getNpmVersions(npmName, registry);
    if (versions) {
        return versions.sort((a, b) => semver.gt(b,a))[0];
    }
    return null;
}

module.exports = {
    getNpmInfo,
    getNpmVersions,
    getNpmSemverVersion,
    getRegistry,
    getNpmLatestVersion
};
