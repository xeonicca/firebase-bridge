import { getFirestore, doc, collection, query, where,
  setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'
import ShortUniqueId from 'short-unique-id'

export const DataActionType = 'data'

export const DataActionEnums = {
  Create: 'create',
  Read: 'read',
  Update: 'update',
  Set: 'set',
  Delete: 'delete',
  Query: 'query',
}

const modelName = 'events'


const dataHandler = {
  [DataActionEnums.Create]: async (payload) => {
    const db = getFirestore()
    const uid = new ShortUniqueId({ length: 10 })
    const id = uid.rnd().toLowerCase()
    const docRef = doc(db, modelName, id)
    await setDoc(docRef, payload)
    return { id, ...payload }
  },
  [DataActionEnums.Update]: async (id, payload) => {
    const db = getFirestore()
    const docRef = doc(db, modelName, id)
    await updateDoc(docRef, payload)
    return { id: id, ...payload }
  },
  [DataActionEnums.Delete]: async (id) => {
    const db = getFirestore()
    const docRef = doc(db, modelName, id)
    await deleteDoc(docRef)
    return { id }
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
  [DataActionEnums.Query]: async (eventType, trackSection = null, trackId = null) => {
    const result = []
    const conditions = []
    if (trackSection) conditions.push(where('trackSection', '==', trackSection))
    if (trackId) conditions.push(where('trackId', '==', trackId))
    const db = getFirestore()
    const queryRef = query(collection(db, modelName), 
      where('eventType', '==', eventType),
      ...conditions)
    const querySnapshot = await getDocs(queryRef)
    querySnapshot.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data()})
    })
    return result
  }
}

export default async function(action, params) {
  if (!dataHandler[action]) {
    throw new Error(`Invalid data action: ${action}`);
  }
  return dataHandler[action].apply(null, params);
}