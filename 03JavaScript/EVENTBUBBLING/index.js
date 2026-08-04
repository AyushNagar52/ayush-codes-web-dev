const grandParent = document.getElementById('grandParent');
const parent = document.getElementById('parent');
const child = document.getElementById('child');

// event bubbling and event capturing

child.addEventListener('click',()=>{
    console.log("child Clicked");
},true)

parent.addEventListener('click',()=>{
    console.log("parent Clicked");
},true)

grandParent.addEventListener('click',()=>{
    console.log("grandParent Clicked");
},true)
