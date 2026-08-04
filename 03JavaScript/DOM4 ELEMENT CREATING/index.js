// <li>TS</li>
function attach(content){
const element = document.createElement('li');
element.innerHTML = content;

const parent = document.getElementById("root");
parent.appendChild(element);
};

attach("TS");
attach("React");
attach("Node") 