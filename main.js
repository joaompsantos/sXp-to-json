const fs = require('fs');
const readline = require('readline');


console.log('Starting conversion ...');

var rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/example.s2p', 'utf8'),
    output: process.stdout,
    terminal: false
});

rl.on('line', l => {
    l.charAt(0) == '!' 
    ? console.log('yeeeee')
    : console.log('nooooo');
});

rl.on('close', () => {
    console.log('Conversion ended!');
});



