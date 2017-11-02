/* The sign up menu
 *
 * TODO
 *   value= auto completion
 *   move pet type options to a different file
 * */

import React from "react";

/* TODO might not need this after all */
import {Actions} from "../data/PetbookActions.js";

function SignUpView(props) {
    /*
     * normally values should be in props
     * until I find a proper way to avoid input locking
     * the values will be set with jquery
     * */

    /* TODO read values from pet_list and map them to options */

    return (
	<div id="signup-menu">
	  <div id="signup-title">
	    Sign Up
	  </div>
	  Just add your pet's information below and sign up. It's free!<br/>
	  Don't have a pet? Take our <a href="/quiz">quiz</a> to find
	  out what your inner pet is.

	  <form method="post" className="form" id="signup-form">
	    <div className="row">
	      <div className="col-md-6">
		<div className="form-group">
		  <input type="text" name="first_name_signup"
			 placeholder="First Name"
			 className="form-control"
			 />
		</div>
	      </div>
	      <div className="col-md-6">
		<div className="form-group">
		  <input type="text" name="last_name_signup"
			 placeholder="Last Name"
			 className="form-control"
			 />
		</div>
	      </div>
	    </div>

	    <div className="row">
	      <div className="col-md-12">
		<div className="form-group">
		  <input type="email" name="email_signup"
			 placeholder="Email Address"
			 className="form-control"
			 />
		</div>
	      </div>
	    </div>

	    <div className="row">
	      <div className="col-md-12">
		<div className="form-group">
		  <input type="password" name="password_signup"
			 placeholder="Password"
			 className="form-control"
			 />
		</div>
	      </div>
	    </div>

	    <div className="row" id="pet-type-row">
	      <div className="form-group">
		<div className="col-md-12">
		  <label htmlFor="pet-select" className="pet-text">
		    What type of animal is your pet?
		  </label>
		</div>
		<div className="col-md-3">
		  <select className="form-control" id="pet-select"
			  name="pet_type_signup">
		    <option value="Cat">Cat</option>
		    <option value="Dog">Dog</option>
		    <option value="Potato">Potato</option>
		  </select>
		</div>
	      </div>
	    </div>

	    <div className="row" id="pet-gender-row">
	      <div className="form-group">
		<div className="col-md-12">
		  <label htmlFor="pet-gender" className="pet-text">
		    What gender is your pet?
		  </label>
		</div>
		<div className="col-md-6">
		  <label className="pet-text">
		    <input type="radio" name="pet_gender_signup"
			   value="Female" id="pet_gender_female" />Female
		  </label>
		  <label className="pet-text" id="pet-gender-male">
		    <input type="radio" name="pet_gender_signup"
			   value="Male" id="pet_gender_male" />Male
		  </label>
		</div>
	      </div>
	    </div>

	    <div className="row" id="pet-bday-row">
	      <div className="form-group">
		<div className="col-md-12">
		  <label htmlFor="pet-bday" className="pet-text">
		    What is your pet's birthday?
		  </label>
		</div>
		<div className="col-md-4">
		  <input type="date" className="form-control"
			 name="pet_bday_signup" />
		</div>
	      </div>
	    </div>

	    <div className="row" id="signup-btn-row">
	      <div className="col-md-3" id="signup-btn-col">
		<div className="form-group">
		  <input type="submit" value="Create Account"
			 name="submit_create_signup"
			 className="btn btn-primary btn-lg"
			 id="signup-create-btn" />
		</div>
	      </div>
	      <div className="col-md-3">
		<div className="form-group">
		  <input type="submit" value="Use Guest Account"
			 name="submit_guest_signup"
			 className="btn btn-primary btn-lg"
			 id="signup-guest-btn" />
		</div>
	      </div>

	    </div>
	  </form>
	</div>
    );
}

export default SignUpView;
