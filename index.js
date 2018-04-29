var fs = require('fs');
var math = require('mathjs');


module.exports = class s2p {

	constructor(p) {
		privMeths.new.call(this, p);
		return this;
	}

	// Hadnles 	
	Measure(p) {
		let aux = [];
		switch (p) {
			case 11:
				aux = this.p11;
				break;
			case 21:
				aux = this.p21;
				break;

			default:
				break;
		}
		return aux;
	}

	// Handles Return Loss Request
	ReturnLoss() {
		return privMeths.returnloss.call(this, this.p11);;
	}

	// Handles VSWR request
	VSWR() {
		return privMeths.vswr.call(this, this.p11);
	}

	// Handles Absolute Value request
	ABS(p) {
		let aux = [];
		switch (p) {
			case 11:
				aux = privMeths.abs.call(this, this.p11);
				break;

			case 21:
				aux = privMeths.abs.call(this, this.p21);
				break;

			default:
				aux = [];
				console.log('Stupid Attempt');

		}

		return aux;
	}

	// Returns Wanted Parameter for Given Frequency(Hz)
	searchFreq(a, b) {
		let idx = privMeths.closestFreq.call(this, a);

		switch (b) {
			// S11
			case 11:
				return this.p11[idx];
				break;
			// S21
			case 21:
				return this.p21(idx);
				break;

			// Freq	
			case 'RL':
				return privMeths.returnloss.call(this, this.p11)[idx];
				break;

			case 'VSWR':
				return this.p11(idx);
				break;

			default:
				break;
		}
	}

	save(path) {
		fs.writeFileSync('./results/' + path, JSON.stringify(this), 'utf8', (err) => {
			if (err) {
				console.error(err);
				return;
			};
			console.log("File has been created");
		});
	}
}

const privMeths = {

	new(path) {
		// Read File 
		let file = fs.readFileSync(__dirname + path, 'utf8')
			.split('\n')
			.filter((x) => {
				return x.charAt(0) != '!'
			});

		// Frequency scale units
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

		// Read Measurements  //              

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
					x[i] = math.round(parseFloat(e[0] * Math.pow(10, parseFloat(e[1]) + this.fscale)), 3);
				else
					x[i] = math.round(parseFloat(e[0]), 3);
			});

			this.freq.push(Math.round(x[0]));

			//Handle dB/Ang

			if (this.format == 'DB') {
				x.forEach((e, i) => {
					if (((i - 1) % 2) == 0) {
						x[i] = math.round(math.pow(10, e / 20) * math.cos(x[i + 1]), 3);
						x[i + 1] = math.round(math.pow(10, e / 20) * math.sin(x[i + 1]), 3);
					}
				});

			} else if (this.format == 'MA') {
				x.forEach((e, i) => {
					if (((i - 1) % 2) == 0) {
						x[i] = math.round(e * math.cos(x[i + 1]), 3);
						x[i + 1] = math.round(e * math.sin(x[i + 1]), 3);
					}
				});
			}

			// Save Only R + jB
			this.p11.push({ "x": x[1], "y": x[2] });
			this.p21.push({ "x": x[3], "y": x[4] });
			this.p12.push({ "x": x[5], "y": x[6] });
			this.p22.push({ "x": x[7], "y": x[8] });
		});

		if (privMeths.findEmpty.call(this)) {
			this.params = 4;
		} else {
			delete this.p12;
			delete this.p22;
		}
	},

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
	},

	// Calculate Return Loss for Sxx
	returnloss(p) {
		let aux = []
		p.forEach((point) => {
			let a = math.complex(point.x, point.y);
			aux.push(Number((20 * Math.log10(math.abs(a)))).toFixed(3));
		});
		return aux;
	},

	// Calculate VSWR For given Sxx
	vswr(p) {
		let aux = []
		p.forEach((e) => {
			let a = math.abs(math.complex(e.x, e.y));
			aux.push(Number((1 + a) / (1 - a)).toFixed(3));
		});
		return aux;
	},

	// Calculate |Sxx|
	abs(p) {
		let aux = []
		p.forEach((point) => {
			let a = math.abs(math.complex(point.x, point.y));
			aux.push(a);
		});
		return aux;
	},

	// Returns closest value 
	closestFreq(p) {
		let clst = Number.MAX_SAFE_INTEGER;
		let idx = 0;

		this.freq.forEach((e, i) => {
			let dist = Math.abs(clst - e);
			if (dist < clst) {
				idx = i;
				clst = dist;
			}

		})
		return idx;
	},

}