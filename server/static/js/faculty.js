
// const formA=document.getElementById('formA')
// const formB=document.getElementById('formB')
// console.log(formA);
var enter;
function faculty(obj)
{ console.log("hello i am here");
    enter=obj.value;
    console.log("object id",enter,obj.id);
    document.getElementById('add_faculty').style.display='block';
    document.getElementById('add_batch').style.display='none';
}
function batch(obj)
{ console.log("hello i am here");
    enter=obj.value;
    console.log("object id",enter,obj.id);
    document.getElementById('add_batch').style.display='block';
    document.getElementById('add_faculty').style.display='none';
}
 
 
function function1(obj){
    console.log("1");
    
    const num=obj.previousElementSibling.value;
    console.log(num);
    document.getElementById('add_faculty').style.display='none';
    formB.style.display='none';
    formA.style.display='block';
    let init=document.getElementById('faculty').innerHTML;
    console.log("printing init",init);
    for(var i=1;i<=num-1;i++)
    {
        const fac=document.getElementById('table_fac');
        fac.innerHTML=fac.innerHTML+init;
    
    }
}
function function2(obj){
    console.log("1");
    
    const num=obj.previousElementSibling.value;
    console.log(num);
    document.getElementById('add_batch').style.display='none';
    formA.style.display='none';
    formB.style.display='block';
    let init=document.getElementById('student').innerHTML;
    console.log("printing init",init);
    for(var i=1;i<=num-1;i++)
    {
        const fac=document.getElementById('table_student');
        fac.innerHTML=fac.innerHTML+init;
    
    }
}
// function function2(obj){
//     const input = document.getElementById('fileSelect');
//     document.getElementById('nums').style.display='none';
// input.addEventListener('change', () => {
//   readXlsxFile(input.files[0]).then((data) => {
//      console.log(data,obj);
//   })
// })
// }