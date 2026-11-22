import { test } from 'node:test';
import { deepStrictEqual } from 'node:assert';
import { getTicketPriceRows, getTicketPricing } from './ticketPrices.js';

test('preserves legacy ticket prices and free entry', () => {
  deepStrictEqual(getTicketPriceRows({ promotionData: { ticketPrice: '25 €' } }), [
    { label: 'Ticketpreis', value: '25 €' }
  ]);
  deepStrictEqual(getTicketPriceRows({ ticketPrice: 0 }), [
    { label: 'Ticketpreis', value: 'Eintritt frei' }
  ]);
  deepStrictEqual(getTicketPricing({ ticketPrice: 0 }), 'free');
  deepStrictEqual(getTicketPricing({ ticketPricing: 'paid', ticketPrice: '0' }), 'paid');
});

test('shows presale and box office prices independently', () => {
  deepStrictEqual(getTicketPriceRows({ promotionData: {
    ticketPricing: 'paid',
    ticketPrice: '20 € zzgl. Gebühren',
    boxOfficePrice: '25 €'
  } }), [
    { label: 'Vorverkauf', value: '20 € zzgl. Gebühren' },
    { label: 'Abendkasse', value: '25 €' }
  ]);
  deepStrictEqual(getTicketPriceRows({ promotionData: {
    ticketPricing: 'paid',
    ticketPrice: '',
    boxOfficePrice: '25 €'
  } }), [{ label: 'Abendkasse', value: '25 €' }]);
});

test('free and donation modes hide retained prices', () => {
  for (const [mode, label] of [['free', 'Eintritt frei'], ['donation', 'Freiwillige Spende']]) {
    deepStrictEqual(getTicketPriceRows({ promotionData: {
      ticketPricing: mode,
      ticketPrice: '20 €',
      boxOfficePrice: '25 €'
    } }), [{ label: 'Eintritt', value: label }]);
  }
});

test('does not report missing or blank prices as available', () => {
  deepStrictEqual(getTicketPriceRows({ promotionData: {
    ticketPricing: 'paid',
    ticketPrice: ' ',
    boxOfficePrice: ''
  } }), []);
});
