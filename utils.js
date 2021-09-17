const emotions = {
    HAPPY: "happy",
    AFRAID: "afraid",
    SAD: "sad",
    RELAXED: "relaxed",
}

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

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
    
        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));
                    
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
        
    return array;
 }

function start_experiment() {
    // Register time and date
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    store("Date",date);
    store("Time",time);

    // Find randomized list of tasks:

    var tasks = [emotions.AFRAID, emotions.HAPPY, emotions.RELAXED, emotions.SAD];
    var ordered_tasks = shuffleArray(tasks);
    for(var i = 0; i < ordered_tasks.length; i++){
        store("Emotion_" + (i + 1), ordered_tasks[i]); 
    }

    store("Index",0);
    navigate_to_next_page();
}


function navigate_to_next_page() {
    var current_index = get("Index");
    console.log("Current index: " + current_index);
    var next_index = Number(current_index) + 1;
    console.log("Next index: " + next_index);

    
    switch(get("Emotion_" + next_index)) {
        case emotions.SAD:
            location.href='./sad.html';
            break;

        case emotions.RELAXED:
            location.href='./relaxed.html';
            break;
        
        case emotions.HAPPY:
            location.href='./happy.html';
            break;

        case emotions.AFRAID:
            location.href='./afraid.html';
            break;
        default:
            location.href='./final.html';
            break;
    }


    store("Index",next_index);
}

function navigate_to_previous_page() {

}

function get_value_radio(elements) {
    for(i = 0; i < elements.length; i++) {
        if(elements[i].checked)
        return elements[i].value;
    }
}