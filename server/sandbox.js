// const date = require("date-and-time");
// const startedDate = new Date("2020-12-12 00:00:00");
// const endDate = new Date("2020-12-26 00:00:00");
// let hariIni = new Date();
// let mingdep = hariIni.toString();
// console.log(mingdep);
// const d = new Date();
// d.setDate(d.getDate() + 10);
// console.log(d);

// console.log(endDate, "end date");
// console.log(startedDate, "started date");

// let gantiHari = function (param) {
//   let days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   let d = param;
//   let dayName = days[d.getDay()];
//   if (dayName == "Sunday") d.setDate(d.getDate() + 7);
//   if (dayName == "Monday") d.setDate(d.getDate() + 6);
//   if (dayName == "Tuesday") d.setDate(d.getDate() + 5);
//   if (dayName == "Wednesday") d.setDate(d.getDate() + 4);
//   if (dayName == "Thursday") d.setDate(d.getDate() + 3);
//   if (dayName == "Friday") d.setDate(d.getDate() + 2);
//   if (dayName == "Saturday") d.setDate(d.getDate() + 1);
//   return d;
// };
// const kata = "giolove frengky";

// let validateUsername = function (words) {
//   // let output = true;
//   // // for (let word of words) {
//   // //   if (word === " ") output = false;
//   // // }
//   // if (/^[-\w\.\$@\*\!]{1,30}$/.test(words)) output = false;
//   return /^[-\w\.\$@\*\!]{1,30}$/i.test(words);
// };
// console.log(validateUsername(kata));


// const today = new Date(new Date().setHours(0, 0, 0, 0))
// const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

// console.log(today);
// console.log(tomorrow);

let datel = '2022-03-01 16:15'
let arry = ''
let minute = datel.slice(14,16)
let hour = datel.slice(11,13)
let day = datel.slice(8, 10)
let month = datel.slice(5, 7)

const dateEvent = minute + " "+ hour + " " + day + " " + month
console.log(dateEvent);














