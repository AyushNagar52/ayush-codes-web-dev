let obj = {
    name: "ayush",
    age:30, 
    account_balance:420,
    gender:"male"
};

const arr =Object.keys(obj);
console.log(arr);

// assign use case

const obj1 = {a:1,b:2};
const obj2 = {c:3,d:4};

const obj3 = Object.assign({},obj1,obj2);
console.log(obj3);