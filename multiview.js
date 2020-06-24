const urlParams = new URLSearchParams(window.location.search);
const src = urlParams.get('src');
document.title = src;
document.addEventListener("DOMContentLoaded", function(){
	document.querySelector('#fw1').innerHTML = '<iframe src="' + src + '"></iframe>';
	document.querySelector('#fw2').innerHTML = '<iframe src="' + src + '"></iframe>';
});
