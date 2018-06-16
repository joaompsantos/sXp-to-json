var s2p = require('./index.js')
let sxp = new s2p('/ExemploRealImaginary.s2p', null)

// Save Object
sxp.save('test.json');
// Search for point
console.log(sxp.searchFreq(5, 11));
// Output format
console.log(sxp.ReIm(11));
console.log(sxp.LogMag(11));
console.log(sxp.ZIN());
