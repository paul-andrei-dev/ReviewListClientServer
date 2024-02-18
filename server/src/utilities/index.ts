export const isValidTimestamp = (timestamp: number): boolean => {
  const date = new Date(timestamp);
  return !isNaN(date.getTime());
};
