# exchange-rates-rba

>  Get currency exchange rates from the Reserve Bank of Australia

Retrieves exchange rates from the [Reserve Bank of Australia's exchange rate datasets](https://www.rba.gov.au/statistics/historical-data.html#exchange-rates). Base currency is always AUD.

All datasets are cached after being downloaded for quick retrieval, and each dataset covers multiple years. Exchange rate data goes back to December 1983. A maximum of 11 datasets will be downloaded, totalling about 6MB. 

Some currencies are not available through the entire 1983 – current datasets, double check RBA datasets for if the specified currency is available throughout the required period. USD is available for the entire dataset period, excluding non-business days.

## Install

```sh
npm install exchange-rates-rba
```

## Usage

```js
import getExchangeRate from 'exchange-rates-rba';

await getExchangeRate('USD', new Date(2023, 1, 22));
//=> 0.6789

await getExchangeRate('JPY', new Date(2017, 1, 1), { defaultToClosestPriorRate: true });
//=> 128.12

await getExchangeRate('USD', new Date(2023, 0, 1);
// => 0.6929

await getExchangeRate('USD', new Date(2023, 0, 1), { defaultToNull: true });
// => null

```

## API

### getExchangeRate(currency, date, options?)

Returns a Promise that resolves to the `currency`'s exchange rate with AUD. 

If an exchange rate is not available on a given date, the closest exchange rate after the date will be provided. If there is a gap of greater than 7 days between the closest exchange rate and the date provided, `null` will be returned.

See below options to instead provide the closest rate before the date, or return `null` if no rate is available on the given date.

#### currency

Type: `string`

Must be one of the following currency codes:

> USD, TWI, CNY, JPY, EUR, KRW, GBP, SGD, INR, THB, NZD, TWD, MYR, IDR, VND, AED, PGK, HKD, CAD, ZAR, CHF, PHP, SDR

TWI is the [trade-weighted index](https://www.rba.gov.au/statistics/frequency/twi/). 

#### date

Type: `Date object`

Date to retrieve exchange rate for.

#### options

Type: `object`

##### defaultToClosestPriorRate

Type: `boolean`\
Default: `false`

If no exchange rate is available for the given date, the closest available rate prior to the given date will be provided.

##### defaultToNull

Type: `boolean`\
Default: `false`

If no exchange rate is available for the given date, `null` will be returned.
