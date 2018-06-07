var s2p = require('./index.js')
let sxp = new s2p('/ExemploRealImaginary.s2p', null)

//sxp.save('test.json');
console.log(sxp.searchFreq(856500000, 'RL'));
console.log(sxp.ReIm(11)[0]);


console.log(sxp.LogMag(11)[0]);
console.log(sxp.LogMag(11)[1]);
console.log(sxp.LogMag(11)[2]);
console.log(sxp.LogMag(11)[3]);
console.log(sxp.ReIm(11)[4]);
console.log(sxp.ReIm(11)[5]);
console.log(sxp.ReIm(11)[6]);
console.log(sxp.ReIm(11)[7]);
sxp.save('test1.json');
