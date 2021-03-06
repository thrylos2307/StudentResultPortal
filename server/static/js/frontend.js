
const formA=document.getElementById('formA')
const formB=document.getElementById('formB')
console.log(formA);
function function1(){
    console.log("1");
    formB.style.display='none';
    formA.style.display='block';
    
}function function2(){
    console.log("2");
    formA.style.display='none';
    formB.style.display='block';
}