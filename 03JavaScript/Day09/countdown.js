// Countdown Timer for olympics
// Days, hour , minutes, seconds

const date1 = new Date();
const date2 = new Date("2028-07-14t00:00:00");

const date = date2-date1;
const days = Math.floor(date/(1000*60*60*24));
const hour = Math.floor((date/(1000*60*60))%24);
const minute = Math.floor((date/(1000*60))%60);
const second = Math.floor((date/(1000))%60);
console.log(`olympics CountdownTime:Days:${days} hour:${hour} minute:${minute} second:${second}`);

// const days = date/(1000*60*60*24);
// console.log(days);
// console.log(hour);
