import {

    auth
    
    }
    
    from "../firebase.js";
    
    import {
    
    createUserWithEmailAndPassword,
    
    signInWithEmailAndPassword,
    
    signOut
    
    }
    
    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
    
    // Register
    
    export async function register(email,password){
    
    return await createUserWithEmailAndPassword(
    
    auth,
    
    email,
    
    password
    
    );
    
    }
    
    // Login
    
    export async function login(email,password){
    
    return await signInWithEmailAndPassword(
    
    auth,
    
    email,
    
    password
    
    );
    
    }
    
    // Logout
    
    export async function logout(){
    
    return await signOut(auth);
    
    }