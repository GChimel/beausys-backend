export function adjustToEndOfDay(dateStr: string) {
  const date = new Date(dateStr);
  date.setUTCHours(23, 59, 59, 999);
  return new Date(date.getTime() - 3 * 60 * 60 * 1000); //now is UTC -3
}

export function adjustToStartOfDay(dateStr: string) {
  const date = new Date(dateStr);
  date.setUTCHours(0, 0, 0, 0);
  return new Date(date.getTime() - 3 * 60 * 60 * 1000); //now is UTC -3
}
