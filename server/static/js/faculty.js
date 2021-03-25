
// const formA=document.getElementById('formA')
// const formB=document.getElementById('formB')
// console.log(formA);
var enter;
function Result(obj)
{ console.log("hello i am here");
    enter=obj.value;
    console.log("object id",enter,obj.id);
    document.getElementById('add_table').style.display='block';
    document.getElementById('num').style.display='none';
    document.getElementById('add_col').style.display='none';
}
function Exam(obj)
{ console.log("hello i am here");
    enter=obj.value;
    console.log("object id",enter,obj.id);
    document.getElementById('num').style.display='block';
    document.getElementById('add_table').style.display='none';
    document.getElementById('add_col').style.display='none';
}
 
 
function function1(obj){
    console.log("1");
    
    const num=obj.previousElementSibling.value;
    console.log(num);
    document.getElementById('num').style.display='none';
    document.getElementById('add_col').style.display='block';

    let init=document.getElementById('column').innerHTML;
    console.log("printing init",init);
    for(var i=1;i<=num-1;i++)
    {
        const fac=document.getElementById('column');
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