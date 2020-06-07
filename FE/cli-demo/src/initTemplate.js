import ora from 'ora';
import fs from 'fs';
import download from 'download-git-repo';
const spinner = ora('init...');

const templateUrl = {
    react: 'https://github.com:rocky-one/react-scaffold#master',
    vue: 'https://github.com:rocky-one/react-scaffold#master'
}
function initTemplate(answers, projectName) {
    const {template, description} = answers
    spinner.start()
    download(templateUrl[template],projectName, { clone: true}, (err) => {
        const packagePath = `${process.cwd()}/${projectName}/package.json`
        const packageContent = JSON.parse(fs.readFileSync(packagePath), 'utf8')
        packageContent.name = projectName
        packageContent.description = description
        fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2))
        console.log(err ? err : '\r\n success')
        spinner.stop()
    })
}

export default initTemplate