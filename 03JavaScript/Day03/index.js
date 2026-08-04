// Non Primitivedata type
// Array, Object , function


// ARRAY
// let n1 = 10;
// let n2 = 20;
// let n3 = 500;

let arr = [10,20,50,"ayush","shubham"];
console.log(arr);

// OBJECT
// /key:value

let obj = {
    user_name:"Ayush",
    account_number: 32145347644,
    balance: 648
}
console.log(obj);

// function

let fun =
function(){
    console.log("Hello ayush bhaiya")
}

fun();

// Type conversion

let account_balance = "100";
let num = Number(account_balance);

console.log(num);

// Boolean convergt to number
let x = true;
console.log(Number(x));


// null

let x1 = null;
console.log(Number(x1));

// undefined
let x2;
console.log(Number(x2));


// String ke andar convert
let ab = 20;
console.log(String(ab));

// Boolean
let abc = " ";
console.log(Boolean(abc));

console.log(4+8+24);

console.log(((6*(3+18))/6)-9);
// 18+3-9
// Divide Multiply Left to Right
// Add sub Left to Right

// MODULOUS GIVE REMINDER
console.log(20%3);

// ++ increment operator,-- decrement operator
let sum = 20;
sum++
console.log(sum);
// sum++ post increment , sum-- post decrement
// ++sum pre increment , --sum pre decrement
let total = sum++;
console.log(total);
console.log(sum);

// assignment operator
let y = 20;
y+=10;
// x = x+10;
console.log(y);
// y = y-10;
y-=10;
console.log(y);