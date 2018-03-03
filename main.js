const fs = require('fs');
const readline = require('readline');

// Define Frequency Units
var fscale = [
  {name:'HZ', scale: 1},
  {name:'KHZ', scale: 3},
  {name:'MHZ', scale: 6},
  {name:'GHZ', scale: 9},
  {name:'THZ', scale: 12}
];

// Define Params
var params = [
  {name:'S'},
  {name:'Z'},
  {name:'Y'},
  {name:'H'},
  {name:'G'}
];

// Define Format
var format = [
  {name:'RI'},
  {name:'MA'},
  {name:'DB'},
];



// Flag to indicate data starting
var save  = 0;

// Array to save usefull data
let data=[];

// JSON to hold Final data
var vna = new Object();


console.log('Loading file...');

var rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/dummy.s2p', 'utf8'),
    output: process.stdout,
    terminal: false
});

// "LOOP" through lines
rl.on('line', (l) => {
  if(l.charAt(0)=='#')
    save = 1;

  if(save)
    data.push(l);

});

// Close Line Reader
rl.on('close', () => {
    console.log('   Done Loading \n     -> Starting Decoding');

    // Organize data into json object
    vna = getData(data);

    console.log('Organized Data : ');
    console.log(vna);

});




// Functions
function getData(data){
  // Aux Json
  aux = new Object();

  // Split int params
  re = ' ';
  let p = data[0].split(re)

  aux.fscale = fscale.filter(
    function(fscale) {
      return fscale.name == p[1];
    }
  )[0].scale;

  aux.params = params.filter(
    function(params) {
      return params.name == p[2];
    }
  )[0].name;

  aux.format = format.filter(
    function(format) {
      return format.name == p[3];
    }
  )[0].name;

  aux.load = parseInt(p[5]);

  return aux;
}
