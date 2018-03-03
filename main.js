const fs = require('fs');
const readline = require('readline');

// Define Frequency Units
var fscale = [{
		name: 'HZ',
		scale: 1
	},
	{
		name: 'KHZ',
		scale: 3
	},
	{
		name: 'MHZ',
		scale: 6
	},
	{
		name: 'GHZ',
		scale: 9
	},
	{
		name: 'THZ',
		scale: 12
	}
];

// Define Params
var params = [{
		name: 'S'
	},
	{
		name: 'Z'
	},
	{
		name: 'Y',
	},
	{
		name: 'H',
	},
	{
		name: 'G',
	}
];

// Define Format
var format = [{
		name: 'RI'
	},
	{
		name: 'MA'
	},
	{
		name: 'DB'
	},
];



// Flag to indicate data starting
var save = 0;

// Array to save usefull data
let data = [];

// JSON to hold Final data
var vna = new Object();


console.log('Loading file...');

var rl = readline.createInterface({
	input: fs.createReadStream(__dirname + '/exp2.s2p', 'utf8'),
	output: process.stdout,
	terminal: false
});

// "LOOP" through lines
rl.on('line', (l) => {
	if (l.charAt(0) == '#')
		save = 1;

	if (save)
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
function getData(data) {
	// Aux Json
	aux = new Object();
	let freq = [];
	let pt1 = {
		'a': [],
		'b': []
	};
	let pt2 = {
		'a': [],
		'b': []
	};
	let pt3 = {
		'a': [],
		'b': []
	};
	let pt4 = {
		'a': [],
		'b': []
	};

	// Split Units line
	let p = data[0].split(' ');
	p = p.filter(function(n) {
		return n.length >= 1
	});

	// Get fscale
	aux.fscale = fscale.filter(
		function(fscale) {
			return fscale.name == p[1].toUpperCase();
		}
	)[0].scale;

	// Get params
	aux.params = params.filter(
		function(params) {
			return params.name == p[2].toUpperCase();;
		}
	)[0].name;

	// Get format
	aux.format = format.filter(
		function(format) {
			return format.name == p[3].toUpperCase();;
		}
	)[0].name;

	// Get load
	aux.load = parseInt(p[5]);

	// Get Rid off non data lines
  while(data[0].charAt(0)=='!' || data[0].charAt(0)=='#'){
    data.splice(0,1);
  }

	aux.data = new Object;

	// Handle data Points
	data.forEach(x => {
    let vals = x.split(' ');
    vals = vals.filter(function(n) {
    		return n.length >= 1
    	});

		// Get Freq values
		freq.push(vals[0]);

		// Get Fist Param
		pt1.a.push(vals[1]);
		pt1.b.push(vals[2]);

		// Get Secon Param
		pt2.a.push(vals[3]);
		pt2.b.push(vals[4]);

		// Get ThirdParam
		pt3.a.push(vals[5]);
		pt3.b.push(vals[6]);

		// Get fourth Param
		pt4.a.push(vals[7]);
		pt4.b.push(vals[8]);

	});

  // Init Params and Push extracted data to Aux
  switch (aux.params) {
    case params[0].name:
      aux.data = {
        'freq': freq,
        'S11': {
          'r': pt1.a,
          'i': pt1.b
        },
        'S12': {
          'r': pt2.a,
          'i': pt2.b
        },
        'S21': {
          'r': pt3.a,
          'i': pt3.b
        },
        'S22': {
          'r': pt4.a,
          'i': pt4.b
        }
      };
      break;

    case params[1].name:
      aux.data = {
        'freq': [],
        'Z11': {
          'r': pt1.a,
          'i': pt1.b
        },
        'Z12': {
          'r': pt2.a,
          'i': pt2.b
        },
        'Z21': {
          'r': pt3.a,
          'i': pt3.b
        },
        'Z22': {
          'r': pt4.a,
          'i': pt4.b
        }
      };
      break;

    case params[2].name:
      aux.data = {
        'freq': [],
        'Y11': {
          'r': pt1.a,
          'i': pt1.b
        },
        'Y12': {
          'r': pt2.a,
          'i': pt2.b
        },
        'Y21': {
          'r': pt3.a,
          'i': pt3.b
        },
        'Y22': {
          'r': pt4.a,
          'i': pt4.b
        }
      };
      break;

    case params[3].name:
      aux.data = {
        'freq': [],
        'H11': {
          'r': pt1.a,
          'i': pt1.b
        },
        'H12': {
          'r': pt2.a,
          'i': pt2.b
        },
        'H21': {
          'r': pt3.a,
          'i': pt3.b
        },
        'H22': {
          'r': pt4.a,
          'i': pt4.b
        }
      };
      break;

    case params[4].name:
      aux.data = {
        'freq': [],
        'G11': {
          'r': pt1.a,
          'i': pt1.b
        },
        'G12': {
          'r': pt1.a,
          'i': pt1.b
        },
        'G21': {
          'r': pt1.a,
          'i': pt1.b
        },
        'G22': {
          'r': pt1.a,
          'i': pt1.b
        }
      };
      break;

    default:
      console.log("error");
      break;
  }

	return aux;
}
