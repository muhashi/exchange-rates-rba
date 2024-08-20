# exchange-rates-rba

>  Get currency exchange rates from the Reserve Bank of Australia

Retrieves exchange rates from the [Reserve Bank of Australia's exchange rate datasets](https://www.rba.gov.au/statistics/historical-data.html#exchange-rates).

All datasets are cached after being downloaded for quick retrieval, and each dataset covers multiple years. Exchange rate data goes back to December 1983.

If an exchange rate is not available on a given date, the closest exchange rate after the date will be provided. An option exists to provide the closest rate before the date.

Some currencies are not available through the entire 1983 - current datasets, double check RBA data for the specified currency is available throughout the required period. USD is available for the entire 1983 - current dataset, excluding non-business days.

## Install

```sh
npm install exchange-rates-rba
```

## Usage

```js
import getExchangeRate from 'exchange-rates-rba ';

getExchangeRate('USD', new Date(2023, 1, 22));
//=> 0.6789

getExchangeRate('JPY', new Date(2017, 1, 1), { defaultToClosestPriorRate: true });
//=> 128.12

```

## API

### getExchangeRate(currency, date, options?)

#### currency

Type: `string`

Must be one of the following currency codes:

> USD, TWI, CNY, JPY, EUR, KRW, GBP, SGD, INR, THB, NZD, TWD, MYR, IDR, VND, AED, PGK, HKD, CAD, ZAR, CHF, PHP, SDR

#### date

Type: `Date object`

Date to retrieve exchange rate for.

#### options

Type: `object`

##### defaultToClosestPriorRate

Type: `boolean`\
Default: `false`

If no exchange rate is available for the given date, the closest available rate prior to the given date will be provided.
