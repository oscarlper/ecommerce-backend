getParams = new URLSearchParams(window.location.search)
firstname = getParams.get('firstname')

document.querySelector('#userLogout').innerHTML=`<p>Hasta Luego ${firstname}</p>`

setTimeout(function(){
    location.href = '/api/logout';
}, 2000);
