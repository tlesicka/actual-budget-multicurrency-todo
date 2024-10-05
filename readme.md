# Actual Budget Multi-Currency Discussion
Notes and Discussion points for adding Multi-Currency to Actual Budget

[Discord - #Ideas - Support for Multi Currency Budget](https://discord.com/channels/937901803608096828/1224674202083393597)

## Step 1 - Add Currency Support
Actual Budget currently does not use any specific currency.  Currently, all transaction amounts are stored in the SQLite database as an Integer using a minor unit of 2.  This means that before the amount is stored it is multiplied by 100 ($123.45 is stored as 12345).  This works for 255 of the 264 currencies listed in ISO 4217, but does not work for all currencies. <br/>
#### Currency Minor Units (from ISO 4217)
0 minor units - 31 currencies <br/>
2 minor units - 224 currencies </br>
3 minor units - 7 currencies (Bahraini Dinar, Iraqi Dinar, Jordanian Dinar, Kuwaiti Dinar, Libyan Dinar, Rial Omani, Tunisian Dinar) <br/>
4 minor units - 2 currencies (Unidad de Fomento, Unidad Previsional)

ISO 4217 can be downloaded as an XML file from :<br/>
https://www.iso.org/iso-4217-currency-codes.html <br/>
[list-one.xml](list-one.xml) was downloaded from iso.org.<br/>
The XML file is organized by country name.  AB will need to turn this XML file organized by country name to a JS Object organized by currency code (UNITED STATES OF AMERICA (THE) -> USD or AUSTRIA -> EUR).<br/>
[Example JSON/JS Object](iso4217_currencies.json)<br/>
ISO 4217 does not include currency symbols.  Current list of symbols can be found at:
- https://www.xe.com/symbols/
- https://en.wikipedia.org/wiki/Currency_symbol#List_of_currency_symbols_currently_in_use

[currency_symbols.json](currency_symbols.json) was extracted from xe.com/symbols

Structure for Currency Information Object:
```
{
  code: {                         // "AFN"
    "name": string,               // "Afghani"
    "number": number,             // 971
    "minorUnits": number,         // 2
    "symbol": string,             // "؋"
    "country": Array(string),     // [ "AFGHANISTAN" ]
  },
}
```
[Example: (iso4217_currencies.json)](iso4217_currencies.json)
```
"INR": {
  "name": "Indian Rupee",
  "number": 356,
  "minorUnits": 2,
  "symbol": "₹",
  "countries": [
    "BHUTAN",
    "INDIA"
  ],
},
```

### Step 1 - Todo
1) Create Currency class that stores:<br/>
   a list of currencies as defined above;<br/>
   lookup functions such as:
   - getCurrency(currencyCode): Currency
   - Currency.getMinorUnit(): number
   - Currency.getSymbol(): string
   - etc
2) Read iso4217.json into Currency class 
3) Add {currency: string} field to AB global settings as the base budget currency.  Add currency selection to Settings page for a one-time setting of currency.
   > [!NOTE]
   > Changing a base currency would require a conversion to the new currency and is beyond the current scope of the project. This may be a future feature, but not initial.
4) Convert AB's current fixed minor units to minor unit based on selected currency.
5) Possibly add option to view currency symbols.

[Discord Discussion](https://discord.com/channels/937901803608096828/1224674202083393597/1290451173433675889)

## Step 2 - TBD