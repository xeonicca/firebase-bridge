import { 
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

export const AuthActionType = 'auth'

export const AuthActionEnums = {
  Login: 'login',
  Logout: 'logout',
  CheckStatus: 'checkStatus',
}

const authHandler = {
  [AuthActionEnums.Login]: async () => {
    const auth = getAuth()
    await setPersistence(auth, browserLocalPersistence)
    const user = await authHandler[AuthActionEnums.CheckStatus]()
    if (user) {
      return user
    }
    return signInWithPopup(auth, new GoogleAuthProvider())
  },
  [AuthActionEnums.Logout]: async () => {
    const auth = getAuth()
    return signOut(auth)
  },
  [AuthActionEnums.CheckStatus]: async () => {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe(); // Unsubscribe the listener after getting the state
        if (user) {
          resolve(user); // User is signed in
        } else {
          resolve(null); // User is signed out
        }
      }, (error) => {
        unsubscribe();
        reject(error); // Handle error if any
      });
    })
  }
}

export default async function(action) {
  if (!authHandler[action]) {
    throw new Error(`Invalid auth action: ${action}`);
  }
  return authHandler[action]();
}