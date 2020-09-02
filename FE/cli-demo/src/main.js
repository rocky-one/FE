import program from 'commander';
import { VERSION } from './utils/const';
import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import initTemplate from './initTemplate';

const actionMap = {
    install: {
        alias: 'i',
        description: 'install template',
        examples: [
            'cli i',
            'cli install'
        ]
    },
    config: {
        alias: 'c',
        description: 'config .clirc',
        examples: [
            'cli config set <k> <v>',
            'cli config remove <k>'
        ]
    },
    '*': {
        alias: '',
        description: 'not found',
        examples: []
    }
}
const projectName = process.argv[3] || 'app'

program.command(`create ${projectName}`)
    .description('create one app!')
    .action(() => {
        if(fs.existsSync(projectName)){
            console.log(chalk.red('project name is exist'))
            return
        }
        inquirer.prompt([
            {
                type: 'list',
                name: 'template',
                message: '选择开发框架：',
                choices: ['react', 'vue']
            }
        ]).then(answers => {
            initTemplate(answers, projectName)
        })
    })

Object.keys(actionMap).forEach(key => {
    program.command(key)
    .description(actionMap[key].description)
    .alias(actionMap[key].alias)
    .action(() => {
        console.log(key)
    })
})

function help() {
    console.log('\r\n   ' + 'how to use command')
    Object.keys(actionMap).forEach(key => {
        actionMap[key].examples.forEach(examples => {
            console.log('    '+ examples)
        })
    })
}
program.on('-h', help)
program.on('--help', help)

program.version(VERSION, '-v --version').parse(process.argv);

