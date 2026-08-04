require("./xyz.js"); // one module into another

// const { x, calculateSum } = require("./caculate/sum.js");

// const { calculateMultiply } = require("./caculate/multiply.js");

const { calculateSum, calculateMultiply } = require("./caculate");

var name = "Namaste NodeJS";

var a = 10;

var b = 20;

//var x = 100;

calculateSum(a, b);
calculateMultiply(a, b);

console.log(x);