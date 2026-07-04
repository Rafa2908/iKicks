export const addHours = (date, hours) => {
  const HOUR_MS = 60 * 60 * 1000;
  return new Date(date.getTime() + hours * HOUR_MS);
};

export const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th"; // 11th-13th are all 'th'
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatDateLong = (date) => {
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    date,
  );
  const day = date.getDate();
  return `${month} ${day}${getOrdinalSuffix(day)}`;
};
