//========================================
//              Types
//========================================
const EMOTIONS = {
    BASELINE: "baseline",
    EXCITED: "excited",
    AFRAID: "afraid",
    SAD: "sad",
    RELAXED: "relaxed",
}

const LANGUAGE = {
    ENGLISH: "en",
    NORWEGIAN: "no",
}

const PAGE_TYPES = {
    WELCOME: "welcome",
    CONSENT_FORM: "consent-form",
    QUESTIONNAIRE: "questionnaire",
    SETUP: "setup",
    SELF_ASSESSMENT: "self-assessment",
    EMOTION_ACTIVATION: "emotion-activation",
    TASK: "task",
    THANK_YOU: "thank_you",
    FINAL: "final",
}

const TASKS = {
    SUDOKU: "sudoku",
    MAZE_SOLVING: "maze_solving",
    GEOMETRIC_SHAPE_COPYING: "geometric_shape_copying",
    FIND_ALL_A: "find all a",

}

const SELF_ASSESSMENT_TYPE = {
    PRE: "pre",
    POST: "post",
}

//========================================
//              Storage
//========================================

function clear() {
    // sessionStorage.clear();
    localStorage.clear();
}

function store(name,data) {
    // sessionStorage.setItem(name, JSON.stringify(data));
    localStorage.setItem(name, JSON.stringify(data));
}

function get(name) {
    return JSON.parse(localStorage.getItem(name));
    
}

function download_file(filename, data) {
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

function convert_stored_data_to_JSON() {
    const Experiment_data = {
        id: get("Subject_id"),
        consent: get("Consent"),
        start_date: get("Date"),
        start_time: get("Start_time"),
        questionnaire_answers: get("Questionnaire"),
        emotion_list: get("Emotion_list"),
        task_list: get("Task_list"),
        emotion_data: get("Emotion_data")
    }
    return JSON.stringify(Experiment_data);
}

function make_stored_data_printable() {
    var data = 
    "ID: " + get("Subject_id") + "\r\n" +
    "Consent: " + get("Consent") + "\r\n" +
    "Date: " + get("Date") + "\r\n" +
    "Start time: " + get("Start_time") + "\r\n" +
    "Emotion order: " + "[" + get("Emotion_list") + "]" + "\r\n" + 
    "Task order: " + "[" + get("Task_list") + "]" + "\r\n" +
    "Comments: " + get("Comments");

    return data;
}

//========================================
//              Language options
//========================================

function init_language_selector() {
    let current_language = get("language");
    if(current_language !== null) {
        document.getElementById("language_select").value = current_language;
        document.body.setAttribute('lang', current_language);
    } else {
        update_language();
    }
}

function update_language() {
    let new_language = document.getElementById("language_select").value;
    store("language", new_language);
    document.body.setAttribute('lang', new_language);
}

//========================================
//              Helper functions
//========================================

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
    
        // Generate random number
        let j = Math.floor(Math.random() * (i + 1));
                    
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
        
    return array;
}

function get_value_radio(elements) {
    for(i = 0; i < elements.length; i++) {
        if(elements[i].checked)
        return elements[i].value;
    }
}

function get_time() {
    var today = new Date();
    return today.now;
}

function get_time_string() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
}


//========================================
//              Timer
//========================================

function start_page_timer(duration) {
    console.log("Timer duration:" + duration + "s");

    let current_page = get("Current_page");

    let popup_timer = window.setTimeout(()=>{start_countdown_popup(10)}, duration*1000);


    let check_button_push = window.setInterval(()=>{
        if(get("Current_page") != current_page){
            window.clearTimeout(popup_timer);
            window.clearInterval(check_button_push);
        }
    }, 100);
}

function start_countdown_popup(time_left){
    let time_left_print = document.getElementById("time_left");

    let current_page = get("Current_page");
    
    show_popup("popup_countdown");

    let count_down = window.setInterval(()=>{
        if(get("Current_page") != current_page){
            window.clearInterval(count_down);
        }
        time_left_print.innerText = time_left--;
        if(time_left < 0) {
            window.clearInterval(count_down); 
            navigate_to_next_page();
            console.log("coundown done!")
        }
    },1000);    

    
}

//========================================
//              Popup boxes
//========================================

function show_popup(id) {
    // document.getElementById(id).style.display="block";
    document.getElementById(id).classList.add("show");
    
}

function hide_popup(id) {
    // document.getElementById(id).style.display="none"
    document.getElementById(id).classList.remove("show");
}


//========================================
//              Forms
//========================================

// Consent form
function store_consent_form() {
    const consent = document.getElementById("consent");
    store("Consent",consent.checked);
    return;
}

// Questionnaire
function store_questionnaire() {
    var comfort_physic_elements = document.getElementsByName("comfort_physic");
    var comfort_social_elements = document.getElementsByName("comfort_social");


    var questionnaire_answers = {
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        last_time_ate:  document.getElementById("ate").value,
        sleep_duration: document.getElementById("sleep").value,
        comfort_physic: get_value_radio(comfort_physic_elements),
        comfort_social: get_value_radio(comfort_social_elements),
    }

    store("Questionnaire",questionnaire_answers);
}


