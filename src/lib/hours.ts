const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Today's date and weekday in California. */
export function pacific(d: Date) {
  const [y, m, day] = d.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }).split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, day));
  return { utc, weekday: utc.getUTCDay() };
}

/** The next weekday after today, Pacific time, said the way a person would. */
export function replyBy(d: Date) {
  const { weekday } = pacific(d);
  const step = weekday === 5 ? 3 : weekday === 6 ? 2 : 1;
  const next = (weekday + step) % 7;
  return step === 1 ? 'end of day tomorrow' : `end of day ${WEEKDAYS[next]}`;
}
