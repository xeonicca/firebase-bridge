import { initializeApp } from 'firebase/app'
import { AuthActionType, default as authHandler } from './authHandler'
import { DataActionType, default as dataHandler } from './dataHandler'
import { StorageActionType, default as storageHandler } from './storageHandler'

const firebaseConfig = {
  apiKey: "AIzaSyB3iP6TOJSI6sD99QXZ9nx96GyUq9oGqRA",
  authDomain: "at-marker-extension-dev.firebaseapp.com",
  projectId: "at-marker-extension-dev",
  storageBucket: "at-marker-extension-dev.appspot.com",
  messagingSenderId: "789194274107",
  appId: "1:789194274107:web:09b0ef0e8fa68b22b6b31e",
  measurementId: "G-K2GQ9LKX5X"
}

initializeApp(firebaseConfig)


// This code runs inside of an iframe in the extension's offscreen document.
// This gives you a reference to the parent frame, i.e. the offscreen document.
// You will need this to assign the targetOrigin for postMessage.
const PARENT_FRAME = document.location.ancestorOrigins[0]

function sendResponse(result) {
  globalThis.parent.self.postMessage(JSON.stringify(result), PARENT_FRAME)
}

async function handleAction(actionType, action, params) {
  try {
    let res
    switch (actionType) {
      case AuthActionType:
        res = await authHandler(action)
        break
      case DataActionType:
        res = await dataHandler(action, params)
        break
      case StorageActionType:
        res = await storageHandler(action)
        break
      default:
        throw new Error('Unknown action type')
    }
    sendResponse(res)
  } catch (error) {
    sendResponse({ error: error })
  }
}

globalThis.addEventListener('message', async function({ data }) {
  const { action, actionType, params } = data
  handleAction(actionType, action, params)
})