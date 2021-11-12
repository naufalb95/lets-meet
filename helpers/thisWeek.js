let gantiHari = function (param) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let d = param;
  let dayName = days[d.getDay()];
  if (dayName == "Sunday") d.setDate(d.getDate());
  if (dayName == "Monday") d.setDate(d.getDate() + 6);
  if (dayName == "Tuesday") d.setDate(d.getDate() + 5);
  if (dayName == "Wednesday") d.setDate(d.getDate() + 4);
  if (dayName == "Thursday") d.setDate(d.getDate() + 3);
  if (dayName == "Friday") d.setDate(d.getDate() + 2);
  if (dayName == "Saturday") d.setDate(d.getDate() + 1);
  return d;
};

module.exports = gantiHari;
