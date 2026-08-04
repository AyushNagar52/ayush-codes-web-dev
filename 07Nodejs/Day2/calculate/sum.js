// Modules protect their variables and functions from leaking

console.log("Sum Module Executed");

x = "Hello World";

function calculateSum(a, b) {
    const sum = a + b;
    
    console.log(sum);
}

module.exports = { x, calculateSum };

// module.exports.x = x;
// module.exports.calculateSum = calculateSum;