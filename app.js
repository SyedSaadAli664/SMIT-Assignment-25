// Firebase app ka function import karny k liye:
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

  //Get Authentication ka function import karny k liye:
  import { getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
    } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

  import { getFirestore,
    collection,
    addDoc, /* Data base main kisi bhi cheez ko add karna ------------------------------------------------------------------------------------------ */
    getDocs, /* Data base main kisi bhi cheez ko mangwana (get karna) ------------------------------------------------------------------------------------------ */
    doc,
    deleteDoc
   } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDmZDazXsodQ3byRnHeCWc9D8aHxDY5erw",
    authDomain: "todoapp-saadbinmasood.firebaseapp.com",
    databaseURL: "https://todoapp-saadbinmasood-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "todoapp-saadbinmasood",
    storageBucket: "todoapp-saadbinmasood.appspot.com",
    messagingSenderId: "889458855425",
    appId: "1:889458855425:web:e2bb24fababdaea65e7a00"
  };

  // Firebase ko initialize karny k liye:
  const app = initializeApp(firebaseConfig);

  //Firebase Authentication ko initialize karny k liye:
  const auth = getAuth(app);

  //Firebase firestore ko initialize karny k liye:
  const db = getFirestore(app);

//   console.log("app", app);


//take input values for signup: ---------------------------------------------------------------------------------------------------------------------

// const signupEmail = document.getElementById("signup-email").value;
const signupEmail = document.getElementById("signup-email");
// const signupPassword = document.getElementById("signup-password").value;
const signupPassword = document.getElementById("signup-password");
const signupbtn = document.getElementById("signup-btn");

//authbox and userbox ko get kar len:
const authBox = document.getElementById("authBox");
const userBox = document.getElementById("userBox");
const userEmail = document.getElementById("email-id");
const logoutBtn = document.getElementById("logoutbtn");


//Jab "Create account" ka btn click hoga to kuch esa hoga:
signupbtn.addEventListener("click", createUserAccount);

//Sign in ka data mangwanay k liye cheezn yahn se ayn gi ---------------------------------------------------------------------------------------------------------
// const signupEmail = document.getElementById("signup-email").value;
const signinEmail = document.getElementById("signin-email");
// const signupPassword = document.getElementById("signup-password").value;
const signinPassword = document.getElementById("signin-password");
const signinbtn = document.getElementById("signin-btn");

//Jab "Create account" ka btn click hoga to kuch esa hoga:
signinbtn.addEventListener("click", signinAccount );

logoutBtn.addEventListener("click", logout);

//Get todo list
const todoList = document.getElementById("todo-list")

//---------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------

  //Check karo k user loggedin hy ya nhi ---------------------------------------------------------------------------------------------------
  
  onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;

    console.log("user is logged in, grapes");
    authBox.style.display = "none";
    userBox.style.display = "block"
    userEmail.innerHTML = user.email;




  } else {
    console.log("user is not logged in, sed.")

    authBox.style.display = "block";
    userBox.style.display = "none"
    // userEmail.innerHTML = user.email;
  }
});

// ---------------------------------------------------------------------------------------------------

// Jab "Create acc" btn click hua to ye wala function chala: --------------------------------------------------

function createUserAccount(){
    // console.log(signupEmail);
    // console.log(signupPassword)

    createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("User:", user)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
    // ..
  });

}

//---------------------------------------------------------------------------------------------------

// Jab "Sign in" btn click hua to ye wala function chala:

function signinAccount(){
  // console.log(signinEmail.value);
  // console.log(signinPassword.value)

  signInWithEmailAndPassword(auth, signinEmail.value, signinPassword.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("Successfully signed in")
    console.log(db)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
  });
}

//Jab logout ka button click hoga to ya function chaly ga:

function logout(){
signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
}

//Adding shit to DB
    
let numbersCollection = collection(db, "numbers");
let todoCollection = collection(db, "todo");

const todoInput = document.getElementById("todo-input");
const addTodo = document.getElementById("add-todo");

addTodo.addEventListener("click", addTodoToDB)

async function addTodoToDB(){
  try{
    const obj = {
      todo: todoInput.value,
      createAt: new Date().toISOString(),
    }

    const docRef = await addDoc( todoCollection, obj );
    console.log("todo added successfully");
    todoList.innerHTML = "";
    getTodoFromDB()
    todoInput.value = "";
  }
  catch(e){
    console.log(e)
  }
}

getTodoFromDB()
// getTodoFromDB()
// Data base se todos ko get karnay k liye:

async function getTodoFromDB(){
  try{
    const querySnapshot = await getDocs(todoCollection);
    todoList.innerHTML = ''
    querySnapshot.forEach((doc) => {
    // console.log(`${doc.id} => ${doc.data()}`);
    console.log("docsID", doc.id);
    const { todo, createAt } = doc.data();
    console.log(todo, createAt);

    const ele = `<li id="${doc.id}">
    <div>
      <p>${todo}
      <br>
        ${new Date(createAt).toLocaleDateString()} ${new Date(createAt).toLocaleTimeString()}
      </p>
      <button onclick="deleteTodo(this)">delete todo</button>
    </div>
    </li>`

    todoList.innerHTML += ele;
});

  todoList.childNodes.forEach(
    (li) => li.addEventListener("click", deleteTodo)
  )

  }
  catch(e){
    console.log(e);
  }
}

async function deleteTodo(){
  // console.log(this);
  // const docIf = this.id;

  try{
    const docId = this.id;
    const docCollection = doc(db, "todo", docId);
    const docRef = await deleteDoc(docCollection);
    getTodoFromDB();

    console.log("doc deleted:", docRef);
  }
  catch(e){
    console.log(e)
  }
}

    //add shit to DB
    // addNumberToDB();


// async function addNumberToDB(){
//   try {
//     let numbersCollection = collection(db, "numbers");
//   const docRef = await addDoc( numbersCollection, {
//     number: Math.round(Math.random() * 100000),
//   } )
  
//   console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//   console.error("Error adding document: ", e);
// }
// }