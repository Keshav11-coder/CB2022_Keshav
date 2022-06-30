function getInput(){
var USER = document.getElementById('logon-as').value;
var ID = document.getElementById('admin').value;
if(USER == "keshav"){
    document.getElementById("content").className="content";
}
}

setInterval(getInput(), 1000);