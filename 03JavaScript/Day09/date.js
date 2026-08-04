const d = new Date();
console.log(d.toDateString());
console.log(d.toString());
console.log(d.toISOString());

// //////////////
console.log(typeof d);

// Sun, Mon, Tue, Wed, Thu, Fri, Sat
// 0, 1,2,3,4,5,6
console.log(d.getMonth());
// Jan/feb/mar/apr
// 0/1/2/3
console.log(d.getMilliseconds());
console.log(d.getFullYear());
console.log(d.getMinutes());

