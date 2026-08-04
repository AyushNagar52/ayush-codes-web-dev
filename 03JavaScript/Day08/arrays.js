const arr = [2,35,1,8,9,"rohit",true];
console.log(arr.length);

console.log(arr[1]);
console.log(arr.at(-2));
console.log(arr.at(-1));
// arr.at is latest , negative index le leta hai
// arr.length

let arr1 = [2,35,6,11];
let arr2 = [5,12,19,20];
let arr4 = [23,432,1123,31];
let arr3 = arr1.concat(arr2,arr4);
console.log(arr2,arr4);
console.log(arr3);