import test from 'ava';
import getExchangeRate from './index.js';
import floatEqual from 'float-equal';
import {setTimeout} from 'node:timers/promises';


test('Throws when number in currency input', async t => {
    await t.throwsAsync(async () => {
        await getExchangeRate(123, new Date(2023, 0, 1));
    }, {
        instanceOf: TypeError,
        message: 'Expected a string, got number',
    });
});

test('Throws when invalid currency input', async t => {
    await t.throwsAsync(async () => {
        await getExchangeRate('AAA', new Date(2023, 0, 1));
    }, {
        instanceOf: TypeError,
        message: 'Unexpected currency code, got AAA',
    });
});

test('Throws when string in date input', async t => {
    await t.throwsAsync(async () => {
        await getExchangeRate(123, new Date(2023, 0, 1));
    }, {
        instanceOf: TypeError,
        message: 'Expected a string, got number',
    });
});

test('Gets USD on given date', async t => {
    const rate = await getExchangeRate('USD', new Date(2023, 0, 6));

    t.assert(floatEqual(rate, 0.6769));
});

test('Gets USD on closest date after a given date if not on business day', async t => {
    const rate = await getExchangeRate('USD', new Date(2023, 0, 14));

    t.assert(floatEqual(rate, 0.6988));
});

test('Gets USD from next dataset if reached end of a dataset', async t => {
    const rate = await getExchangeRate('USD', new Date(2022, 11, 31));

    t.assert(floatEqual(rate, 0.6828));
});

test('Gets TWI', async t => {
    const rate = await getExchangeRate('TWI', new Date(2019, 6, 10));

    t.assert(floatEqual(rate, 59.70));
});

test('Gets TWI from 2019', async t => {
    const rate = await getExchangeRate('TWI', new Date(2019, 6, 10));

    t.assert(floatEqual(rate, 59.70));
});

test('Gets CNY from 2018', async t => {
    const rate = await getExchangeRate('CNY', new Date(2018, 1, 28));

    t.assert(floatEqual(rate, 4.9312));
});

test.serial('Gets JPY from 2017', async t => {
    const rate = await getExchangeRate('JPY', new Date(2017, 9, 30));

    t.assert(floatEqual(rate, 87.22));
});

test.serial('Gets EUR from 2014', async t => {
    const rate = await getExchangeRate('EUR', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 0.6936));
});


test.serial('Gets KRW from 2014', async t => {
    const rate = await getExchangeRate('KRW', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 961.31));
});

test.serial('Gets GBP from 2014', async t => {
    const rate = await getExchangeRate('GBP', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 0.5540));
});

test.serial('Gets SGD from 2014', async t => {
    const rate = await getExchangeRate('SGD', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 1.1783));
});

test.serial('Gets INR from 2014', async t => {
    const rate = await getExchangeRate('INR', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 56.82));
});

test.serial('Gets THB from 2014', async t => {
    const rate = await getExchangeRate('THB', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 30.64));
});

test.serial('Gets NZD from 2014', async t => {
    const rate = await getExchangeRate('NZD', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 1.0801));
});

test.serial('Gets TWD from 2014', async t => {
    const rate = await getExchangeRate('TWD', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 28.31));
});

test.serial('Gets MYR from 2014', async t => {
    const rate = await getExchangeRate('MYR', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 3.0332));
});

test.serial('Gets IDR from 2014', async t => {
    const rate = await getExchangeRate('IDR', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 11297));
});

test.serial('Gets VND from 2014', async t => {
    const rate = await getExchangeRate('VND', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 20122));
});

test.serial('Gets AED from 2014', async t => {
    const rate = await getExchangeRate('AED', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 3.4665));
});

test.serial('Gets PGK from 2014', async t => {
    const rate = await getExchangeRate('PGK', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 2.2910));
});

test.serial('Gets HKD from 2014', async t => {
    const rate = await getExchangeRate('HKD', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 7.3165));
});

test.serial('Gets CAD from 2014', async t => {
    const rate = await getExchangeRate('CAD', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 1.0130));
});

test.serial('Gets ZAR from 2014', async t => {
    const rate = await getExchangeRate('ZAR', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 10.0704));
});

test.serial('Gets CHF from 2014', async t => {
    const rate = await getExchangeRate('CHF', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 0.8446));
});

test.serial('Gets PHP from 2014', async t => {
    const rate = await getExchangeRate('PHP', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 41.32));
});

test.serial('Gets SDR from 2014', async t => {
    const rate = await getExchangeRate('SDR', new Date(2014, 5, 23));

    t.assert(floatEqual(rate, 0.6118));
});

