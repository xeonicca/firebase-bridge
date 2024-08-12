import { getFirestore, doc, collection, query, where,
  setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';

export const DataActionType = 'data'

export const DataActionEnums = {
  Create: 'create',
  Read: 'read',
  Update: 'update',
  Set: 'set',
  Delete: 'delete',
  Check: 'check',
}

const modelName = 'events'

const dataHandler = {
  [DataActionEnums.Create]: async (key, payload) => {
    const db = getFirestore()
    const docRef = doc(db, modelName, key)
    await setDoc(docRef, payload)
    return { id: key, ...payload }
  },
  [DataActionEnums.Update]: async (key, payload) => {
    const db = getFirestore()
    const docRef = doc(db, modelName, key)
    await updateDoc(docRef, payload)
    return { id: key, ...payload }
  },
  [DataActionEnums.Delete]: async (key) => {
    const db = getFirestore()
    const docRef = doc(db, modelName, key)
    await deleteDoc(docRef)
    return { id: key }
  },
  [DataActionEnums.Read]: async () => {
    const result = []
    const db = getFirestore()
    const collectionRef = collection(db, modelName)
    const querySnapshot = await getDocs(collectionRef)
    querySnapshot.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data()})
    })
    return result
  },
  [DataActionEnums.Set]: async () => dataHandler[DataActionEnums.Create],
  [DataActionEnums.Check]: async (trackSection, trackId) => {
    const db = getFirestore()
    const queryRef = query(collection(db, modelName), 
      where('trackSection', '==', trackSection),
      where('trackId', '==', trackId))
    const docSnap = await getDocs(queryRef)
    return { exist: docSnap.size > 0 }
  }
}

export default async function(action, params) {
  if (!dataHandler[action]) {
    throw new Error(`Invalid data action: ${action}`);
  }
  return dataHandler[action].apply(null, params);
}