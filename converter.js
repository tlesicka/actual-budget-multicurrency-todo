const fs = require('node:fs/promises');
const { resolve } = require('node:path');
const xml2js = require('xml2js');

const parser = new xml2js.Parser();

function getName(ccynm) {
	var name = '';
	if (typeof ccynm === 'object' && ccynm !== null) {
		name = ccynm['_'];
	} else {
		name = ccynm;
	}
	return name;
}

async function readXML() {
  try {
    const filePath = resolve('./list-one.xml');
    const contents = await fs.readFile(filePath, { encoding: 'utf8' });
    var countries = [];
    parser.parseString(contents, (err, result) => {
      if(err) {
          return console.log(err);
      }
      countries = result['ISO_4217']['CcyTbl'][0]['CcyNtry'];
      return result['ISO_4217']['CcyTbl'][0]['CcyNtry'];
    });
    return countries;
  } catch (err) {
    console.error(err.message);
  }
}

async function readSymbols() {
  const filePath = resolve('./currency_symbols.csv');
  const contents = await fs.readFile(filePath, { encoding: 'utf8' });
  var symbols = {};
  var lines = contents.split('\n');
  lines.forEach((line, index) => {
    if (index == 0) return;
    var sym = line.split(',');
    if (sym[0] == '') return;
    symbols[sym[0]] = sym[1];
  });
  return symbols;
}

async function directoryExists(path) {
  try {
    await fs.stat(path);
  } catch (e) {
    return false;
  }
  return true;
}

async function writeCurrencyFiles(currencies) {
  if (!(await directoryExists('currencies'))) {
    await fs.mkdir('currencies');
  }
  if (!(await directoryExists())) {
    await fs.mkdir('currencies/iso4217');
  }
  var indexjs = '';
  
  for (var code in currencies) {
	  var currency = currencies[code];
	  var fileData = JSON.stringify(currency, null, '  ');
	  fileData = fileData.replace(/\n\s\s\"/g, '\n  ');
	  fileData = fileData.replace(/\":\s/g, ': ');
	  fileData = 'import { type Currency } from \'../../../../types/currency\';\n\n'
	    + 'export const ' + code + ': Currency = ' + fileData + '\n';
    await fs.writeFile('./currencies/iso4217/'+code+'.ts', fileData);
	indexjs += 'export * from \'.\/' + code + '\';\n';
  }
  await fs.writeFile('./currencies/iso4217/index.ts', indexjs);
}

async function run() {
  var iso4217 = await readXML();
  var symbols = await readSymbols();

  var currencies = {};

  iso4217.forEach((country) => {
    if(!country.Ccy) return;
    if(!currencies.hasOwnProperty(country.Ccy)){
      currencies[country.Ccy] = {
        code: country.Ccy[0],
        name: getName(country.CcyNm[0]),
        number: Number(country.CcyNbr),
        minorUnits: (country.CcyMnrUnts === 'N.A.' ? null : Number(country.CcyMnrUnts)),
        symbol: symbols[country.Ccy[0]],
        countries: [ country.CtryNm[0] ],
      };
    } else {
      currencies[country.Ccy].countries.push(country.CtryNm[0]);
    }
  });

  await writeCurrencyFiles(currencies);
}

run();