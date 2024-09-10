export type Options = {
    /**
    If no exchange rate is available for the given date, the closest available rate prior to the given date will be provided.

    @default false
    */
    readonly defaultToClosestPriorRate?: boolean;

    /**
    If no exchange rate is available for the given date, `null` will be returned.

    @default false
    */
    readonly defaultToNull?: boolean;
};

/**
Retrieves exchange rates from the Reserve Bank of Australia's exchange rate datasets. Base currency is always AUD.

@param currency - Currency to retrieve exchange rate for. Must be one of the following currency codes: USD, TWI, CNY, JPY, EUR, KRW, GBP, SGD, INR, THB, NZD, TWD, MYR, IDR, VND, AED, PGK, HKD, CAD, ZAR, CHF, PHP, SDR
@param exchangeRateDate - Date to retrieve exchange rate for.
@returns Returns a Promise that resolves to the `currency`'s exchange rate with AUD. If an exchange rate is not available on a given date, the closest exchange rate after the date will be provided. If there is a gap of greater than 7 days between the closest exchange rate and the date provided, `null` will be returned. See options to instead provide the closest rate before the date, or return `null` if no rate is available on the given date.


@example
```
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
*/
export default function getExchangeRate(currency: string, exchangeRateDate: Date, options?: Options): Promise<number>;
