// const red = document.getElementById('red');
// const blue = document.getElementById('blue');
// const orange = document.getElementById('orange');
// const green = document.getElementById('green');
// const purple = document.getElementById('purple');
// const body = document.body;
// // document.querySelector('body');

// red.addEventListener('click',()=>{
// body.style.backgroundColor = 'red';
// } )

// blue.addEventListener('click',()=>{
// body.style.backgroundColor = 'blue';
//  } )

// orange.addEventListener('click',()=>{
// body.style.backgroundColor = 'orange';
// } )

//  green.addEventListener('click',()=>{
//  body.style.backgroundColor = 'green';
// } )

//  purple.addEventListener('click',()=>{
//  body.style.backgroundColor = 'purple';
//   } ) 


//  const button = document.querySelectorAll('button');
//  const body = document.body;
//  // console.log(buttons);

//  button.forEach((button)=>{

//      button.addEventListener('click',()=>{
//         body.style.backgroundColor = button.id;

//     })
     
//  })

 const root = document.getElementById('root');

 root.addEventListener('click',(event)=>{
    document.body.style.backgroundColor = event.target.id;
//  console.log(event.target);
 })

