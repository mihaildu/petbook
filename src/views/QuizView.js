/*
 * The quiz page
 * */

import React from "react";

import {Actions} from "../data/PetbookActions";
import Navbar from "./Navbar";

function QuizView(props) {

    function submit_quiz() {
	let post_data = {
	    height: $("input[name=height]:checked").val(),
	    live: $("input[name=live]:checked").val(),
	    clothes: $("input[name=clothes]:checked").val(),
	    personality: $("input[name=personality]:checked").val(),
	    energy: $("input[name=energy]:checked").val(),
	    season: $("input[name=season]:checked").val()
	};
	$.post("/quiz", post_data, (res) => {
	    if (res.success == false) {
		alert(res.message);
		return;
	    }
	    let result = "Your inner pet is a <b>" + res.pet + "</b>!";
	    $("#quiz-res-pet").html(result);
	    $("#quiz-div").hide();
	    $("#res-div").show();
	});
    }

    function quiz_again() {
	/* this will clear prev selected answers */
	window.location.href = "/quiz";

	/* if you want to keep them, do something like */
	//$("#res-div").hide();
	//$("#quiz-div").show();
    }

    return (
	<div>
	  <Navbar logo="text" login={true} friend_requests={[]}
		  unseen_messages={{cnt: 0, users: {}}} />
	  <div id="clear-navbar"></div>
	  <div className="container" id="main-container">

	    <div id="res-div" className="row">
	      <div className="col-md-12">

		<div className="quiz-title">
		  Quiz Result
		</div>

		<div id="quiz-res-pet">
		</div>

		<a onClick={quiz_again}>
		  Take the quiz again
		</a>
		<a href="/">
		  Go back to signup page
		</a>
	      </div>
	    </div>

	    <div id="quiz-div" className="row">
	      <div className="col-md-12">

		<div className="quiz-title">
		  Quiz - Find Your Inner Pet
		</div>

		<div className="quiz-subtitle">
		  Answer the following questions to find
		  out what your inner pet is!
		</div>

		<div className="quiz-question">
		  <label htmlFor="height">
		    1. What is your height?
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="height"
			   value="g185"/>
		    <span className="quiz-option-text">
		      &gt; 1.85cm
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="height"
			   value="175"/>
		    <span className="quiz-option-text">
		      1.75 - 1.85cm
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="height"
			   value="165"/>
		    <span className="quiz-option-text">
		      1.65 - 1.75cm
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="height"
			   value="s165"/>
		    <span className="quiz-option-text">
		      &lt; 1.65cm
		    </span>
		  </label>

		</div>

		<div className="quiz-question">
		  <label htmlFor="live">
		    2. Where would you rather live?
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="live"
			   value="sea"/>
		    <span className="quiz-option-text">
		      By the sea or in a city with a nice beach
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="live"
			   value="rural"/>
		    <span className="quiz-option-text">
		      In a rural area
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="live"
			   value="city"/>
		    <span className="quiz-option-text">
		      In a big city
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="live"
			   value="mountain"/>
		    <span className="quiz-option-text">
		      In a mountain area, surrounded by forest
		    </span>
		  </label>
		</div>

		<div className="quiz-question">
		  <label htmlFor="clothes">
		    3. What type of clothes do you wear?
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="clothes"
			   value="bright"/>
		    <span className="quiz-option-text">
		      Clothes with brigher colors
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="clothes"
			   value="dark"/>
		    <span className="quiz-option-text">
		      Clothes with darker colors
		    </span>
		  </label>
		</div>

		<div className="quiz-question">
		  <label htmlFor="personality">
		    4. What type of a person are you?
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="personality"
			   value="social"/>
		    <span className="quiz-option-text">
		      Social
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="personality"
			   value="introvert"/>
		    <span className="quiz-option-text">
		      Introvert
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="personality"
			   value="shy"/>
		    <span className="quiz-option-text">
		      Shy
		    </span>
		  </label>
		</div>

		<div className="quiz-question">
		  <label htmlFor="energy">
		    5. What best describes you?
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="energy"
			   value="energetic"/>
		    <span className="quiz-option-text">
		      Energetic
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="energy"
			   value="tired"/>
		    <span className="quiz-option-text">
		      Always feeling tired
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="energy"
			   value="normal"/>
		    <span className="quiz-option-text">
		      Not too energetic, but not too tired either
		    </span>
		  </label>
		</div>

		<div className="quiz-question">
		  <label htmlFor="season">
		    6. What is your favourite season?
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="season"
			   value="spring"/>
		    <span className="quiz-option-text">
		      Spring
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="season"
			   value="summer"/>
		    <span className="quiz-option-text">
		      Summer
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="season"
			   value="fall"/>
		    <span className="quiz-option-text">
		      Fall
		    </span>
		  </label>

		  <label className="quiz-option">
		    <input type="radio" name="season"
			   value="winter"/>
		    <span className="quiz-option-text">
		      Winter
		    </span>
		  </label>
		</div>

		<div id="quiz-submit-btn">
		  <input type="submit" value="Submit Answers"
			 name="submit_quiz"
			 className="btn btn-primary btn-lg"
			 onClick={submit_quiz} />
		</div>
	      </div>

	    </div>
	  </div>
	</div>
    );
}

export default QuizView;
