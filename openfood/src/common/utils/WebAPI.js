import axios from 'axios';
import { browerHistory } from 'react-router';
//uuid 
import uuid from 'uuid';

import {
	authComplete,
	authError,
	hideSpinner,
	completeLogout,
} from '../actions';

//getCookie
function getCookie(keyName) {
	var name = keyName + '=';
	const cookies = document.cookie.split(';');
	for(let i = 0; i< cookies.length; i++) {
		let cookie = cookies[i];
		while (cookie.charAt(0)==' ') {
			cookie = cookie.substring(1);
		}
		if (cookie.indexOf(name) == 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}
	return "";
}

export default {
	//login api
	login: (dispatch, email, password) => {
		axios.post('/api/login', {
			email: email,
			password: password
		})
		.then((response) => {
			if(response.data.success === false) {
				dispatch(authError());
				dispatch(hideSpinner());
				alert('發生錯誤，請再試一次');
				window.location.reload();
			} else {
			  if (!document.cookie.token) {
			  	let d = new Date();
			  	d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
			  	const expires = 'expires=' + d.toUTCString();
			  	document.cookie = 'token=' + response.data.token + '; ' + expires;
			  	dispatch(authComplete());
			  	dispatch(hideSpinner());
			  	browserHistory.push('/');
			  }
			}
		})
		.catch(function (error) {
			dispatch(authError());
		});
	},
	//logout api
	logout: (dispatch) => {
		document.cookie = 'token=; ' + 'expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		dispatch(hideSpinner());
		browserHistory.push('/');
	},
	//checkapi
	checkAuth: (dispatch, token) => {
	 	axios.put('/api/authenticate', {
	 		token: token,
	 	})
	 	.then((response) => {
	 		if(response.data.success === false) {
	 			dispatch(authError());
	 		} else {
	 			dispatch(authComplete());
	 		}
	 	})
	 	.catch(function (error) {
	 		dispatch(authError());
	 	});
	},
	//get recipes
	getRecipes: () => {
		axios.get('/api/recipes')
		.then((response) => {
		})
		.catch((error) => {
		});
	},
	addRecipe: (dispatch, name, description, imagePath) => {
		const id = uuid.v4();
		axios.post('/api/recipes?token=' + getCookie('token'), {
		  id: id,
		  name: name,
		  description: description,
		  imagePath: imagePath,
		})
		.then((response) => {
		  if(response.data.success === false) {
		  	dispatch(hideSpinner());
		  	alert('發生錯誤，請再試一次!');
		  	browserHistory.push('/');
		  }
		})
		.catch(function (error) {
		});
	},
	//update api
	updateRecipe: (dispatch, recipeId, name, description, imagePath) => {
	  axios.put('/api/recipes/' + recipeId + '?token=' + getCookie('token'), {
	  	id: recipeId,
	  	name: name,
	  	description: description,
	  	imagePath: imagePath,
	  })
	  .then((response) => {
	  	if(response.data.success === false) {
	  		dispatch(hideSpinner());
	  		dispatch(setRecipe({ key: 'recipedId', value: '' }));
	  		dispatch(setUi({ key: 'isEdit', value: false }));
	  		alert('發生錯誤，請再試一次!');
	  		browserHistory.push('/share');
	  	} else {
	  		dispatch(hideSpinner());
	  		window.location.reload();
	  		browserHistory.push('/');
	  	}
	  })
	  .catch(function (error) {
	  });
	},
	// deleteRecipe api
	deleteRecipe: (dispatch, recipeId) => {
	  axios.delete('/api/recipes' + recipeId + '?token=' + getCookie('token'))
	  .then((response) => {
	  	if(response.data.success === false) {
	  	  dispatch(hideSpinner());
	  	  alert('發生錯誤，請再試一次');
	  	  browserHistory.push('/');
	  	} else {
	  		dispatch(hideSpinner());
	  		window.location.reload();
	  		browserHistory.push('/');
	  	}
	  })
	  .catch(function (error) {
	  });
	}
};