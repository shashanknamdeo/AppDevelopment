import {uploadData} from 'aws-amplify/storage';

import {
  // SafeAreaView,
  // View,
  // Text,
  // Button,
  // ScrollView,
  Alert,
  PermissionsAndroid,
  // TouchableOpacity,
  // ActivityIndicator,
  Platform,
} from 'react-native';

import RNFS from 'react-native-fs';

import { 
pick, 
types, 
isCancel 
} from '@react-native-documents/picker';

import { 
list, 
// downloadData, 
getUrl,
 } from 'aws-amplify/storage';

import {log} from './Logger'


const SNK_FOLDER =
  Platform.OS === 'android'
    ? `${RNFS.ExternalStorageDirectoryPath}/Snk`  // if Android
    : `${RNFS.DocumentDirectoryPath}/Snk`;        // if IOS


// ------------------------------------------------------------------------------------------------


function getMimeTypeUsingFileExtension(filename: string){
  // This function guesses the MIME type of a file based on its extension
  // 
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'pdf':
      return 'application/pdf';
    case 'txt':
      return 'text/plain';
    case 'csv':
      return 'text/csv';
    case 'json':
      return 'application/json';
    case 'mp4':
      return 'video/mp4';
    case 'mp3':
      return 'audio/mpeg';
    default:
      return 'application/octet-stream';
  }
};


export async function uploadLocalFileToS3 (file: { path: string; name: string }){
// This function:
//    Takes a file object with path and name.
//    Reads the file from local storage.
//    Converts it to a blob (file data).
//    Uploads it to a storage service (uploadData) under a public/ folder with the right MIME type.
//    Logs success or error.
// 
  try {
    const fileUri = file.path.startsWith('file://') ? file.path : `file://${file.path}`;
    const response = await fetch(fileUri);
    const blob = await response.blob();

    await uploadData({
      path: `public/${file.name}`,
      data: blob,
      options: {
        contentType: getMimeTypeUsingFileExtension(file.name),
      },
    });

    console.log('Uploaded:', file.name);
  } catch (err) {
    console.error('Upload error:', err);
    throw err;
  }
};


export async function uploadLocalStorageFilesToS3 (setS3Files) {
  console.log("Initialize Function : uploadLocalStorageFilesToS3")
  try {
    const files = await RNFS.readDir(SNK_FOLDER);
    for (const file of files) {
      if (!file.isFile()) continue;
      await uploadLocalFileToS3(file);
    }
    Alert.alert('Success', 'Folder synced to S3!');
    await listS3Files(setS3Files);
    console.log("Terminate Function : uploadLocalStorageFilesToS3")
  } catch (err) {
    console.error('Upload folder error:', err);
    Alert.alert('Error', 'Failed to upload folder to S3.');
  }
};


// ------------------------------------------------------------------------------------------------


export async function requestStoragePermission(){
// function that asks the user for storage/media permissions on Android devices.
//    Checks if the platform is Android.
//    If Android 13+ → requests media-specific permissions (images, video, audio).
//    If below Android 13 → requests the old WRITE_EXTERNAL_STORAGE permission.
//    Returns true if permission granted, otherwise false.
//    On iOS (or other platforms) → always returns true.
// 
  if (Platform.OS === 'android') {
    try {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        ]);
        return (
          granted['android.permission.READ_MEDIA_IMAGES'] === PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.READ_MEDIA_VIDEO'] === PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.READ_MEDIA_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'Snk needs access to storage to save files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};


// ------------------------------------------------------------------------------------------------


export async function listFilesOfLocalStorage(folderPath, setLocalFiles) {
    try {
      const files = await RNFS.readDir(SNK_FOLDER);
      setLocalFiles(files.filter(f => f.isFile()).map(f => f.name));
    } catch (err) {
      console.error('List local files error:', err);
    }
  };


export async function removeFileFromLocalStorage(filename, setLocalFiles){
  try {
    const path = `${SNK_FOLDER}/${filename}`;
    await RNFS.unlink(path);
    console.log("removeFileFromLocalStorage - folderPath :", SNK_FOLDER)
    await listFilesOfLocalStorage(SNK_FOLDER, setLocalFiles);
    console.log('Removed', `${filename} deleted from Snk folder.`)
    Alert.alert('Removed', `${filename} deleted from Snk folder.`);
  } catch (err) {
    console.error('Remove file error:', err);
    Alert.alert('Error', `Failed to delete ${filename}`);
  }
};


// ------------------------------------------------------------------------------------------------


export async function pickAndCopyFileToLocalStorage(setLocalFiles){
  console.log("Initialize Function : pickAndCopyFileToLocalStorage")
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Storage permission is required.');
      return;
    }

    const [res] = await pick({ type: [types.allFiles] });
    console.log('Picked file:', res);

    const destPath = `${SNK_FOLDER}/${res.name}`;
    const sourcePath = res.uri.startsWith('file://') ? res.uri : `file://${res.uri}`;

    await RNFS.copyFile(sourcePath, destPath);
    await listFilesOfLocalStorage(SNK_FOLDER, setLocalFiles);

    Alert.alert('Success', `${res.name} copied to Snk folder!`);
    console.log("Terminate Function : pickAndCopyFileToLocalStorage")
  } catch (err) {
    if (isCancel(err)) console.log('User cancelled file picker');
    else {
      console.error('File pick/copy error:', err);
      Alert.alert('Error', 'Failed to copy file to Snk folder.');
    }
  }
};


// ------------------------------------------------------------------------------------------------


export async function listS3Files(setS3Files) {
  console.log("Initialize Function : listS3Files")
  try {
    const result = await list({ path: 'public/' });
    const files = result.items
      .filter(item => item.path !== 'public/')
      .map(item => item.path.replace('public/', ''));
    setS3Files(files); // Error listing files: TypeError: setS3Files is not a function (it is Object) 
    console.log('S3 Files:', files);
    console.log("Terminate Function : listS3Files")
  } catch (err) {
    console.error('Error listing files:', err);
  }
};


// ------------------------------------------------------------------------------------------------


export async function downloadFileFromS3ToLocalStorage(filename, setLocalFiles) {
  console.log("Initialize Function : downloadFileFromS3ToLocalStorage")
  try {
    console.log('Downloading:', filename);

    // Get a signed URL for the file
    const { url } = await getUrl({ path: `public/${filename}` });

    const destPath = `${SNK_FOLDER}/${filename}`;

    // Download file directly to local storage
    const downloadRes = RNFS.downloadFile({
      fromUrl: url.toString(),
      toFile: destPath,
    });

    await downloadRes.promise;

    console.log('Downloaded:', filename, '→', destPath);
    await listFilesOfLocalStorage(SNK_FOLDER, setLocalFiles);
    console.log("Terminate Function : downloadFileFromS3ToLocalStorage")
  } catch (err) {
    console.error('Download error:', err);
    Alert.alert('Error', `Failed to download ${filename}`);
  }
};


export async function downloadAllFilesFromS3ToLocalStorage(s3Files, setLocalFiles) {
  console.log("Initialize Function : downloadAllFilesFromS3ToLocalStorage")
  try {
    if (s3Files.length === 0) {
      Alert.alert('No files', 'No files found in S3 to download.');
      return;
    }

    for (const filename of s3Files) {
      await downloadFileFromS3ToLocalStorage(filename, setLocalFiles);
    }

    Alert.alert('Success', 'All files downloaded to Snk folder.');
    console.log("Terminate Function : downloadAllFilesFromS3ToLocalStorage")
  } catch (err) {
    console.error('Download all error:', err);
    Alert.alert('Error', 'Failed to download all files.');
  }
};