// Self-assessment form
function get_self_assessment_result() {
    // var emotion_scale_elements = document.getElementsByName("emotion_scale");
    var result = {
        SAM: {
            valence: document.getElementById("sam_valence").value,
            arousal: document.getElementById("sam_arousal").value,
        },
        // emotion_scale: get_value_radio(emotion_scale_elements),
    }

    return result;
}


function store_self_assessment_form(emotion, self_assessment_type) {
    var emotion_data = get("Emotion_data");
    switch(self_assessment_type) {
        case SELF_ASSESSMENT_TYPE.PRE:
            emotion_data[emotion].pre_self_assessment = get_self_assessment_result();
            break;
        case SELF_ASSESSMENT_TYPE.POST:
            emotion_data[emotion].post_self_assessment = get_self_assessment_result();
            break;
        default:
            console.error("Something went wrong!");
            return;
    }
    store("Emotion_data", emotion_data);
    return;
}


//========================================
//              Page actions
//========================================

// Helper functions

function store_start_time(emotion) {
    var emotion_data = get("Emotion_data");
    emotion_data[emotion].emotion_activation.start_time = get_time_string();
    console.log(get_time_string());
    console.log(emotion_data);
    store("Emotion_data",emotion_data);
    return;
}


function store_end_time(emotion) {
    var emotion_data = get("Emotion_data");
    emotion_data[emotion].emotion_activation.end_time = get_time_string();

    store("Emotion_data",emotion_data);
    return;
}

// Page specific 
function init() {
    sessionStorage.clear();
    var location = window.location.href;
    var directoryPath = location.substring(0, location.lastIndexOf("/")+1);
    store("Base_path", directoryPath);
}

function start_experiment() {
    // Register time and date
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    store("Date",date);
    store("Start_time",time);

    // Find randomized list of emotions:
    var emotion_list = [EMOTIONS.AFRAID, EMOTIONS.EXCITED, EMOTIONS.RELAXED, EMOTIONS.SAD];
    var shuffled_emotion_list = shuffleArray(emotion_list);
    shuffled_emotion_list.unshift(EMOTIONS.BASELINE);
    
    store("Emotion_list",shuffled_emotion_list);

    // Find randomized list of cognitive distraction tasks:
    var task_list = [TASKS.SUDOKU, TASKS.GEOMETRIC_SHAPE_COPYING, TASKS.FIND_ALL_A,TASKS.MAZE_SOLVING];
    var shuffled_task_list = shuffleArray(task_list);
 
    store("Task_list",shuffled_task_list);


    // Some initial values
    store("Task_index",0);
    store("Emotion_index",0);
    store("Current_emotion", EMOTIONS.BASELINE);

    // Initialize container for emotion_data
    var emotion_data = {
        baseline: {
            pre_self_assessment: {
                result:"",
            },
            emotion_activation: {
                start_time: "",
                end_time: "",
            },
            post_self_assessment: {
                result: "",
            },
        },
        afraid: {
            pre_self_assessment: {
                result:"",
            },
            emotion_activation: {
                start_time: "",
                end_time: "",
            },
            post_self_assessment: {
                result: "",
            },
        },
        excited: {
            pre_self_assessment: {
                result:"",
            },
            emotion_activation: {
                start_time: "",
                end_time: "",
            },
            post_self_assessment: {
                result: "",
            },
        },
        relaxed: {
            pre_self_assessment: {
                result:"",
            },
            emotion_activation: {
                start_time: "",
                end_time: "",
            },
            post_self_assessment: {
                result: "",
            },
        },
        sad: {
            pre_self_assessment: {
                result:"",
            },
            emotion_activation: {
                start_time: "",
                end_time: "",
            },
            post_self_assessment: {
                result: "",
            },
        }
        
    }

    store("Emotion_data",emotion_data);
}


function enter_page() {
    init_language_selector();
    switch(get("Current_page_type")) {
        // case PAGE_TYPES.WELCOME:
        //     update_language()
        //     break;
        case PAGE_TYPES.SELF_ASSESSMENT:
            if (get("Previous_page_type") == PAGE_TYPES.EMOTION_ACTIVATION){
                store("Current_self_assessment_type", SELF_ASSESSMENT_TYPE.POST);
            } else {
                store("Current_self_assessment_type", SELF_ASSESSMENT_TYPE.PRE);
                store("Current_emotion",get_next_emotion_in_list(update_index=true));
            }
            break;
        case PAGE_TYPES.EMOTION_ACTIVATION:
            store_start_time(get("Current_emotion"));
            start_page_timer(10*60); // Timer for 10 minutes
            break;
        case PAGE_TYPES.TASK:
            start_page_timer(4*60); // Timer for 4 minutes.
        default:
            break;
    }
}

