let but = document.getElementById('edt-dtl');
let doc = document.getElementsByClassName('scdle-time')[0];
function show() {
    doc.style.display = 'inline';
    but.style.display = 'none';
}

function unShow() {
    doc.style.display = 'none';
    but.style.display = 'inline';
}