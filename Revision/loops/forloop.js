// for loop example
for(let i=1; i<=10; i++) {
     console.log("Ayush");
 }

for(let i=1; i<=5; i++)  {
    console.log(i);
}

// reverse counting
for(let i=10; i>0; i--) {
    console.log(i);
}

// break statement example
for(let i=1; i<=6; i++) {
    if(i == 4) {
        break; // exits the loop when i is 4
    }
    else {
        console.log(i);
    }
}

// continue statement example
for(let i=1; i<=5; i++) {
    if(i == 3) {
        continue; // skips the iteration when i is 3
    }
    else {
        console.log(i);
    }
}