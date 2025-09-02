
import { signOut, getCurrentUser } from 'aws-amplify/auth';

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
uploadData, 
getUrl, 
// downloadData, 
 } from 'aws-amplify/storage';

import {functionLog} from './Logger'

functionLog("Initialize File -> StorageScreenFunctions")

const LOCAL_ROOT_FOLDER =
  Platform.OS === 'android'
    ? `${RNFS.ExternalStorageDirectoryPath}/Snk`  // if Android
    : `${RNFS.DocumentDirectoryPath}/Snk`;        // if IOS


// ------------------------------------------------------------------------------------------------


export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


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
      console.warn('getMimeTypeUsingFileExtension -> Known-Mime-type', filename)
      return 'application/octet-stream';
  }
};


export async function uploadLocalStorageFilesToS3(localPath: string, file_prefix: string, filename: string) {
// This function:
//    Takes a single file object with localPath (file path) and s3key (where in s3, file has to copy).
//    Reads the file from local storage.
//    Converts it to a blob (file data).
//    Uploads it to a storage service (uploadData) with the right MIME type.
//    Logs success or error.
  functionLog("Initialize Function : uploadLocalStorageFilesToS3");

  try {
    // Normalize URI
    const s3Key = `${file_prefix}/${filename}`;
    const fileUri = localPath.startsWith("file://") ? localPath : `file://${localPath}`;

    // Read local file as blob
    const response = await fetch(fileUri);
    const blob = await response.blob();

    // Start upload
    const uploadTask = uploadData({
      path: s3Key,
      data: blob,
      options: {
        contentType: getMimeTypeUsingFileExtension(localPath),
      },
    });

    // Wait for completion (this resolves only when upload succeeds/fails)
    const result = await uploadTask.result;

    // If we reach here, upload is SUCCESS
    functionLog(`✅ Uploaded: ${fileUri} -> ${s3Key}`);
    functionLog("Terminate Function : uploadLocalStorageFilesToS3");
    return result;

  } catch (err) {
    console.error("❌ Upload error:", err);
    throw err;
  }
}



export async function uploadLocalStorageFilesToS3Recursively(localPath= LOCAL_ROOT_FOLDER, s3_data_folder_path: string = ""){
// This function:
//     Takes a Folder and upload files and folder recursively in s3
//     folder apth in s3 decide on the folder path in local storege
  functionLog("Initialize Function : uploadLocalStorageFilesToS3Recursively")
  functionLog(s3_data_folder_path)
  try {
    const items = await RNFS.readDir(localPath);

    for (const item of items) {
      if (item.isFile()) {
        // File → upload directly
        await uploadLocalStorageFilesToS3(item.path, s3_data_folder_path, item.name);
      } else if (item.isDirectory()) {
        // Folder → recursive call
        const newPrefix = `${s3_data_folder_path}/${item.name}/`;
        await uploadLocalStorageFilesToS3Recursively(item.path, newPrefix);
      }
    }
    functionLog("Terminate Function : uploadLocalStorageFilesToS3Recursively")
  } catch (error) {
    console.error("❌ Folder traversal error:", error);
  }
}



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
      const files = await RNFS.readDir(LOCAL_ROOT_FOLDER);
      setLocalFiles(files.filter(f => f.isFile()).map(f => f.name));
    } catch (err) {
      console.error('List local files error:', err);
    }
  };


export async function removeFileFromLocalStorage(filename, setLocalFiles){
  try {
    const path = `${LOCAL_ROOT_FOLDER}/${filename}`;
    await RNFS.unlink(path);
    functionLog(["removeFileFromLocalStorage - folderPath :", LOCAL_ROOT_FOLDER])
    await listFilesOfLocalStorage(LOCAL_ROOT_FOLDER, setLocalFiles);
    functionLog(['Removed', `${filename} deleted from Snk folder.`])
    Alert.alert('Removed', `${filename} deleted from Snk folder.`);
  } catch (err) {
    console.error('Remove file error:', err);
    Alert.alert('Error', `Failed to delete ${filename}`);
  }
};


// ------------------------------------------------------------------------------------------------


export async function pickAndCopyFileToLocalStorage(setLocalFiles){
  functionLog("Initialize Function : pickAndCopyFileToLocalStorage")
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Storage permission is required.');
      return;
    }

    const [res] = await pick({ type: [types.allFiles] });
    functionLog(['Picked file:', res]);

    const destPath = `${LOCAL_ROOT_FOLDER}/${res.name}`;
    const sourcePath = res.uri.startsWith('file://') ? res.uri : `file://${res.uri}`;

    await RNFS.copyFile(sourcePath, destPath);
    await listFilesOfLocalStorage(LOCAL_ROOT_FOLDER, setLocalFiles);

    Alert.alert('Success', `${res.name} copied to Snk folder!`);
    functionLog("Terminate Function : pickAndCopyFileToLocalStorage")
  } catch (err) {
    if (isCancel(err)) functionLog('User cancelled file picker');
    else {
      console.error('File pick/copy error:', err);
      Alert.alert('Error', 'Failed to copy file to Snk folder.');
    }
  }
};


