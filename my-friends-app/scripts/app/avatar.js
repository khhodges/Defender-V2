/**
 * Update avatar view model
 */
var app = app || {}; // reuse the existing app or create a new, empty app container

app.avatar = (function () {
	'use strict'; //This JavaScript 1.8.5 (ECMAScript version 5) is a literal expression, 
	//ignored by earlier versions to throw silent errors, fixes mistakes and add optimizations: 
	//strict mode code may run faster and prevents syntax needed for later versions of ECMAScript.

	var avatarViewModel = (function () {
		// View model components see HTML ids
		var $signUpForm;
		var $formFields;
		var $signupInfo;
		var $signupBtnWrp;

		// functional components
		var dataSource;
		var validator;
		var avatarImage;

		var selected = "";

		var updateAvatar = function () {
			var everlive = new Everlive(appSettings.everlive.appId);
			app.helper.convertToDataURL(selected, function (base64Img) {
				everlive.Files.updateContent(app.Users.currentUser.data.Picture, {
												 Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
												 ContentType: "image/jpeg",
												 base64: base64Img
											 },
			
											 function(data) {
												 app.showAlert("Update saved, it can take 24 hours to show up when you log back in!");
											 },
			
											 function(error) {
												 app.showAlert("Update was not saved, please try again later!");
											 }
					)
			}
										, "image/jpeg")
		}

		var newAvatar = function () {
			var everlive = new Everlive(appSettings.everlive.appId);
			app.helper.convertToDataURL(selected, function (base64Img) {
				everlive.Files.updateContent(app.Users.currentUser.data.Picture, {
												 Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
												 ContentType: "image/jpeg",
												 base64: base64Img
											 },
			
											 function(data) {
												 updateUser(data);
												 app.showAlert("Update saved, it can take 24 hours to show up when you log back in!");
											 },
			
											 function(error) {
												 app.showAlert("Update was not saved, please try again later!");
											 }
					)
			}
										, "image/jpeg")
		}
		// Executed after Signup view initialization
		// init form validator
		var init = function () {
			// Get a reference to our sensitive element
			avatarImage = document.getElementById("avatarImage");
			$signUpForm = $('#signUp');
			$formFields = $signUpForm.find('input, textarea, select');
			$signupInfo = $('#signupInfo');
			$signupBtnWrp = $('#signupBtnWrp');
			validator = $signUpForm.kendoValidator({
													   validateOnBlur: false
												   }).data('kendoValidator');

			$formFields.on('keyup keypress blur change input', function () {
				if (validator.validate()) {
					$signupBtnWrp.removeClass('disabled');
				} else {
					$signupBtnWrp.addClass('disabled');
				}
			});

			$signupInfo.on('keydown', app.helper.autoSizeTextarea);
		}

		// Executed after show of the Signup view
		var show = function () {
			$signupInfo.prop('rows', 1);
			dataSource = kendo.observable({
											  
											  Username: app.Users.currentUser.data.Username,
											  Password: '',
											  DisplayName: app.Users.currentUser.data.DisplayName,
											  Email: app.Users.currentUser.data.Email,
											  Gender: app.Users.currentUser.data.Gender,
											  About: app.Users.currentUser.data.About,
											  Friends: app.Users.currentUser.data.Friends,
											  BirthDate: app.Users.currentUser.data.BirthDate,
											  Picture: app.Users.currentUser.data.Picture
										  });
			kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
		};

		var pickImage = function () {
			function success(imageURI) {
				selected = imageURI;
				avatarImage.style.backgroundImage = "url(" + selected + ")";				
				var $updateBtnWrp = $('#updateBtnWrp');
				$updateBtnWrp.removeClass('disabled');
			}

			var error = function () {
				navigator.notification.alert("No selection was detected.");
			};
			var config = {
				//kjhh best result including iphone rotation
				quality: 100, 
				destinationType: navigator.camera.DestinationType.FILE_URI,
				sourceType: navigator.camera.PictureSourceType.CAMERA,
				encodingType: navigator.camera.EncodingType.JPEG,
				correctOrientation: true
			};
			navigator.camera.getPicture(success, error, config);
		};

		return {
			init: init,
			show: show,
			update: updateAvatar,
			showImage: pickImage
		};
	}()
	);

	return avatarViewModel;
}());