// PennController.DebugOff();
PennController.ResetPrefix(null);
Header(
// void
)
.log( "sonaID" , GetURLParameter("id") )
DebugOff()
PennController.Sequence("consent", "counter",  "instructions", "practiceBeginningScreen", "practice", "experimentBeginningScreen", "experiment", "participant_observations", "demographic","feed_back_request", "send_results", "end_of_exp");
//Set Participant Counter
SetCounter("counter","inc", 1);
//Set up Intro
PennController("consent",
    newHtml("consent", "ucdavis_consent.html")
        .settings.log() //collect Consent
        .print()
    ,
    newButton("continue", "Continue")
        .settings.css("font-size", "larger")
        .print()
        .wait(
            getHtml("consent").test.complete()
                .failure(getHtml("consent").warn())
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
// //Set up Seperator Screen
// newTrial("SeperatorScreen_1",
//     newText("proceed_text", "On the next screen, pressing <b>spacebar</b> will reveal the words in the sentence one word at a time. Press any key now to start the experiment.")
//         .css("font-size", "25px")
//         .print()
//         .center()
//     ,
//     newKey("key_3", "")
//         .wait()
//     ,
//     getText("proceed_text")
//         .remove()
// );
//Generate the exercises to allow the participant to practice before the experiment
Template("practice.csv", row =>
  newTrial("practice",
        newTimer("timer_1", 500)
            .start()
            .wait()
        ,
        newController("DashedSentence", {s : row.Sentence})
            .css("font-size", "25px")
            .print()
            .center()
            .log()
            .wait()
            .remove()
        ,
        newText("Question", row.Question)
            .css("font-size", "25px")
            .print()
            .center()
        ,
        newButton("Yes_Button_1", "Yes (Z)")
        ,
        newButton("No_Button_1", "No (M)")
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

PennController("experimentBeginningScreen", 
    newHtml("experimentBeginningScreen", "begin_of_experiment.html")
        .settings.log() 
        .print()
    ,
    newKey("key_3", "")
        .wait(
            getHtml("experimentBeginningScreen").test.complete()
                .failure( getHtml("experimentBeginningScreen").warn() )
        )
);

//Running the actual Experiment now using the main CSV file
Template("stimuli.csv", row =>
  newTrial("experiment",
        newTimer("timer_2", 500)
            .start()
            .wait()
        ,
        newController("DashedSentence", {s : row.Sentence})
            .css("font-size", "25px")
            .print()
            .center()
            .log()
            .wait()
            .remove()
        ,
        newText("Question_2", row.Question)
            .css("font-size", "25px")
            .print()
            .center()
        ,
        newButton("Yes_Button_2", "Yes (Z)")
        ,
        newButton("No_Button_2", "No (M)")
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
//newTrial("end_of_exp",
//    newHtml("end_of_exp", "end_of_exp.html")
//        .settings.log()
//        .print()
//    ,
//    newButton().wait(getHtml("end_of_exp").test.complete()
//            .failure(getHtml("end_of_exp").warn()))
//).setOption("countsForProgressBar",false);
newTrial( "end_of_exp" ,
     newText('<div style="width: 50em; padding-right: 50px;padding-left: 50px; font-size: 1.5em"><p>Thank you for your participation!</p>')
//          .center()
          .print()
     ,
     newText("<p><a href='https://ucdavis.sona-systems.com/webstudy_credit.aspx?experiment_id=3675&credit_token=9720da8a96144b5b829464e000827548&survey_code="+GetURLParameter("id")+"' target='_blank'>Click here to confirm your participation on SONA.</a></p> <p>This is a necessary step in order for you to receive participation credit!</p>")
//          .center()
          .print()
     ,
     newText("<p>This experiment was a part of a group of experiments looking at <i> syntactic adaptation </i> for garden path sentences. Garden path sentences are grammatically correct sentences where the reader starts off with a likley interpretation of the sentence but has to revaulate this interpretation at a later point in the sentence. For example consider the sentence:<blockquote> (1) The soldiers warned about the dangers conducted the midnight raid </blockquote>In this sentence we start off by thinking that the soldiers were the ones who were warning about the dangers. However when we get to 'conducted' this interpretation is no longer plausible. In order for the sentence to make sense, we have to reintepret it as meaning that the soldiers <i> who were </i> warned about the dangers were the ones conducting the midnight raid. </p>")
//          .center()
          .print()
     ,
     newText("<p>People tend to take longer to read ambiguous garden path sentences ('The soldiers warned about the dangers ...') than the unambiguous non-garden path sentences ('The soldiers <i> who were </i> were warned about the dangers ...'). This difference in reading times is referred to as the <i> garden path effect </i>. The main question that we were interested in answering with these group of experiments is whether we can alter the frequencies of different kinds of sentences to reduce this garden path effect. In other words can we get people to start expecting sentences like (1) more either by showing them more sentences like (1), other sentences with relative clauses (ex. 'The pizza <i> that I ate yesterday </i> was delicious') or other unexpected sentences?</p>")
//          .center()
          .print()
     ,
     newText("<p>After you have followed the link above to receive your SONA credit, you can close this Browser tab.  Thanks again for participating in the experiment!</p>")
//          .center()
          .print()
     ,
     newButton("void")
          .wait()
).setOption("countsForProgressBar",false);