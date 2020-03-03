const urlParams = new URLSearchParams(window.location.search);
const src = urlParams.get('src');
document.title = src;
document.addEventListener("DOMContentLoaded", function(){
	document.querySelector('#f1').src = src;
	document.querySelector('#f2').src = src;
});
