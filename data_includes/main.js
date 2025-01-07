PennController.DebugOff();
PennController.ResetPrefix(null);
PennController.Sequence("intro", "counter",  "instructions", "practiceBeginningScreen", "SeperatorScreen_1", "practice", "SeperatorScreen_2", "experiment", "demographic", "participant_observations","feed_back_request", "send_results", "end_of_exp");
//Set Participant Counter
SetCounter("counter","inc", 1);
//Set up Intro
PennController("intro",
    newHtml("intro", "intro.html")
        .settings.log() //collect Consent
        .print()
    ,
    newButton("continue", "Continue")
        .settings.css("font-size", "larger")
        .print()
        .wait(
            getHtml("intro").test.complete()
                .failure(getHtml("intro").warn())
        )
);

//View experiment instructions
PennController("instructions",
    newHtml("instructions", "instructions.html")
        .settings.log()
        .print()
    ,
    newKey("key_1", "")
        .wait(
            getHtml("instructions").test.complete()
                .failure( getHtml("instructions").warn() )
        )
);
//Set up the beginning of the practice section which serves to remind the participants of the controls
PennController("practiceBeginningScreen", 
    newHtml("practiceBeginningScreen", "begin_of_practice.html")
        .settings.log() 
        .print()
    ,
    newKey("key_2", "")
        .wait(
            getHtml("practiceBeginningScreen").test.complete()
                .failure( getHtml("practiceBeginningScreen").warn() )
        )
);
//Set up Seperator Screen
newTrial("SeperatorScreen_1",
    newText("proceed_text", "On the next screen, pressing <b>spacebar</b> will reveal the words in the sentence one word at a time. Press any key now to start the experiment.")
        .print()
        .center()
    ,
    newKey("key_3", " ")
        .wait()
    ,
    getText("proceed_text")
        .remove()
);
//Generate the exercises to allow the participant to practice before the experiment
Template("practice.csv", row =>
  newTrial("practice",
        newTimer("timer_1", 500)
            .start()
            .wait()
        ,
        newController("DashedSentence", {s : row.Sentence})
            .print()
            .center()
            .log()
            .wait()
            .remove()
        ,
        newText("Question", row.Question)
            .css("font-size", "30px")
            .print()
            .center()
        ,
        newButton("Yes_Button_1", "Yes")
        ,
        newButton("No_Button_1", "No")
        ,
        newCanvas("canvas", 500, 100)
            .add( 175, 50, getButton("Yes_Button_1").print().css("font-size", "16px"))
            .add( 290, 50, getButton("No_Button_1").print().css("font-size", "16px"))
            .print()
            .center()
        ,
        newSelector("buttons_1")
            .add( getButton("Yes_Button_1") , getButton("No_Button_1") )
            .keys("Z","M")
            .wait()
            .log()
            .once()
            .remove()
        ,
        getCanvas("canvas")
            .remove()
        ,
        getText("Question")
            .remove())
    .log( "Type", row.Type)
    .log( "List" , row.Group)
    .log( "Question", row.Question)
    .log( "Correct_Option", row.Answer)
    
);

newTrial("SeperatorScreen_2",
    newText("endOfExerciseText1", "<p>You have reached the end of Practice. On to the real experiment! As a reminder, press <b>z</b> if the answer is yes and <b>m</b> if the answer is no.</p>")
        .print()
        .center()
    ,
    newText("endOfExerciseText2", "<p>Press any key to begin.</p>")
        .print()
    ,
    newKey("key_4", " ")
        .wait()
    ,
    getText("endOfExerciseText1")
        .remove()
    ,
    getText("endOfExerciseText2")
        .remove()
);

//Running the actual Experiment now using the main CSV file
Template("stimuli.csv", row =>
  newTrial("experiment",
        newTimer("timer_2", 500)
            .start()
            .wait()
        ,
        newController("DashedSentence", {s : row.Sentence})
            .print()
            .center()
            .log()
            .wait()
            .remove()
        ,
        newText("Question_2", row.Question)
            .css("font-size", "30px")
            .print()
            .center()
        ,
        newButton("Yes_Button_2", "Yes")
        ,
        newButton("No_Button_2", "No")
        ,
        newVar("RT_response").global().set(v_rt => Date.now())
        ,
        newCanvas("canvas_2", 500, 100)
            .add( 175, 50, getButton("Yes_Button_2").print().css("font-size", "16px"))
            .add( 290, 50, getButton("No_Button_2").print().css("font-size", "16px"))
            .print()
            .center()
        ,
        newSelector("buttons_2")
            .add( getButton("Yes_Button_2") , getButton("No_Button_2") )
            .keys("Z","M")
            .log()
            .wait()
            .once()
            .remove()
        ,
        getVar("RT_response").set( v_rt => Date.now() - v_rt )
        ,
        getCanvas("canvas_2")
            .remove())
    //Logging Important Information
    .log( "Type", row.Type)
    .log( "List" , row.Group)
    .log( "Question", row.Question)
    .log( "Correct_Option", row.Answer)
    .log( "RT_response", getVar("RT_response"))
);

//Collecting participant observations prior to ending the experiment
PennController("participant_observations",
    newHtml("participant_observations", "participant_observations.html")
        .settings.log()
        .print()
    ,
    newText("continue_text", "→ Click here to continue")
        .css("color", "blue")
        .print()
    ,
    newSelector("text_Selector")
            .add(getText("continue_text"))
            .wait()
            .log()
            .once()
            .remove()
);


//Set up questions about demographics and collect data for them
PennController("demographic",
    newHtml("demographics", "demographic.html")
        .settings.log() //Collects basic demo Data
        .print()
    ,
    newButton("continue", "Continue")
        .settings.css("font-size", "larger")
        .print()
        .wait(
            getHtml("demographics").test.complete()
                .failure( getHtml("demographics").warn() )
        )
);




//Collecting other general feedback participants may have
PennController("feed_back_request",
    newHtml("feed_back_request", "feed_back_request.html")
        .settings.log()
        .print()
    ,
    newText("continue_text", "→ Click here to continue")
        .css("color", "blue")
        .print()
    ,
    newSelector("text_Selector")
            .add(getText("continue_text"))
            .wait()
            .log()
            .once()
            .remove()
);
//Sending Results
PennController.SendResults("send_results").setOption("countsForProgressBar",false);
//Ending the Experiment
newTrial("end_of_exp",
    newHtml("end_of_exp", "end_of_exp.html")
        .settings.log()
        .print()
    ,
    newButton().wait(getHtml("end_of_exp").test.complete()
            .failure(getHtml("end_of_exp").warn()))
).setOption("countsForProgressBar",false);