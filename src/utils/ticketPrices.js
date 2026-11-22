function hasValue(value) {
  return value != null && String(value).trim() !== '';
}

export function getTicketPricing(promotion) {
  return promotion.ticketPricing ?? (
    String(promotion.ticketPrice) === '0' && !hasValue(promotion.boxOfficePrice)
      ? 'free'
      : 'paid'
  );
}

export function getTicketPriceRows(event) {
  const promotion = event?.promotionData || {};
  const pricing = promotion.ticketPricing ?? event?.ticketPricing;
  const ticketPrice = promotion.ticketPrice ?? event?.ticketPrice ?? event?.ticket_price;
  const boxOfficePrice = promotion.boxOfficePrice ?? event?.boxOfficePrice;

  if (pricing === 'free') return [{ label: 'Eintritt', value: 'Eintritt frei' }];
  if (pricing === 'donation') return [{ label: 'Eintritt', value: 'Freiwillige Spende' }];

  if (pricing === 'paid' || hasValue(boxOfficePrice)) {
    return [
      ...(hasValue(ticketPrice) ? [{ label: 'Vorverkauf', value: String(ticketPrice) }] : []),
      ...(hasValue(boxOfficePrice) ? [{ label: 'Abendkasse', value: String(boxOfficePrice) }] : [])
    ];
  }

  if (!hasValue(ticketPrice)) return [];
  return [{
    label: 'Ticketpreis',
    value: String(ticketPrice) === '0' ? 'Eintritt frei' : String(ticketPrice)
  }];
}
