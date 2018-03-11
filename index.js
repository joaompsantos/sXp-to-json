const fs = require('fs');


var fscale = ['HZ', 'KHZ', 'MHZ', 'GHZ', 'THZ'];

console.log(readFile('/sXpfiles/exp2.s2p'));



function readFile(path) {
	let data = new Object();

	var file = fs.readFileSync(__dirname + path, 'utf8')
		.split('\n')
		.filter((x) => {
			return x.charAt(0) != '!'
		});



	getsettings(data, file)
	getpoints(data, file)

	return data;
}


function getsettings(data, file) {
	let l = file[0].split(' ').filter(Boolean)
	data.fscale = getfscale(l)
	data.params = getparams(l)
	data.format = getformat(l)
	data.load = getload(l)
}

function getpoints(data, file) {
	let aux = {
		freq: [],
		p11: {
			x: [],
			y: []
		},
		p12: {
			x: [],
			y: []
		},
		p21: {
			x: [],
			y: []
		},
		p22: {
			x: [],
			y: []
		}
	}

	// First line holds # units
	file.splice(0, 1);

	// Insert points on data and parse scientific notation
	file = file.forEach((x) => {

		x = x.replace(/\s/g, ' ').split(' ').filter(Boolean)
		x.forEach((e,i) => {

      e=e.toUpperCase().split('E').filter(Boolean)
      if(e.length>=2)
        x[i] = parseFloat(e[0])*Math.pow(10,parseFloat(e[1]))
      else
        x[i] = parseFloat(e[0])



		})


		aux.freq.push(x[0])

		aux.p11.x.push(x[1])
		aux.p11.y.push(x[2])

		aux.p12.x.push(x[3])
		aux.p12.y.push(x[4])

		aux.p21.x.push(x[5])
		aux.p21.y.push(x[6])

		aux.p22.x.push(x[7])
		aux.p22.y.push(x[8])
	})

	data.data = aux
}


function getfscale(l) {

	return fscale = fscale.indexOf(l[1].toUpperCase()) * 3;
}

function getparams(l) {

	return l[2];
}

function getformat(l) {

	return l[3];
}

function getload(l) {

	return parseInt(l[5]);
}
