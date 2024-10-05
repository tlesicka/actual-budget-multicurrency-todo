const { readFile } = require('node:fs/promises');
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
    const contents = await readFile(filePath, { encoding: 'utf8' });
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
  const contents = await readFile(filePath, { encoding: 'utf8' });
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

async function run() {
  var iso4217 = await readXML();
  var symbols = await readSymbols();

  var currencies = {};

  iso4217.forEach((country) => {
    if(!country.Ccy) return;
    if(!currencies.hasOwnProperty(country.Ccy)){
      currencies[country.Ccy] = {
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
  console.log(JSON.stringify(currencies, null, '  '));
}

run();