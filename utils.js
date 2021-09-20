const EMOTIONS = {
    BASELINE: "baseline",
    HAPPY: "happy",
    AFRAID: "afraid",
    SAD: "sad",
    RELAXED: "relaxed",
}

const ACTIONS = {
    PRE_SELF_ASSESSMENT: "pre-self-assessment",
    EMOTION_ACTIVATION: "emotion-activation",
    POST_SELF_ASSESSMENT: "post-self-assessment",
}

const PAGE_TYPES = {
    WELCOME: "welcome",
    CONSENT_FORM: "consent-form",
    QUESTIONNAIRE: "questionnaire",
    SETUP: "setup",
    SELF_ASSESSMENT: "self-assessment",
    EMOTION_ACTIVATION: "emotion-activation",
    FINAL: "final",
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

function start_self_assessment() {
    // Register time and date
    var today = new Date();
    //  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    



}



function get_self_assessment_result() {
    var emotion_scale_elements = document.getElementsByName("emotion_scale");
    var result = {
        SAM: {
            valence: document.getElementById("sam_valence").value,
            arousal: document.getElementById("sam_arousal").value,
        },
        emotion_scale: get_value_radio(emotion_scale_elements),
    }

    return result;
}



function start_experiment() {
    // Register time and date
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    store("Date",date);
    store("Time",time);

    // Find randomized list of tasks:

    var tasks = [EMOTIONS.AFRAID, EMOTIONS.HAPPY, EMOTIONS.RELAXED, EMOTIONS.SAD];
    var ordered_tasks = shuffleArray(tasks);
    for(var i = 0; i < ordered_tasks.length; i++){
        store("Emotion_" + (i + 1), ordered_tasks[i]); 
    }

    store("Index",0);
    store("Current_emotion", EMOTIONS.BASELINE);
    store("Current_action", ACTIONS.PRE_SELF_ASSESSMENT);

    var emotions = {
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
        happy: {
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

    store("Emotions",JSON.stringify(emotions));
    location.href="./baseline.html";
}


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

    store("questionnaire",JSON.stringify(questionnaire_answers));
}


function navigate_to_next_page() {
    store("Previous_emotion",get("Current_emotion"));
    switch(get("Current_page_type")){
        case PAGE_TYPES.WELCOME:
            console.log("Navigating from " + get("Current_page_type"));
            location.href="./consent_form.html";
            return;
        case PAGE_TYPES.CONSENT_FORM:
            console.log("Navigating from " + get("Current_page_type"));

            const consent = document.getElementById("consent");
            if(consent.checked == true) {
                console.log("true")
                store("Consent","true");
                location.href='./questionnaire.html'
            } else {
                console.log("false")
                let result = document.getElementById("consent_form_feedback");
                result.innerText = "You cannot continue before you have checked the consent form. Talk to the examiner if you have any questions.";
            }
            return;
        case PAGE_TYPES.QUESTIONNAIRE:
            console.log("Navigating from " + get("Current_page_type"));

            store_questionnaire();
            location.href="./setup_phase.html"
            return;
        case PAGE_TYPES.SETUP:
            console.log("Navigating from " + get("Current_page_type"));
            if(document.getElementById("setup_complete").checked == true) {
                start_experiment()
                console.log("true");
            } else {
                console.warn("You have to check the box to continue");
                return;
            }
            return;
        case PAGE_TYPES.SELF_ASSESSMENT:
            console.log("Navigating from " + get("Current_page_type"));

            var emotions = JSON.parse(get("Emotions"));
            var current_emotion = get("Current_emotion");

            console.log("Action: " + get("Current_action"));
            console.log("Emotion: " + current_emotion);
            

            switch(get("Current_action")){
                case ACTIONS.PRE_SELF_ASSESSMENT:
                    emotions[current_emotion].pre_self_assessment = get_self_assessment_result();
                    // console.log(get_self_assessment_result());
                    // console.log(emotions[current_emotion].pre_self_assessment);
                    // console.log("Pre");
                    break;
                case ACTIONS.POST_SELF_ASSESSMENT:
                    emotions[current_emotion].post_self_assessment = get_self_assessment_result();
                    console.log("Post");
                    break;
                default:
                    console.error("Something went terribly wrong!!");
                    return;
            }
            console.log(emotions[current_emotion].pre_self_assessment);

            store("Emotions",JSON.stringify(emotions));
            break;

        default:
            console.error("Got " + get("Current_page_type"));
            return;
            
    }

    var current_index = get("Index");
    console.log("Current index: " + current_index);
    var next_index = Number(current_index) + 1;
    console.log("Next index: " + next_index);

    
    switch(get("Emotion_" + next_index)) {
        case EMOTIONS.SAD:
            location.href='./sad.html';
            break;

        case EMOTIONS.RELAXED:
            location.href='./relaxed.html';
            break;
        
        case EMOTIONS.HAPPY:
            location.href='./happy.html';
            break;

        case EMOTIONS.AFRAID:
            location.href='./afraid.html';
            break;
        default:
            // location.href='./final.html';
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