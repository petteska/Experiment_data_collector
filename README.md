# Experiment_data_collector
This is a web-based application for registering information from a experiment for the experiment of the project performed by Petter Skau-Nilsen during the autumn of 2021.

---

## How to run:
Open the file `start.html` in your favorite browser. Then you are good to go! All the information should be clearly described on each page.

### Storage
Everything on this page is running locally in your browser. All data is saved to the session storage. Since everything is loaded in the session storage, it is important that you do not close the browser or the open tab during the experiment. This will result in all the data being deleted.

### Download the result
At the end you are able to download the resulting data as a `.txt` file. When pushing the button `Save the data`, a file will be downloaded. This file contains a summary of the most important information in a readable format, as well as a JSON string containing an object as describet in the section "JSON data".

---

## Data
### JSON object:
The JSON object is a JSON string of the following object:
````JS
{
    id: String , // ID provided by user
    consent: Boolean, // true/false
    start_date: String, // "yy.mm.dd"
    start_time: String, // "hh.mm.ss",
    questionnaire_answer: {
        age: Number, // age
        gender: String, // male/female/other
        last_time_ate: String, // hh:mm
        sleep_quality: Number, // 0-6
        comfort_physic: Number, // 0-6
        comfort_social: Number, // 0-6
    },
    emotion_list: Array, // List of emotions in order presented to user (list of strings)
    task_list: Array, // List of distraction tasks in order presented to user (list of tasks)
    emotion_data: {
        baseline: {
            pre_self_assessment: {
                result: {
                    valence: Number, // 0 - 10
                    arousel: Number, // 0 - 10
                },
            }
            emotion_activation: {
                start_time: String, // hh:mm:ss
                end_time: String, // hh:mm:ss
            },
            post_self_assessment: {
                result: {
                    valence: Number, // 0 - 10
                    arousel: Number, // 0 - 10
                },
            }
        } 
        afraid: {
            pre_self_assessment: {
                result: {
                    valence: Number, // 0 - 10
                    arousel: Number, // 0 - 10
                },
            }
            emotion_activation: {
                start_time: String, // hh:mm:ss
                end_time: String, // hh:mm:ss
            },
            post_self_assessment: {
                result: {
                    valence: Number, // 0 - 10
                    arousel: Number, // 0 - 10
                },
            }
        }
        excited: {
            pre_self_assessment: {
                result: {
                    valence: Number, // 0 - 10
                    arousel: Number, // 0 - 10
                },
            }
            emotion_activation: {
                start_time: String, // hh:mm:ss
                end_time: String, // hh:mm:ss
            },
            post_self_assessment: {
                result: {
                    valence: Number, // 0 - 10
                    arousel: Number, // 0 - 10
                },
            }
        }
        relaxed: {
            pre_self_assessment: {
                result: {
                    valence: Number, // 0 - 10
                    arousel: Number, // 0 - 10
                },
            }
            emotion_activation: {
                start_time: String, // hh:mm:ss
                end_time: String, // hh:mm:ss
            },
            post_self_assessment: {
                result: {
                    valence: Number, // 0 - 10
                    arousel: Number, // 0 - 10
                },
            }
        }
        sad: {
            pre_self_assessment: {
                result: {
                    valence: Number, // 0 - 10
                    arousel: Number, // 0 - 10
                },
            }
            emotion_activation: {
                start_time: String, // hh:mm:ss
                end_time: String, // hh:mm:ss
            },
            post_self_assessment: {
                result: {
                    valence: Number, // 0 - 10
                    arousel: Number, // 0 - 10
                },
            }
        }
    }
}
````