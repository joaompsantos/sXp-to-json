var fs = require('fs');
var math = require('mathjs');



module.exports = class s2p {

	constructor(path) {
		// Read File 
		let file = fs.readFileSync(__dirname + path, 'utf8')
			.split('\n')
			.filter((x) => {
				return x.charAt(0) != '!'
			});

		//
		let fscale = ['HZ', 'KHZ', 'MHZ', 'GHZ', 'THZ'];

		// Set Units
		let l = file[0].replace(/\s/g, ' ').split(' ').filter(Boolean);
		this.fscale = fscale.indexOf(l[1].toUpperCase()) * 3;
		//this.params = l[2];	
		this.format = l[3].toUpperCase();
		this.load = l[5];
		this.params = 0; // Use params to tell if there are 4 orjust 2 available
		this.freq = new Array();
		this.p11 = new Array();
		this.p21 = new Array();
		this.p12 = new Array();
		this.p22 = new Array();

		// Read Measurements                   

		// First line holds # units
		file.splice(0, 1);
		// Last line is empty
		file.splice(file.length - 1, 1);

		// Insert points on data and parse scientific notation
		file = file.forEach((x) => {
			x = x.replace(/\s/g, ' ').split(' ').filter(Boolean)
			x.forEach((e, i) => {
				e = e.toUpperCase().split('E').filter(Boolean);
				if (e.length >= 2)
					x[i] = parseFloat(e[0]) * Math.pow(10, parseFloat(e[1]));
				else
					x[i] = parseFloat(e[0]);
			});

			this.freq.push(x[0]);

			//Handle dB/Ang
			if (this._format == 'DB') {
				x.forEach((e, i) => {
					if ((i % 2) == 0) {
						x[i] = Math.pow(10, e / 20) * Math.cos(x[i + 1]);
						x[i + 1] = Math.pow(10, e / 20) * Math.sin(x[i + 1]);
					}
				});

			} else if (this._format == 'MA') {
				x.forEach((e, i) => {
					if ((i % 2) == 0) {
						x[i] = e * Math.cos(x[i + 1]);
						x[i + 1] = e * Math.sin(x[i + 1]);
					}
				});
			}
			// Save Only R + jB
			this.p11.push({ "x": x[1], "y": x[2] });
			this.p21.push({ "x": x[3], "y": x[4] });
			this.p12.push({ "x": x[5], "y": x[6] });
			this.p22.push({ "x": x[7], "y": x[8] });
		});

		if (this.findEmpty()) {
			this.params = 4;
		} else {
			delete this.p12;
			delete this.p22;
		}
	}

	// Calculate Return Loss for Sxx
	returnloss(p) {
		let aux = []
		p.forEach((point) => {
			let a = math.abs(math.complex(point.x, point.y));
			aux.push(20 * Math.log10(math.abs(a)));
		});
		return aux;
	}

	// Handles Return Loss Request
	ReturnLoss(p) {
		let aux = [];
		switch (p) {
			case 11:
				aux = this.returnloss(this.p11);
				break;

			case 22:
				aux = this.returnloss(this.p22);
				break;

			default:
				aux = [];
				console.log('Stupid Attempt');

		}

		return aux;
	}

	// Calculate VSWR For given Sxx
	vswr(p) {
		let aux = []
		p.forEach((point) => {
			let a = math.abs(math.complex(point.x, point.y));
			aux.push((1 + math.abs(a)) / (1 - math.abs(a)));
		});
		return aux;
	}

	// Handles VSWR request
	VSWR(p) {
		let aux = [];
		switch (p) {
			case 11:
				aux = this.vswr(this.p11);
				break;

			case 21:
				aux = this.vswr(this.p22);
				break;

			default:
				aux = [];
				console.log('Stupid Attempt');

		}

		return aux;
	}

	// Find if S12 and S22 are present
	findEmpty() {
		let a = 0;
		this.p12.forEach((point) => {
			a += point.x + point.y;
		});
		/* Only need to check if one is present
		// Beacuse they come together
		let b = 0;
		this.p22.forEach((point) => {
			b += math.abs(math.complex(point.x, point.y));
		});
		*/
		return a > 0;
	}

}
