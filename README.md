# sXp-to-json

:satellite: Library that provides tools to transform Touchstone file in JSON object

## Description

This library serve several methods to handle Touchstone files and their data content.

You can instance a object of class s2p passing a valid file path to its constructor.

After object initilization, data is saved on object according to the configuration described in JSON FORMAT and all paremeters are saved as Real and Imaginary values. However, original format is saved so you can know in wich format data was exported.

## Features

- Handles .s2p files

- Distinguish wich parameters are present

- Get units on wich file was exported

- Suport several formats: RI, dB, MA

- Calc Return Loss, VSWR, Absolute Value

- Save Object to .json File

## Methods

- constructor(path) => Initializes new instance given file path, _\*\*path\*\*_.

- ReIm(p) => Calculates A+jB for parameter, _\*\*p\*\*_, selected.

- LogMag(p) => Calculates 20Log10(|p|) for parameter, _\*\*p\*\*_, selected.

- LinMag(p) => Calculate |p| for parameter, _\*\*p\*\*_, selected.

- LinAng(p) => Calculate |p| and Angle º for parameter, _\*\*p\*\*_, selected.

- VSWR(p) => Calculate VSWR for parameter, _\*\*p\*\*_, selected.

- save(name) => Save object to \_json\_ file named _\*name\*_.

## Example

### Initialize object.

```javascript
var s2p = require('./index.js')
let sxp = new s2p('file.s2p', null)

// Alternatively, d = array of strings readed from file

var s2p = require('./index.js')
let sxp = new s2p(null, file)


```

### Get VSWR.

```javascript
let vswr11 = sxp.VSWR(11);
let vswr21 = sxp.VSWR(21);
```

### Get LogMagnitude.

```javascript
let rl11 = sxp.LogMag(11);
let rl21 = sxp.LogMag(21);
```

### Save object to JSON file.

```javascript
sxp.save('file.json');
```

## JSON FORMAT

Data is saved in the following format.

Meanings:

- fscale : Frequency Scale, Hz -> 0, KHz -> 3, ...

- params : 2=>One-Path or 4=>Two-Path s2p file, 

- format : Real and Imaginarie, RI, Magnitude and Angle, MA, Decibel and Angle, DB

- load : Load used for system Calibration

```javascript
{
"fscale": 6,
"params": "S",
"format": "RI",
"load": 50,
"freq": \[
100,
200,
300,
\],
"p11": \[
{
"x": 15,
"y": 17
},
{
"x": 2,
"y": 15
}
\],
"p21": \[
{
"x": 15,
"y": 17
},
{
"x": 2,
"y": 15
}
\],
"p12": \[
{
"x": 15,
"y": 17
},
{
"x": 2,
"y": 15
}
\],
"p22": \[
{
"x": 15,
"y": 17
},
{
"x": 2,
"y": 15
}
\]
}
```

## TODO:

- [ ] Add Support for Z,Y, T parameters

- [ ] Verify is file is valid

- [ ] Extract equipment information from file

- [ ] Suport for .s1p files

- [x] Round values with n decimal places

- [x] Search for frequency ou parameter 

## Changes
- Can now choose between read file or accept already readed file as array data, \n separeted
- 8/6/18 - Some Improvements on Code