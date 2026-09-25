// v 1.0.1 - 20210409
var grOnloadCallback;
(function ($) {
	var thegrForm, vfFailedClassesOn = false;
	var reCAPTCHAv2Invisible = true; // if false, v2 checkbox is assumed

	$('.cfvsNoReCaptcha').on('click', function(e){
		var theFormToCheck = $(this).parents('form');
		if(dskValidateForm(theFormToCheck)) {
			theFormToCheck.submit();
		} else {
			e.preventDefault();
		}
	});	
	// v2 invisible uses "googleRecaptchaBox" and v2 checkbox uses "g-recaptcha"
	var reCAPTCHAplaceholderClass = reCAPTCHAv2Invisible ? "googleRecaptchaBox" : "g-recaptcha"; 

	//Initiate reCAPTCHA
	grOnloadCallback = function() {
		var allRecConts = document.getElementsByClassName(reCAPTCHAplaceholderClass);
		for(var ii = 0; ii < allRecConts.length; ii++) {
			var curRecCont = allRecConts[ii];
			var theWidgetIDname = curRecCont.getAttribute('id');
			if(!theWidgetIDname) {
				theWidgetIDname = "g-recaptcha-dynamic-el-" + ii;
				curRecCont.setAttribute('id', theWidgetIDname);
			}
			if(reCAPTCHAv2Invisible) {
				var reCaptchaRenderParams = {
					'callback' : function() {thegrForm.submit();},
					'size' : 'invisible'
				};
			} else {
				var reCaptchaRenderParams = {};
			}
			var theWidgetIDtemp = grecaptcha.render(theWidgetIDname, reCaptchaRenderParams);
			var theWidget = document.getElementById(theWidgetIDname);
			theWidget.setAttribute('data-rcwidgetid', theWidgetIDtemp);
		}
		var thegrSubmitBTNs = document.getElementsByClassName('grSubmitBTN');
		for(var ii = 00; ii < thegrSubmitBTNs.length; ii++) {
			var curgrSubmitBTN = thegrSubmitBTNs[ii];
			curgrSubmitBTN.addEventListener('click', function(e){
				e.preventDefault();
				thegrForm = this.form;
				if(dskValidateForm($(thegrForm))) {
					var theWidget = thegrForm.getElementsByClassName(reCAPTCHAplaceholderClass)[0];
					var thegrWidgetID = theWidget.getAttribute('data-rcwidgetid');
					if(reCAPTCHAv2Invisible) {									
						grecaptcha.execute(thegrWidgetID);					
					} else {
						if(grecaptcha.getResponse(thegrWidgetID) == "") {
							e.preventDefault();
							alert("Please show you're not a robot. Check the reCAPTCHA box.");	
						} else {
							thegrForm.submit();
						}					
					}			
				}
			});
			curgrSubmitBTN.classList.add('submitBTNClickable');
		}						
	}
	
	$('.cfValidate input[type=checkbox].cfRequired, .cfValidate input[type=radio].cfRequired').each(function(){
		$("<span class='cfRequiredMark'></span>").insertAfter($(this));
	});
	

	//Run validation checks before submission
	$('.cfValidate').on('focus click', '.validationError', function(e){
		if(e.type === "focusin" || (($(this).attr('type') === 'checkbox' || $(this).attr('type') === 'radio') && e.type === 'click')) {			
			if($(this).attr('type') === 'radio') {
				var curFieldName = $(this).attr('name');
				$(thegrForm).find('input[name="' + curFieldName + '"].validationError').removeClass('validationError')
			} else {
				$(this).removeClass('validationError');			
			}
			if(vfFailedClassesOn) {
				vfFailedClassesOn = false;
				$(this).parents('form').find('.vfActive').removeClass('vfActive vfFailedEmailValidation vfFailedTelephoneValidation');
			}
		}
	});

	//Validate Email
	function emailValidationTest(valToCheck) {
		if(valToCheck.indexOf('..') != -1 || valToCheck.indexOf(' ') != -1) {return false;}
		var firstAtPos = valToCheck.indexOf('@');
		if(firstAtPos === -1 || firstAtPos === 0) {return false;}
		var theUserName = valToCheck.slice(0, firstAtPos);
		var theDomain = valToCheck.slice(firstAtPos + 1);
		var secondAtPos = theDomain.indexOf('@');
		if(secondAtPos != -1) {return false;}
		var theTldPos = theDomain.lastIndexOf('.');
		if(theTldPos === -1) {return false;}
		var theTld = theDomain.slice(theTldPos + 1);
		if(theTld.length < 2) {return false;}
		if(theDomain.length - theTld.length < 2) {return false;}
		var invalidCharsInUsername = [' ', '..', '!', '#', '$', '%', '(', ')', ',', ':', ';', '<', '>', '[', ']', '|'];
		for(var ii = 0; ii < invalidCharsInUsername.length; ii++) {
			var curCharToCheck = invalidCharsInUsername[ii];
			if(theUserName.indexOf(curCharToCheck) != -1) {
				return false;
			}
		}
		return true;
	}
	//Validate Telephone
	function telephoneValidationTest(valToCheck) {
		var matches = valToCheck.match(/\d+/g); 
		if(matches === null) {return false;}
		var valToCheck = '';		
		for(var ii = 0; ii < matches.length; ii++) {			
			valToCheck += matches[ii];
		}
		while(valToCheck.length >= 1 && valToCheck.charAt(0) == 0 || valToCheck.charAt(0)==1) {
			valToCheck = valToCheck.slice(1);		
		}
		if(valToCheck.length < 10) {
			return false;
		}	
		return true;
	}
	
	//The validation script	
	function dskValidateForm(formBeingSubmitted) {
		var safeToSubmit = true;
		var failedEmailField = false;
		var failedTelephoneField = false;
		if(formBeingSubmitted.hasClass('cfValidate')) {
			var reqFields = formBeingSubmitted.find('.cfRequired');
			reqFields.each(function(){
				var curField = $(this);
				var curFieldValidates = true;
				if(curField.attr('type') === 'checkbox') {
					if(!curField.is(':checked')) {
						curFieldValidates = false;
					}			
				} else if(curField.attr('type') === "radio") {
					if(!curField.is(':checked')) {
						var curFieldName = curField.attr('name');
						var curFieldMates = formBeingSubmitted.find('input[name="' + curFieldName + '"]');
						var foundCheckedMate = false;
						for(var ii = 0; ii < curFieldMates.length; ii++) {
							var curFieldMate = curFieldMates[ii];
							if($(curFieldMate).is(':checked')) {
								foundCheckedMate = true;								
								break;
							}						
						}	
						if(!foundCheckedMate) {
							curFieldValidates = false;
						}
					}												
				} else {
					var curFieldValue = curField.val().trim().toLowerCase();
					var placeholderText = curField.attr('data-placeholder');
					if(placeholderText) {
						placeholderText = placeholderText.trim().toLowerCase();
					} else {
						placeholderText = '';
					}
					if(curFieldValue === '' || curFieldValue === placeholderText) {
						curFieldValidates = false;
					}

					var isEmailField = curField.hasClass('cfRequiredEmail');
					var  isTelephoneField = curField.hasClass('cfRequiredTelephone');

					//Validate if email/phone
					if(isEmailField) {
						curFieldValidates = emailValidationTest(curFieldValue);
						if(!curFieldValidates) {
							failedEmailField = true;
						}
					} else if(isTelephoneField) {
						curFieldValidates = telephoneValidationTest(curFieldValue);					
						if(!curFieldValidates) {
							failedTelephoneField = true;
						}
					}
				}
		
				if(!curFieldValidates) {
					curField.addClass('validationError');
					safeToSubmit = false;				
				}			
			});
			if(safeToSubmit) {
				return true; //validates
			} else {
				vfFailedClassesOn = true;
				var theValidationBox = formBeingSubmitted.find('.validationFeedback');
				theValidationBox.addClass('vfActive')
				if(failedEmailField) {
					theValidationBox.addClass('vfFailedEmailValidation');
				}
				if(failedTelephoneField) {
					theValidationBox.addClass('vfFailedTelephoneValidation');				
				}
			}		
		} else {
			return true; //no need to validate
		}
	}
	
	var defaultValidationMessage = `
		<p>Por favor revise los campos resaltados; es un requisito llenarlos.</p>
		<p class="vfFailedEmailValidationPrompt">El correo electrónico no parece ser válido.</p>
		<p class="vfFailedTelephoneValidationPrompt">El número telefónico no parece ser válido.</p>	
	`;
	$('.validationFeedback').each(function(){
		$(this).html(defaultValidationMessage);
	});
}(jQuery));	
head.load("https://www.google.com/recaptcha/api.js?onload=grOnloadCallback&render=explicit");