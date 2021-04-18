#!/usr/bin/env node
const { program } = require('commander');
const { readdirSync } = require('fs');


const yaml = require("./src/yaml");
// ./gen -p ./goals -m manifest 

program
  .option('-p, --path <string>', 'default path of the readme and manifest')
  .option('-m, --manifest <string>', 'manifest file name')
  .option('-t, --type <string>', 'manifest file type');

program.parse(process.argv);
const opts = program.opts();

const { path, manifest, type = getType() } = opts;

switch(type) {
    case 'yaml':
        yaml(path, manifest);
        break;
    case 'json':
        console.log('Not Implmemted')
        break;    
    default:
        console.log('yaml');    
} 


function getType() {
    const mfile = readdirSync(path)
    .filter(
        (file) => file.match('yaml') || file.match('json')
    ).join("").split(".");
    
    return mfile.slice(mfile.length -1).join("");
}