import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { DataActionEnums, default as dataHandler } from './dataHandler'

export const StorageActionType = 'storage'

export const StorageActionEnums = {
  Upload: 'upload',
  Download: 'download',
}

const filePath = 'events'
const filename = 'manifest.json'

const storageHandler = {
  [StorageActionEnums.Upload]: async () => {
    const storage = getStorage()
    const fileRef = ref(storage, `${filePath}/${filename}`)
    const data = await dataHandler(DataActionEnums.Read)
    const jsonString = JSON.stringify(transformer(data))
    const blob = new Blob([jsonString], { type: 'application/json' })
    await uploadBytes(fileRef, blob)
    return {
      status: 'success',
      message: 'File uploaded successfully',
    }
  },
  [StorageActionEnums.Download]: async () => {
    const storage = getStorage()
    const fileRef = ref(storage, `${filePath}/${filename}`)
    return getDownloadURL(fileRef)
  },
}

const transformer = (data) => {
  return data.reduce((acc, criteria) => {
    const trackSection = criteria.trackSection

    if (!acc[trackSection]) {
      acc[trackSection] = []
    }

    acc[trackSection].push(criteria)
    return acc
  }, {})
}

export default async function (action) {
  if (!storageHandler[action]) {
    throw new Error(`Invalid storage action: ${action}`)
  }
  return storageHandler[action]()
}