// ------------------------------------------------------------------------------------------------


export async function listS3Files(setS3Files, s3_data_folder_path) {
  functionLog("Initialize Function : listS3Files")
  try {
    const result = await list({ path: `${s3_data_folder_path}/`});
    const files = result.items
      .filter(item => item.path !== `${s3_data_folder_path}/`)
      .map(item => item.path.replace(`${s3_data_folder_path}/`, ''));
    setS3Files(files); // Error listing files: TypeError: setS3Files is not a function (it is Object) 
    functionLog(['S3 Files:', files]);
    functionLog("Terminate Function : listS3Files")
  } catch (err) {
    console.error('Error listing files:', err);
  }
};


// ------------------------------------------------------------------------------------------------


export async function downloadFileFromS3ToLocalStorage(filename, source_path, destination_Path) {
  functionLog("Initialize Function : downloadFileFromS3ToLocalStorage")
  functionLog([filename, source_path, destination_Path])
  try {
    functionLog(['Downloading:', filename]);

    // Get a signed URL for the file
    const { url } = await getUrl({ path: `${source_path}/${filename}` });

    // Download file directly to local storage
    const downloadRes = RNFS.downloadFile({
      fromUrl: url.toString(),
      toFile: `${destination_Path}/${filename}`,
    });

    await downloadRes.promise;

    functionLog(['Downloaded:', filename, '→', destination_Path]);
    functionLog("Terminate Function : downloadFileFromS3ToLocalStorage")
  } catch (err) {
    console.error('Download error:', err);
    Alert.alert('Error', `Failed to download ${filename}`);
  }
};


export async function downloadAllFilesFromS3ToLocalStorage(s3Files, setLocalFiles) {
  functionLog("Initialize Function : downloadAllFilesFromS3ToLocalStorage")
  try {
    if (s3Files.length === 0) {
      Alert.alert('No files', 'No files found in S3 to download.');
      return;
    }

    for (const filename of s3Files) {
      await downloadFileFromS3ToLocalStorage(filename, setLocalFiles);
    }

    Alert.alert('Success', 'All files downloaded to Snk folder.');
    functionLog("Terminate Function : downloadAllFilesFromS3ToLocalStorage")
  } catch (err) {
    console.error('Download all error:', err);
    Alert.alert('Error', 'Failed to download all files.');
  }
};


// ------------------------------------------------------------------------------------------------


// Recursively create parent directories
async function ensureDirExists(dirPath) {
  if (!(await RNFS.exists(dirPath))) {
    await ensureDirExists(dirPath.substring(0, dirPath.lastIndexOf('/')));
    await RNFS.mkdir(dirPath);
    functionLog(`📂 Created folder: ${dirPath}`);
  }
}

export async function downloadAllFilesFromS3ToLocalRecursively(setLocalFiles, local_root_folder, s3_data_folder_path) {
  functionLog("Initialize Function : downloadAllFilesFromS3ToLocalRecursively");
  try {
    // 1. List files in S3
    functionLog(username)
    const result = await list({ path: `${s3_data_folder_path}/` });
    const files = result.items
      .filter(item => item.path !== `${s3_data_folder_path}/`)
      .map(item => item.path.replace(`${s3_data_folder_path}/`, ''));

    functionLog(`S3 Files: ${files}`);

    // 2. Ensure root folder exists
    if (!(await RNFS.exists(local_root_folder))) {
      await RNFS.mkdir(local_root_folder);
    }

    // 3. Process each file or folder
    for (const filename of files) {
      const destPath = `${local_root_folder}/${filename}`;

      if (filename.endsWith("/")) {
        // 📂 It's a folder → create it locally
        await ensureDirExists(destPath);
        functionLog(`📂 Download Empty folder: ${destPath}`);
        continue;
      }

      // 📄 It's a file → download
      const { url } = await getUrl({ path: `${s3_data_folder_path}/${filename}` });

      const folderPath = destPath.substring(0, destPath.lastIndexOf('/'));
      await ensureDirExists(folderPath);

      functionLog(`📄 Downloading: ${filename} → ${destPath}`);
      await RNFS.downloadFile({ fromUrl: url.toString(), toFile: destPath }).promise;
      functionLog(`📄 Downloaded: ${filename} → ${destPath}`);
    }

    // 4. Refresh local file list
    await listFilesOfLocalStorage(local_root_folder, setLocalFiles);

    functionLog("✅ All files downloaded!");
  } catch (err) {
    console.error("Download error:", err);
  }
}
