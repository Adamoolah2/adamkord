import './App.css';

import firebase from 'firebase/compat/app'; 
  import 'firebase/compat/firestore';
  import 'firebase/compat/auth';

import {useAuthState, useSignInWithGoogle} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import { useState } from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyCwQGcN3v-tSOhHuoDCkZJ0HwWSIGORC60",
  authDomain: "adamkord-bdd01.firebaseapp.com",
  projectId: "adamkord-bdd01",
  storageBucket: "adamkord-bdd01.appspot.com",
  messagingSenderId: "655892626506",
  appId: "1:655892626506:web:4d6b0454b73a93073afab3",
  measurementId: "G-3WE2PCT1Y7"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const[user] = useAuthState(auth);
  return (
    <div className="App">
      <header className>

      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){

  const useSignInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={useSignInWithGoogle}>Sign In with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'})

  const[formValue, setFormValue ] = useState('')

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
  }

  return(
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </div>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

      <button type="submit">✈️</button>
    </form>
    </>
  )
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src ={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