function leave_page() {
    switch(get("Current_page_type")) {
        case PAGE_TYPES.CONSENT_FORM:
            store_consent_form();
            break;
        case PAGE_TYPES.QUESTIONNAIRE:
            store_questionnaire();
            break;
        case PAGE_TYPES.SETUP:
            start_experiment()// Change this
            break;
        case PAGE_TYPES.SELF_ASSESSMENT:
            store_self_assessment_form(get("Current_emotion"), get("Current_self_assessment_type"));
            break;
        case PAGE_TYPES.EMOTION_ACTIVATION:
            store_end_time(get("Current_emotion"));
            store("Previous_emotion", get("Current_emotion"));
            break;
        default:
            break;
    }
    window.clearTimeout()
    store("Previous_page_type", get("Current_page_type"));
    store("Previous_page",window.location.pathname);

}

//========================================
//              Navigation
//========================================

function get_next_emotion_in_list(update_index) {
    var current_emotion_index = get("Emotion_index");

    var next_emotion_index = Number(current_emotion_index) + 1;

    if (update_index) {
        store("Emotion_index",next_emotion_index);
    }


    return get("Emotion_list")[next_emotion_index];

}


function get_next_task_in_list() {
    var current_task_index = get("Task_index");
    
    var next_task_index = Number(current_task_index) + 1;
    
    store("Task_index",next_task_index);

    return get("Task_list")[current_task_index];
}


function navigate_to_next_page() {
    switch(get("Current_page_type")) {
        case PAGE_TYPES.WELCOME:
            location.href= get("Base_path") + "pages/" + "consent_form.html";
            break;
        case PAGE_TYPES.CONSENT_FORM:
            const consent = document.getElementById("consent");
            if(consent.checked == true) {
                location.href = get("Base_path") + "pages/" + 'questionnaire.html';
            } else {
                document.getElementById("consent_form_error").style.display = "block";
                console.warn("You have to check the box to continue");
                return;
            }
            break;
        case PAGE_TYPES.QUESTIONNAIRE:
            location.href = get("Base_path") + "pages/" + "setup_phase.html";
            break;
        case PAGE_TYPES.SETUP:
            if(document.getElementById("setup_complete").checked == true) {
                location.href=get("Base_path") + "pages/" + "emotions/baseline.html";
            } else {
                document.getElementById("setup_complete_error").style.display = "block";
                return;
            }
            break;
        case PAGE_TYPES.SELF_ASSESSMENT:
            switch(get("Current_self_assessment_type")){
                case SELF_ASSESSMENT_TYPE.POST:
                    // Here we have done the post-assessment
                    switch(get_next_task_in_list()) {
                        case TASKS.SUDOKU:
                            location.href = get("Base_path") + "pages/" + "tasks/" + 'sudoku.html';
                            break;
                        case TASKS.FIND_ALL_A:
                            location.href = get("Base_path") + "pages/" + "tasks/" + 'find_all_a.html';
                            break;
                        case TASKS.MAZE_SOLVING:
                            location.href = get("Base_path") + "pages/" + "tasks/" + 'maze_solving.html';
                            break;
                        case TASKS.GEOMETRIC_SHAPE_COPYING:
                            location.href = get("Base_path") + "pages/" + "tasks/" + 'geometric_shape_copying.html';
                            break;
                        default:
                            // This happens when we finish the task!
                            location.href = get("Base_path") + "pages/" + "finished.html";
                            break;
                    }
                    break;

                case SELF_ASSESSMENT_TYPE.PRE:
                    // Here we have done the pre-assessment
                    switch(get("Current_emotion")) {
                        case EMOTIONS.SAD:
                            location.href= get("Base_path") + "pages/" + "emotions/" + "sad.html";
                            break;
        
                        case EMOTIONS.RELAXED:
                            location.href= get("Base_path") + "pages/" + "emotions/" + "relaxed.html";
                            break;
                        
                        case EMOTIONS.EXCITED:
                            location.href= get("Base_path") + "pages/" + "emotions/" + "excited.html";
                            break;
        
                        case EMOTIONS.AFRAID:
                            location.href= get("Base_path") + "pages/" + "emotions/" + "afraid.html";
                            break;
                        default:
                            location.href= get("Base_path") + "pages/" + "./final.html";
                            break;
                    }
                    break;
            }
            break;
        case PAGE_TYPES.EMOTION_ACTIVATION:
            location.href=get("Base_path") + "pages/" + "self_assessment.html";
            break;
        case PAGE_TYPES.TASK:
            location.href = get("Base_path") + "pages/" + "self_assessment.html";
            break;
        case PAGE_TYPES.THANK_YOU:
            location.href = get("Base_path") + "pages/" + "final.html";
            break;
        default:
            console.error("Got " + get("Current_page_type"));
            return;         
    }
    leave_page();
}




function navigate_to_previous_page() {// Have to fix this
    console.log(get("Previous_page"));
    location.href = get("Previous_page");

}