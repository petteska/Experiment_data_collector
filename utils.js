function init() {
    sessionStorage.clear();
}

function store(name,data) {
    sessionStorage.setItem(name, data);
}

function get(name) {
    return sessionStorage.getItem(name);
    
}

function savefile(filename, data) {
    const textToBLOB = new Blob([data], { type: 'text/plain' });

    let newLink = document.createElement("a");
    newLink.download = filename;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }

    newLink.click(); 
}

function start_experiment() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    store("Date",date);
    store("Time",time);
}