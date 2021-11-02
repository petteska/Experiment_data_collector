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
    // Supported languages
    ENGLISH: "en",
    NORWEGIAN: "no",
}

const VIEW_TYPE = {
    EXPERIMENT: "experiment",
    DEVELOPMENT: "development"
}

const PAGE_TYPES = {
    START: "start",
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
    // Distraction tasks
    SUDOKU: "sudoku",
    MAZE_SOLVING: "maze_solving",
    GEOMETRIC_SHAPE_COPYING: "geometric_shape_copying",
    FIND_ALL_A: "find all a",

}

const SELF_ASSESSMENT_TYPE = {
    PRE: "pre",
    POST: "post",
}

const SOUNDS = {
    // file name of different saved sounds
    NONE: "",
    POSITIVE_BEEP: "positive_finish.wav",
}

//========================================
//              Storage
//========================================

function clear_storage(keep) {
    // clear localStorage except for elements in list keep
    var data = [];
    for (var i = 0; i < keep.length; i++) {
        try {
            data.push(get(keep[i]))
            console.log("saving " + keep[i] + " with data " + get(keep[i]));
        } catch {
            console.log("element " + keep[i] + "not in storage");
        }
    }
    localStorage.clear();

    for (var i = 0; i < keep.length; i++) {
        store(keep[i],data[i]);
    }
}

function store(name,data) {
    // Store data on key name in localStorage
    localStorage.setItem(name, JSON.stringify(data));
}

function get(name) {
    // Get data stored on key name from localStorage
    return JSON.parse(localStorage.getItem(name));
    
}

function download_file(filename, data) {
    // Download data as a text-file
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
    // convert specific data stored in localStorage to a JSON string
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
    // Make data stored in localStorage into a printable string
    var data = 
    "ID: " + get("Subject_id") + "\r\n" +
    "Consent: " + get("Consent") + "\r\n" +
    "Date: " + get("Date") + "\r\n" +
    "Start time: " + get("Start_time") + "\r\n" +
    "Emotion order: " + "[" + get("Emotion_list") + "]" + "\r\n" + 
    "Task order: " + "[" + get("Task_list") + "]" + "\r\n" +
    "Comments: " + get("Comments") + "\r\n" +
    "JSON-data: " + "\r\n" + convert_stored_data_to_JSON();

    return data;
}

//========================================
//              Language options
//========================================

function init_language_selector() {
    // Initialize the language selector. Should be runned when entering every page
    let current_language = get("language");
    if(current_language !== null) {
        document.getElementById("language_select").value = current_language;
        document.body.setAttribute('lang', current_language);
    } else {
        update_language();
    }
}

function update_language() {
    // Update language dependent on the input in the settings bar.
    let new_language = document.getElementById("language_select").value;
    store("language", new_language);
    document.body.setAttribute('lang', new_language);
}

//========================================
//              View options
//========================================

function init_view_selector() {
    let current_view = get("view_type");
    if (current_view !== null) {
        document.getElementById("view_select").value = current_view;
    }
    update_view()
}

function update_view() {
    // Update view type based on input from the settings bar.
    let new_view_type = document.getElementById("view_select").value;
    store("view_type", new_view_type)

    let dev_elements = document.getElementsByClassName("development");

    switch (new_view_type) {
        case VIEW_TYPE.EXPERIMENT:
            // Hide all development data
            for (let i = 0; i< dev_elements.length; i++) {
                dev_elements[i].classList.add("hidden")
            }
            break;
        
        case VIEW_TYPE.DEVELOPMENT:
            // Show all development data
            for (let i = 0; i< dev_elements.length; i++) {
                dev_elements[i].classList.remove("hidden")
            }
            break;
    }
    

}

//========================================
//              Helper functions
//========================================

function shuffleArray(array) {
    // Shuffle array
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
    // Get value from radio input
    // elements of type Document.getElementByValue(value)
    for(i = 0; i < elements.length; i++) {
        if(elements[i].checked)
        return elements[i].value;
    }
}

function get_time() {
    // Get current time
    var today = new Date();
    return today.now;
}

function get_time_string() {
    // Get current time in format hh:mm:ss
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
}

function change_text_element(id, new_text) {
    // Change HTML text element with id to new_text.
    try {
        document.getElementById(id).innerText = new_text;
    } catch(error) {
        console.log(error);
    }
}

// function sleep(duration) {
//     // Sleep for duration seconds. Have to be used as follows:
//     // await sleep(duration);


