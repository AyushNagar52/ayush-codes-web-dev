// while loop example
let i = 1;
while (i <= 10) {
    console.log("Ayush");
    i++;
    }


    let j = 1;
    while (j < 8) {
        console.log(j);
        j++;  
 }

//  continue statement example
let k = 1;
while (k < 8) {
    if (k == 3) {
        k++; // increment to avoid infinite loop
        continue; // skips the iteration when k is 3
    }
    console.log(k);
    k++;
}