test.serial('Gets USD from 2010-2013 dataset', async t => {
    await setTimeout(1000); // wait 1 second before accessing a new dataset to avoid scraping protection
    const rate = await getExchangeRate('USD', new Date(2010, 1, 2));

    t.assert(floatEqual(rate, 0.8802));
});

test.serial('Gets USD from 2007-2009 dataset', async t => {
    await setTimeout(1000); // wait 1 second before accessing a new dataset to avoid scraping protection
    const rate = await getExchangeRate('USD', new Date(2007, 1, 2));

    t.assert(floatEqual(rate, 0.7730));
});

test.serial('Gets USD from 2003-2006 dataset', async t => {
    await setTimeout(1000); // wait 1 second before accessing a new dataset to avoid scraping protection
    const rate = await getExchangeRate('USD', new Date(2003, 1, 3));

    t.assert(floatEqual(rate, 0.5860));
});

test.serial('Gets USD from 1999-2002 dataset', async t => {
    await setTimeout(1000); // wait 1 second before accessing a new dataset to avoid scraping protection
    const rate = await getExchangeRate('USD', new Date(1999, 1, 3));

    t.assert(floatEqual(rate, 0.6398));
});

test.serial('Gets USD from 1995-1998 dataset', async t => {
    await setTimeout(1000); // wait 1 second before accessing a new dataset to avoid scraping protection
    const rate = await getExchangeRate('USD', new Date(1995, 1, 3));

    t.assert(floatEqual(rate, 0.7590));
});

test.serial('Gets USD from 1991-1994 dataset', async t => {
    await setTimeout(1000); // wait 1 second before accessing a new dataset to avoid scraping protection
    const rate = await getExchangeRate('USD', new Date(1991, 1, 4));

    t.assert(floatEqual(rate, 0.7819));
});

test.serial('Gets USD from 1987-1990 dataset', async t => {
    await setTimeout(1000); // wait 1 second before accessing a new dataset to avoid scraping protection
    const rate = await getExchangeRate('USD', new Date(1987, 1, 4));

    t.assert(floatEqual(rate, 0.6686));
});

test.serial('Gets USD from 1983-1986 dataset', async t => {
    await setTimeout(1000); // wait 1 second before accessing a new dataset to avoid scraping protection
    const rate = await getExchangeRate('USD', new Date(1984, 1, 3));

    t.assert(floatEqual(rate, 0.9240));
});

test('Returns null for year prior to datasets', async t => {
    await setTimeout(1000); // wait 1 second before accessing a new dataset to avoid scraping protection
    const rate = await getExchangeRate('USD', new Date(1982, 1, 3));

    t.assert(rate === null);
});

test('Returns null for year after datasets availability', async t => {
    await setTimeout(1000); // wait 1 second before accessing a new dataset to avoid scraping protection
    const rate = await getExchangeRate('USD', new Date(2999, 1, 3));

    t.assert(rate === null);
});

test('Returns a value for USD last week', async t => {
    const lastWeekDate = new Date();
    lastWeekDate.setDate(new Date().getDate() - 7);
    const rate = await getExchangeRate('USD', lastWeekDate);

    t.truthy(rate);
    t.assert(rate > 0);
    t.assert(rate < 100);
});

test('Returns null for tomorrows data', async t => {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(new Date().getDate() + 1);
    const rate = await getExchangeRate('USD', tomorrowDate);

    t.assert(rate === null);
});

test('Gets USD on first date prior to given date if no records for date', async t => {
    const rate = await getExchangeRate('USD', new Date(2023, 0, 7), { defaultToClosestPriorRate: true });

    t.assert(floatEqual(rate, 0.6769));
});

test('Gets USD on date prior to first entry in dataset with defaultToClosestPriorRate', async t => {
    const rate = await getExchangeRate('USD', new Date(2023, 0, 1), { defaultToClosestPriorRate: true });

    t.assert(floatEqual(rate, 0.6775));
});

test('Gets USD on date after last entry in dataset', async t => {
    const rate = await getExchangeRate('USD', new Date(2022, 11, 31));

    t.assert(floatEqual(rate, 0.6828));
});

test.serial('Returns null on date before earliest date in dataset with defaultToClosestPriorRate', async t => {
    const rate = await getExchangeRate('USD', new Date(1983, 11, 11), { defaultToClosestPriorRate: true });

    t.assert(rate === null);
});

// TODO
test.skip('Returns null on date before earliest date in dataset', async t => {
    const rate = await getExchangeRate('USD', new Date(1983, 11, 11));

    t.assert(rate === null);
});
