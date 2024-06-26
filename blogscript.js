
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
  import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
  
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCyoZOZC-u9KNumXybvegpOKz5XvGhyNns",
    authDomain: "chatapp-1042.firebaseapp.com",
    databaseURL: "https://chatapp-1042-default-rtdb.firebaseio.com",
    projectId: "chatapp-1042",
    storageBucket: "chatapp-1042.appspot.com",
    messagingSenderId: "949568423483",
    appId: "1:949568423483:web:5bd6a0e07dfef848bf3e1e",
    measurementId: "G-PMZJY43K7Z"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const database = getDatabase(app);

  document.addEventListener('DOMContentLoaded', function () { 
	const createPostBtn = document.getElementById('createPostBtn'); 
	const createPostModal = document.getElementById('createPostModal'); 
	const closeModal = document.getElementById('closeModal'); 
	const postForm = document.getElementById('postForm'); 
	const postSubmitBtn = document.getElementById('postSubmitBtn'); 
	const postContainer = document.querySelector('.post-container'); 
	const postDetailModal = document.getElementById('postDetailModal'); 
	const closeDetailModal = document.getElementById('closeDetailModal'); 
	const detailTitle = document.getElementById('detailTitle'); 
	const detailDate = document.getElementById('detailDate'); 
	const detailDescription = document.getElementById('detailDescription'); 

	createPostBtn.addEventListener('click', function () { 
		createPostModal.style.display = 'flex'; 
	}); 

	closeModal.addEventListener('click', function () { 
		createPostModal.classList.add('fadeOut'); 
		setTimeout(() => { 
			createPostModal.style.display = 'none'; 
			createPostModal.classList.remove('fadeOut'); 
		}, 500); 
	}); 

	postForm.addEventListener('submit', function (event) { 
		event.preventDefault(); 

		const postCategory = document.getElementById('postCategory').value; 
		const postTitle = document.getElementById('postTitle').value; 
		const postDescription = document.getElementById('postDescription').value; 

		if (postCategory.trim() === '' || postTitle.trim() === '' || postDescription.trim() === '') { 
			alert('Please fill out all fields.'); 
			return; 
		} 

		const currentDate = new Date(); 
		const day = currentDate.getDate(); 
		const month = currentDate.toLocaleString('default', { month: 'short' }); 
		const year = currentDate.getFullYear(); 
		const formattedDate = day + ' ' + month + ' ' + year; 

		const postId = push(ref(database, 'posts')).key;
		const newPost = {
			id: postId,
			category: postCategory,
			title: postTitle,
			description: postDescription,
			date: formattedDate
		};

		set(ref(database, 'posts/' + postId), newPost).then(() => {
			const postElement = document.createElement('div'); 
			postElement.className = 'post-box'; 
			postElement.innerHTML = `
				<h1 class="post-title" data-title="${postTitle}" data-date="${formattedDate}" data-description="${postDescription}">${postTitle}</h1><br>
				<h2 class="category">${postCategory}</h2><br>
				<span class="post-date">${formattedDate}</span>
				<p class="post-description">${postDescription.substring(0, 100)}...</p>
				<button class="delete-post" data-id="${postId}">Delete</button>
				<span class="load-more" data-title="${postTitle}" data-date="${formattedDate}" data-description="${postDescription}">Load more</span>
			`;

			postContainer.insertBefore(postElement, postContainer.firstChild);
			const postCreatedMessage = document.getElementById('postCreatedMessage'); 
			postCreatedMessage.style.display = 'block'; 
			createPostModal.style.display = 'none'; 
			postForm.reset(); 
			setTimeout(() => { 
				postCreatedMessage.style.display = 'none'; 
			}, 3000);
		}).catch((error) => {
			alert('Error: ' + error.message);
		});
	}); 

	postContainer.addEventListener('click', function (event) { 
		if (event.target.classList.contains('load-more') || event.target.classList.contains('post-title')) { 
			const title = event.target.getAttribute('data-title'); 
			const date = event.target.getAttribute('data-date'); 
			const description = event.target.getAttribute('data-description'); 
			detailTitle.textContent = title; 
			detailDate.textContent = date; 
			detailDescription.textContent = description; 
			postDetailModal.style.display = 'flex'; 
		} 

		if (event.target.classList.contains('delete-post')) { 
			const postId = event.target.getAttribute('data-id'); 
			remove(ref(database, 'posts/' + postId)).then(() => {
				const postToDelete = event.target.closest('.post-box'); 
				postToDelete.classList.add('fadeOut'); 
				setTimeout(() => { 
					postContainer.removeChild(postToDelete); 
				}, 500);
			}).catch((error) => {
				alert('Error: ' + error.message);
			});
		} 
	}); 

	closeDetailModal.addEventListener('click', function () { 
		postDetailModal.classList.add('fadeOut'); 
		setTimeout(() => { 
			postDetailModal.style.display = 'none'; 
			postDetailModal.classList.remove('fadeOut'); 
		}, 500); 
	}); 

	onValue(ref(database, 'posts'), (snapshot) => {
		postContainer.innerHTML = ''; // Clear existing posts
		const posts = snapshot.val();
		if (posts) {
			Object.values(posts).forEach(post => {
				const postElement = document.createElement('div'); 
				postElement.className = 'post-box'; 
				postElement.innerHTML = `
					<h1 class="post-title" data-title="${post.title}" data-date="${post.date}" data-description="${post.description}">${post.title}</h1><br>
					<h2 class="category">${post.category}</h2><br>
					<span class="post-date">${post.date}</span>
					<p class="post-description">${post.description.substring(0, 100)}...</p>
					<button class="delete-post" data-id="${post.id}">Delete</button>
					<span class="load-more" data-title="${post.title}" data-date="${post.date}" data-description="${post.description}">Load more</span>
				`;
				postContainer.appendChild(postElement);
			});
		}
	});
  });

