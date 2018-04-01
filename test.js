var s2p = require('./index.js')

let sxp = new s2p('/sXpfiles/UALAB/Exemplo Two Port Two Path-S11-S21-S22-S1-Filter-BP/FiltroPB70MHz-Real-Imag.s2p')

// Save File 
sxp.save('try3.json');