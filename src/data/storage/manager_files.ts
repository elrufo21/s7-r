import supabaseClient from '@/lib/supabase'

const supabase = supabaseClient()

export async function uploadFile(
  bucketName: string,
  filePath: string,
  file: Blob,
  type: Record<string, any>
) {
  console.log(filePath, file, type)
  const res = await supabase.storage.from(bucketName).upload(filePath, file, type)
  return JSON.stringify(res)
}

export async function getPublicUrl(bucketName: string, filePath: string) {
  const res = supabase.storage.from(bucketName).getPublicUrl(filePath)
  return JSON.stringify(res)
}

/**
 *
export async function deleteFile(bucketName: string, filePath: string) {
  console.log('deleteFile', bucketName, filePath)
  const { error } = await supabase.storage.from(bucketName).remove([filePath])
  return error
}

export async function deleteImages(files: FileType[], bucketName: string) {
  if (files != null) {
    let errors = []
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      let error = await deleteFile(bucketName, file.path)

      if (error) errors.push(error)
    }
    return errors
  }
}
 */

/**
 export async function uploadImages(files, bucketName: string) {
   console.log(files)
   if (files != null) {
     const maxFileSize = 300 * 1024
     let listFilesUploaded = []
 
     for (let i = 0; i < files.length; i++) {
       let file = files[i]
 
       if (file.size > maxFileSize) {
         // notify('error', `el archivo ${file.name} es demasiado grande`)
         console.log(`el archivo ${file.name} es demasiado grande`)
         continue
       }
 
       const extension = file.name.split('.').pop()
       const idFile = crypto.randomUUID()
       const uniqueName = `${idFile}.${extension}`
       const filePath = `tmp/${uniqueName}`
 
       let res = await uploadFile(bucketName, filePath, file, {
         contentType: 'image/*',
       })
       let { error: uploadError } = JSON.parse(res)
       if (uploadError) {
         console.error(uploadError)
         continue
       }
 
       let result = await getPublicUrl(bucketName, filePath)
 
       let { data, error } = JSON.parse(result)
 
       if (error) {
         // console.error(urlError);
         console.log(result.error)
         continue
       }
       let publicUrl = data?.publicUrl
       // console.log(publicUrl)
 
       const fileObject = {
         path: filePath,
         publicUrl,
       }
       // console.log(fileObject)
       listFilesUploaded.push(fileObject)
     }
     // console.log(listFilesUploaded)
     return listFilesUploaded
   }
 } 
 */

export async function uploadStringImages(
  base64String: string,
  bucketName: string,
  filePath: string
) {
  const splitString = base64String.split(',')
  const contentType = splitString[0].split(':')[1].split(';')[0]
  const base64 = splitString[1]

  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: contentType })

  const res = await uploadFile(bucketName, filePath, blob, {
    contentType: 'image/*',
  })
  let { error: uploadError } = JSON.parse(res)
  if (uploadError) {
    console.error(uploadError)
    return null
  }

  let result = await getPublicUrl(bucketName, filePath)

  let { data, error } = JSON.parse(result)

  if (error) {
    console.log(error)
    return null
  }
  let publicUrl = data?.publicUrl
  // console.log(publicUrl)

  const fileObject = {
    path: filePath,
    publicUrl,
  }

  return fileObject
}
