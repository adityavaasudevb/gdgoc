export const parseEventDate = (dateStr) => {
  return new Date(dateStr);
};

export const isFutureEvent = (dateStr) => {
  const eventDate = parseEventDate(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
};

export const isTomorrowEvent = (dateStr) => {
  const eventDate = parseEventDate(dateStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const nextDay = new Date(tomorrow);
  nextDay.setDate(nextDay.getDate() + 1);

  return eventDate >= tomorrow && eventDate < nextDay;
};