// }

function play_sound(sound_file_path) {
    // Play sound defined in sound (type SOUND)
    let audio = new Audio(sound_file_path);
    audio.play();
}

//========================================
//              Timer
//========================================

function start_page_timer(duration, finish_sound = SOUNDS.NONE) {
    // After duration, a box will popup with a 10 seconds countdown. 
    // After the 10 seconds, the web-interface will switch to the next page.
    console.log("Timer duration:" + duration + "s");

    let current_page = get("Current_page");

    let popup_timer = window.setTimeout(()=>{start_countdown_popup(5, finish_sound)}, duration*1000);


    let check_button_push = window.setInterval(()=>{
        if(get("Current_page") != current_page){
            window.clearTimeout(popup_timer);
            window.clearInterval(check_button_push);
        }
    }, 100);
}

function start_countdown_popup(time_left, finish_sound = SOUNDS.NONE){
    // Show a popup with a time_left seconds countdown. 
    // After the time_left seconds, the web-interface will play finish_sound and switch to the next page.
    let time_left_print = document.getElementById("time_left");

    let current_page = get("Current_page");
    
    show_popup("popup_countdown");

    let count_down = window.setInterval(()=>{
        if(get("Current_page") != current_page){
            window.clearInterval(count_down);
        }
        if (--time_left >= 0) {
            time_left_print.innerText = time_left
        }
        if(time_left == 0) {
            switch (finish_sound) {
                case SOUNDS.NONE:
                    break;
                default:
                    console.log("Playing sound");
                    let sound_path = get("Base_path") + "sounds/" + SOUNDS.POSITIVE_BEEP;
                    play_sound(sound_path);
                    break;
            }
        }
        if(time_left < -1) {
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
    // Show hidden element with id as a popup
    document.getElementById(id).classList.add("show");
    
}

function hide_popup(id) {
    // Hide visible element with id as a popup
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
    let comfort_physic_elements = document.getElementsByName("comfort_physic");
    let comfort_social_elements = document.getElementsByName("comfort_social");
    let sleep_quality_elements = document.getElementsByName("sleep_quality");


    var questionnaire_answers = {
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        last_time_ate:  document.getElementById("ate").value,
        sleep_quality: get_value_radio(sleep_quality_elements),
        comfort_physic: get_value_radio(comfort_physic_elements),
        comfort_social: get_value_radio(comfort_social_elements),
    }

    store("Questionnaire",questionnaire_answers);
}


// Self-assessment form
function get_self_assessment_result() {
    var result = {
        SAM: {
            valence: document.getElementById("sam_valence").value,
            arousal: document.getElementById("sam_arousal").value,
        },
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

function store_start_time(emotion) {
    var emotion_data = get("Emotion_data");
    emotion_data[emotion].emotion_activation.start_time = get_time_string();
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
    var location = window.location.href;
    var directory_path = location.substring(0, location.lastIndexOf("/") + 1);
    store("Base_path", directory_path);
}

function start_new_experiment() {
    // Navigate to welcome page
    navigate_to_page(PAGE_TYPES.WELCOME);
    
    // Clear previous storage
    clear_storage(keep = ["Base_path"]);

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

function continue_from_storage() {
    try {
        var last_recorded_page_type = get("Last_recorded_page_type");
        console.log(last_recorded_page_type);
        switch (last_recorded_page_type) {
            case PAGE_TYPES.EMOTION_ACTIVATION:
                navigate_to_page(PAGE_TYPES.EMOTION_ACTIVATION, get("Current_emotion"));
                break;
            
            case PAGE_TYPES.TASK:
                navigate_to_page(PAGE_TYPES.TASK, get("Current_task"));
                console.log(get("Current_task"));
                break;

            default:
                navigate_to_page(last_recorded_page_type);
                break;

        }
        return true;
    } catch (error) {
        console.error(error);
        return false;        
    }
}

function enter_page() {
    detect_closing_tab();

    var should_update = !(get("Last_recorded_page_type") === get("Current_page_type"));
    if(should_update) {
        console.log("page will be updated");
    } else {
        console.log("Page was reloaded.");
    }
    
    init_language_selector();
    init_view_selector();

    switch(get("Current_page_type")) {
        case PAGE_TYPES.START:
            if (get("Date") !== NaN){
                document.getElementById("prev_session_found").style.display = "block";
                console.log("Previous session found.");
                change_text_element("prev_session_date",get("Date"));
                change_text_element("prev_session_time",get("Start_time"));
                change_text_element("prev_session_page", get("Last_recorded_page_type"));
                
            } else {
                document.getElementById("prev_session_not_found").style.display = "block";
                init();

            }
            break;

        case PAGE_TYPES.SELF_ASSESSMENT:
            if (get("Previous_page_type") == PAGE_TYPES.EMOTION_ACTIVATION){
                store("Current_self_assessment_type", SELF_ASSESSMENT_TYPE.POST);
            } else {
                store("Current_self_assessment_type", SELF_ASSESSMENT_TYPE.PRE);
                if(should_update) {
                    store("Current_emotion",get_next_emotion_in_list(update_index=true));
                }
            }
            break;

        case PAGE_TYPES.EMOTION_ACTIVATION:
            store_start_time(get("Current_emotion"));
            // if (should_update) {
            switch (get("Current_emotion")) {
                case EMOTIONS.BASELINE:
                    start_page_timer(4*60, finish_sound = SOUNDS.POSITIVE_BEEP); // Timer for 4 minutes
                    // start_page_timer(1, finish_sound = SOUNDS.POSITIVE_BEEP);
                    break
                default:
                    start_page_timer(5*60, finish_sound = SOUNDS.POSITIVE_BEEP); // Timer for 5 minutes
                    // start_page_timer(7, finish_sound = SOUNDS.POSITIVE_BEEP); // Timer for 7 minutes
                    break
            }
            // }
            break;

        case PAGE_TYPES.TASK:
            // if (should_update) {
            start_page_timer(4*60, finish_sound = SOUNDS.POSITIVE_BEEP); // Timer for 4 minutes.
            // start_page_timer(4, finish_sound = SOUNDS.POSITIVE_BEEP); // Timer for 4 minutes.
            // }
            break;

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

function get_next_emotion_in_list(update_index = false) {
    var current_emotion_index = get("Emotion_index");

    var next_emotion_index = Number(current_emotion_index) + 1;

    if (update_index) {
        store("Emotion_index",next_emotion_index);
    }

    return get("Emotion_list")[next_emotion_index];
}


function get_next_task_in_list(update_index = false) {
    var current_task_index = get("Task_index");
    
    if(update_index) {
        var next_task_index = Number(current_task_index) + 1;
        store("Task_index",next_task_index);
    }
    return get("Task_list")[current_task_index];
}

function navigate_to_page(page_type, subtype="") {
    // page_type of type PAGE_TYPES (enum)
    // subtype is used to specify subtypes such as emotion type or task type
    switch(page_type) {
        case PAGE_TYPES.START:
            location.href = get("Base_path") + "start.html";
            break;
            
        case PAGE_TYPES.WELCOME:
            location.href=get("Base_path") + "pages/" + "welcome.html";
            break;

        case PAGE_TYPES.CONSENT_FORM:
            location.href = get("Base_path") + "pages/" + 'consent_form.html';
            break;

        case PAGE_TYPES.QUESTIONNAIRE:
            location.href = get("Base_path") + "pages/" + 'questionnaire.html';
            break;

        case PAGE_TYPES.SETUP:
            location.href = get("Base_path") + "pages/" + "setup_phase.html";
            break;

        case PAGE_TYPES.SELF_ASSESSMENT:
            location.href = get("Base_path") + "pages/" + "self_assessment.html";

        case PAGE_TYPES.EMOTION_ACTIVATION:
            switch(subtype) {
                case EMOTIONS.BASELINE:
                    location.href= get("Base_path") + "pages/" + "emotions/" + "baseline.html";
                    break;
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
            }
            break;

        case PAGE_TYPES.TASK:
            switch(subtype) {
                case TASKS.FIND_ALL_A:
                    location.href= get("Base_path") + "pages/" + "tasks/" + "find_all_a.html";
                    break;

                case TASKS.GEOMETRIC_SHAPE_COPYING:
                    location.href= get("Base_path") + "pages/" + "tasks/" + "geometric_shape_copying.html";
                    break;
                
                case TASKS.MAZE_SOLVING:
                    location.href= get("Base_path") + "pages/" + "tasks/" + "maze_solving.html";
                    break;

                case TASKS.SUDOKU:
                    location.href= get("Base_path") + "pages/" + "tasks/" + "sudoku.html";
                    break;
            }
            break;

        case PAGE_TYPES.THANK_YOU:
            location.href= get("Base_path") + "pages/" + "thank_you.html";
            break;
        
        case PAGE_TYPES.FINAL:
            location.href = get("Base_path") + "pages/" + "final.html";
            break;
        
        default:
            console.error("Page does not exist!");
            break;
    }
}


function navigate_to_next_page() {
    switch(get("Current_page_type")) {
        case PAGE_TYPES.START:
            navigate_to_page(PAGE_TYPES.WELCOME);
            break;
        case PAGE_TYPES.WELCOME:
            navigate_to_page(PAGE_TYPES.CONSENT_FORM);
            break;

        case PAGE_TYPES.CONSENT_FORM:
            const consent = document.getElementById("consent");
            if(consent.checked == true) {
                navigate_to_page(PAGE_TYPES.QUESTIONNAIRE);
            } else {
                document.getElementById("consent_form_error").style.display = "block";
                console.warn("You have to check the box to continue");
                return;
            }
            break;

        case PAGE_TYPES.QUESTIONNAIRE:
                navigate_to_page(PAGE_TYPES.SETUP);
            break;

        case PAGE_TYPES.SETUP:
            if(document.getElementById("setup_complete").checked == true) {
                navigate_to_page(PAGE_TYPES.EMOTION_ACTIVATION, EMOTIONS.BASELINE);

            } else {
                document.getElementById("setup_complete_error").style.display = "block";
                return;
            }
            break;

        case PAGE_TYPES.SELF_ASSESSMENT:
            console.log("Navigating from self_assessment");
            switch(get("Current_self_assessment_type")){
                case SELF_ASSESSMENT_TYPE.POST:
                    // Here we have done the post-assessment
                    console.log("Type=post");
                    switch(get_next_task_in_list(update_index = true)) {
                        case TASKS.SUDOKU:
                            navigate_to_page(PAGE_TYPES.TASK, TASKS.SUDOKU);
                            break;
                        case TASKS.FIND_ALL_A:
                            navigate_to_page(PAGE_TYPES.TASK, TASKS.FIND_ALL_A);
                            break;
                        case TASKS.MAZE_SOLVING:
                            navigate_to_page(PAGE_TYPES.TASK, TASKS.MAZE_SOLVING);
                            break;
                        case TASKS.GEOMETRIC_SHAPE_COPYING:
                            navigate_to_page(PAGE_TYPES.TASK, TASKS.GEOMETRIC_SHAPE_COPYING);
                            break;
                        default:
                            // This happens when we finish the task!
                            navigate_to_page(PAGE_TYPES.THANK_YOU);
                            break;
                    }
                    break;

                case SELF_ASSESSMENT_TYPE.PRE:
                    console.log("Type=pre");
                    // Here we have done the pre-assessment
                    switch(get("Current_emotion")) {
                        case EMOTIONS.SAD:
                            navigate_to_page(PAGE_TYPES.EMOTION_ACTIVATION, EMOTIONS.SAD)
                            break;
        
                        case EMOTIONS.RELAXED:
                            navigate_to_page(PAGE_TYPES.EMOTION_ACTIVATION, EMOTIONS.RELAXED)
                            break;
                        
                        case EMOTIONS.EXCITED:
                            navigate_to_page(PAGE_TYPES.EMOTION_ACTIVATION, EMOTIONS.EXCITED)
                            break;
        
                        case EMOTIONS.AFRAID:
                            navigate_to_page(PAGE_TYPES.EMOTION_ACTIVATION, EMOTIONS.AFRAID)
                            break;
                        default:
                            navigate_to_page(PAGE_TYPES.THANK_YOU);
                            break;
                    }
                    break;
            }
            break;

        case PAGE_TYPES.EMOTION_ACTIVATION:
            navigate_to_page(PAGE_TYPES.SELF_ASSESSMENT);
            break;

        case PAGE_TYPES.TASK:
            store("Current_self_assessment_type", SELF_ASSESSMENT_TYPE.PRE);

            navigate_to_page(PAGE_TYPES.SELF_ASSESSMENT);
            break;

        case PAGE_TYPES.THANK_YOU:
            navigate_to_page(PAGE_TYPES.FINAL);
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


//========================================
//              Security
//========================================

function detect_closing_tab() {
    window.addEventListener('beforeunload', () => {
        store("Last_recorded_page_type", get("Current_page_type"));
    })
}

