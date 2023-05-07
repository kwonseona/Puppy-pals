import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDQf_OjrbqUB4wVKskle0ARi6MqsHdg5rg",
  authDomain: "puppypals-d5a36.firebaseapp.com",
  projectId: "puppypals-d5a36",
  storageBucket: "puppypals-d5a36.appspot.com",
  messagingSenderId: "261840953822",
  appId: "1:261840953822:web:fb9d3782992c55858ffd4f",
}

firebase.initializeApp(firebaseConfig)

export default firebase
