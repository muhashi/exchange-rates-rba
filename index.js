import fetch from 'node-fetch';
import * as XLSX from 'xlsx/xlsx.mjs';

const yearRanges = [
    { range: [1983, 1986], slug: '1983-1986' },
    { range: [1987, 1990], slug: '1987-1990' },
    { range: [1991, 1994], slug: '1991-1994' },
    { range: [1995, 1998], slug: '1995-1998' },
    { range: [1999, 2002], slug: '1999-2002' },
    { range: [2003, 2006], slug: '2003-2006' },
    { range: [2007, 2009], slug: '2007-2009' },
    { range: [2010, 2013], slug: '2010-2013' },
    { range: [2014, 2017], slug: '2014-2017' },
    { range: [2018, 2022], slug: '2018-2022' },
    { range: [2023, 3000], slug: '2023-current' },
];

const minYear = yearRanges.reduce((currMinYear, { range }) => Math.min(currMinYear, ...range), Infinity);
const MAX_DAYS_BETWEEN = 7;

const currencyNameMap = {
    USD: "FXRUSD",
    TWI: "FXRTWI",
    CNY: "FXRCR",
    JPY: "FXRJY",
    EUR: "FXREUR",
    KRW: "FXRSKW",
    GBP: "FXRUKPS",
    SGD: "FXRSD",
    INR: "FXRIRE",
    THB: "FXRTB",
    NZD: "FXRNZD",
    TWD: "FXRNTD",
    MYR: "FXRMR",
    IDR: "FXRIR",
    VND: "FXRVD",
    AED: "FXRUAED",
    PGK: "FXRPNGK",
    HKD: "FXRHKD",
    CAD: "FXRCD",
    ZAR: "FXRSARD",
    CHF: "FXRSF",
    PHP: "FXRPHP",
    SDR: "FXRSDR"
};

const DATE_KEY = 'Series ID';
const cachedRates = {};

export default async function getExchangeRate(currency, exchangeRateDate, { defaultToClosestPriorRate = false, defaultToNull = false } = {}) {
    if (typeof currency !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof currency}`);
    }

    if (!Object.hasOwn(currencyNameMap, currency)) {
        throw new TypeError(`Unexpected currency code, got ${currency}`);
    }

    if (typeof exchangeRateDate !== 'object') {
        throw new TypeError(`Expected a date object, got ${typeof exchangeRateDate}`);
    }

    const date = new Date(exchangeRateDate);
    date.setHours(0, 0, 0, 0);

    if (date.getFullYear() < minYear) {
        return null;
    }

    const getRate = (rateList) => defaultToNull
        ? rateList.find(rate => rate[DATE_KEY].toDateString() === date.toDateString())
        : findClosestRate(rateList, date, currencyNameMap[currency], defaultToClosestPriorRate);

    const year = date.getFullYear();
    let rates = await getRatesForYear(year);
    let rate = getRate(rates);

    const isBeforeMinDate = (rateList) => date.getFullYear() <= minYear && rateList && rateList[0] && date < rateList[0][DATE_KEY];

    if (isBeforeMinDate(rates)) {
        return null;
    }

    if (!rate) {
        // could not find rate for given date - may be at end of the dataset (ie 31/12/2022), need to try next dataset
        const increment = defaultToClosestPriorRate ? -1 : 1;
        rates = await getRatesForYear(year + increment);
        rate = getRate(rates);

        if (isBeforeMinDate(rates)) {
            return null;
        }
    }

    return rate ? rate[currencyNameMap[currency]] : null;
}

async function getRatesForYear(year) {
    const { slug } = yearRanges.find(({ range }) => range[0] <= year && year <= range[1]) ?? { slug: null };

    if (!slug) return null;

    return await getRatesFromRba(slug);
}

async function getRatesFromRba(slug) {
    if (cachedRates[slug]) return await cachedRates[slug];
    let promiseResolve;
    cachedRates[slug] = new Promise((resolve, _) => promiseResolve = resolve);

    const response = await fetch(`https://www.rba.gov.au/statistics/tables/xls-hist/${slug}.xls`);
    const body = await response.arrayBuffer();

    const workbook = XLSX.read(body, { cellDates: true });

    // Assuming the data is in the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON
    const rates = XLSX.utils.sheet_to_json(sheet, { blankrows: false, range: 10 });

    cachedRates[slug] = rates;
    promiseResolve(rates);

    return rates;
}

function findClosestRate(rates, date, currency, defaultToClosestPriorRate) {
    if (!rates) return null;

    if (defaultToClosestPriorRate) rates = rates.slice().reverse();

    for (let rate of rates) {
        if ((rate[DATE_KEY] < date && !defaultToClosestPriorRate) ||
            (rate[DATE_KEY] > date && defaultToClosestPriorRate) ||
            !rate[currency]) {
            continue;
        }

        // Too many days between the target date and the found record's date - can't use
        if (daysBetween(rate[DATE_KEY], date) > MAX_DAYS_BETWEEN) return null;

        return rate;
    }

    return null;
}

// https://stackoverflow.com/a/7763654
function daysBetween(date1, date2) {
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const a = new Date(date1);
    const b = new Date(date2);

    // Set to noon - avoid DST errors
    a.setHours(12, 0, 0, 0);
    b.setHours(12, 0, 0, 0);

    return Math.abs(Math.round((a - b) / MS_PER_DAY));
}
