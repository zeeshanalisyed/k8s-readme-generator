const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const YAML = require('yaml');

const { jsonManifestPrser } = require('./json');


module.exports = function ReadmeParser(path, manifest = 'manifest') {
    const jp = join(process.cwd(),path, manifest)
    const fp = `${jp}.yaml`;
    const file = readFileSync(fp, 'utf8');
    
    let docs = YAML.parseAllDocuments(file);
    docs.keepBlobsInJSON = false;
    docs = docs.map(doc => doc.toJSON());
    const md = jsonManifestPrser(docs);
    // console.log(md);
    writeFileSync(`${jp}.md`, md);
}