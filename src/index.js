import { initializeApp } from "firebase/app";
// prettier-ignore
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, serverTimestamp, getDoc, updateDoc } from "firebase/firestore";

// prettier-ignore
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

// which project to connect to?
const firebaseConfig = {
	apiKey: "AIzaSyB1-GccAe4bAna7VhbUb7y7mQa8xtArAEw",
	authDomain: "modern-javascript-net-ni-c9491.firebaseapp.com",
	projectId: "modern-javascript-net-ni-c9491",
	storageBucket: "modern-javascript-net-ni-c9491.appspot.com",
	messagingSenderId: "1023794370741",
	appId: "1:1023794370741:web:d116cb98fe82eb8c58c6fc",
};

// connects us back to the firebase backend
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const collectionRef = collection(db, "books"); // what database to look in and what collection to find?

// queries
// const q = query(collectionRef, where("author", "==", "branden sanderson"), orderBy("createdAt"));
const q = query(collectionRef, orderBy("createdAt"));

// get collection data
getDocs(collectionRef)
	.then((snapshot) => {
		console.log(`---- getDoc() method ----`);
	})
	.catch((err) => console.log(err));

// actively listens to chnage in collection
const unsubCol = onSnapshot(q, (snapshot) => {
	let books = [];
	snapshot.docs.forEach((doc) => {
		books.push({ ...doc.data(), id: doc.id });
	});
	console.log(books); // logs for the first time, and checks if there are any changes in that data
});

// adding documents
const addBookForm = document.querySelector(".add");

addBookForm.addEventListener("submit", (e) => {
	e.preventDefault();

	addDoc(collectionRef, {
		title: addBookForm.title.value,
		author: addBookForm.author.value,
		createdAt: serverTimestamp(),
	}).then(() => {
		addBookForm.reset();
	});
});

// deleting documents
const deleteBookForm = document.querySelector(".delete");

deleteBookForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const docRef = doc(db, "books", deleteBookForm.id.value);

	deleteDoc(docRef).then(() => {
		deleteBookForm.reset();
	});
});

// get single document
const docRef = doc(db, "books", "AdTfwuJB2JNE6A5DmR0v");

getDoc(docRef).then((doc) => console.log(doc.data(), doc.id));

const unsubDoc = onSnapshot(docRef, (doc) => console.log(doc.data(), doc.id));

// updating the document
const updateForm = document.querySelector(".update");

updateForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const docRef = doc(db, "books", updateForm.id.value);

	updateDoc(docRef, {
		title: "the downbad moto",
	}).then(() => {
		updateForm.reset();
	});
});

// signing users up
const signUpForm = document.querySelector(".signup");

signUpForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const email = signUpForm.email.value;
	const password = signUpForm.password.value;

	createUserWithEmailAndPassword(auth, email, password)
		.then((cred) => {
			// console.log("User Created: ", cred.user);
			signUpForm.reset();
		}) // the user that just got signed up
		.catch((err) => console.log(err));
});

// loggging in and logging out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
	signOut(auth)
		// .then(() => console.log(`The user signed out.`))
		.catch((err) => console.log(err.message));
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const email = loginForm.email.value;
	const password = loginForm.password.value;

	signInWithEmailAndPassword(auth, email, password)
		.then((cred) => {
			// console.log(`User has logged in.`, cred.user);
			loginForm.reset();	
		})
		.catch((err) => console.log(err.message));
});

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
	console.log(`User status changed: `, user);
});

// unsubscribing from all changes
const unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener("click", () => {
	console.log(`------- unsubcribing --------`);
	unsubCol();
	unsubDoc();
	unsubAuth();
});