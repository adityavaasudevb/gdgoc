export const getGoogleCalendarUrl = ({ title, description, date }) => {
  // Convert YYYY-MM-DD → YYYYMMDD
  const formattedDate = date.replaceAll("-", "");

  // Default: 2-hour event (safe assumption)
  const start = `${formattedDate}T090000Z`;
  const end = `${formattedDate}T110000Z`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    dates: `${start}/${end}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
