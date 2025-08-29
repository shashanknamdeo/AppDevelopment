
// import React from "react";
// import { SafeAreaView } from "react-native";
// import { Amplify } from "aws-amplify";
// import awsExports from "./src/aws-exports";

// // Authorization Page
// import AuthScreen from "./src/AuthScreen";

// Amplify.configure(awsExports);

// export default function App() {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <AuthScreen />
//     </SafeAreaView>
//   );
// }


// ================================================================================================

// import 'react-native-get-random-values';
// import 'react-native-url-polyfill/auto';

// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   Button,
//   ScrollView,
//   Alert,
//   PermissionsAndroid,
//   Platform,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';

// import { Amplify } from 'aws-amplify';
// import awsExports from './src/aws-exports';
// import { list, uploadData, downloadData, getUrl } from 'aws-amplify/storage';
// import { signOut, getCurrentUser } from 'aws-amplify/auth';   // ✅ Import getCurrentUser
// import AuthScreen from './src/AuthScreen';
// import RNFS from 'react-native-fs';
// import { pick, types, isCancel } from '@react-native-documents/picker';

// Amplify.configure(awsExports);

// // ✅ Use external storage for Android so folder shows in File Manager
// const SYNC_FOLDER =
//   Platform.OS === 'android'
//     ? `${RNFS.ExternalStorageDirectoryPath}/Snk`
//     : `${RNFS.DocumentDirectoryPath}/Snk`;

// // ✅ Simple MIME type helper
// const getMimeType = (filename: string) => {
//   const ext = filename.split('.').pop()?.toLowerCase();
//   switch (ext) {
//     case 'jpg':
//     case 'jpeg':
//       return 'image/jpeg';
//     case 'png':
//       return 'image/png';
//     case 'gif':
//       return 'image/gif';
//     case 'pdf':
//       return 'application/pdf';
//     case 'txt':
//       return 'text/plain';
//     case 'csv':
//       return 'text/csv';
//     case 'json':
//       return 'application/json';
//     case 'mp4':
//       return 'video/mp4';
//     case 'mp3':
//       return 'audio/mpeg';
//     default:
//       return 'application/octet-stream';
//   }
// };

// // ✅ Upload single file (binary safe for images)
// const uploadFile = async (file: { path: string; name: string }) => {
//   try {
//     const fileUri = file.path.startsWith('file://') ? file.path : `file://${file.path}`;
//     const response = await fetch(fileUri);
//     const blob = await response.blob();

//     await uploadData({
//       path: `public/${file.name}`,
//       data: blob,
//       options: {
//         contentType: getMimeType(file.name),
//       },
//     });

//     console.log('Uploaded:', file.name);
//   } catch (err) {
//     console.error('Upload error:', err);
//     throw err;
//   }
// };

// export default function App() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [localFiles, setLocalFiles] = useState<string[]>([]);
//   const [s3Files, setS3Files] = useState<string[]>([]);
//   const [isAmplifyReady, setIsAmplifyReady] = useState(false);
//   const [loadingAuth, setLoadingAuth] = useState(true);   // ✅ Track auth check

//   useEffect(() => {
//     console.log('Amplify configured.');
//     setIsAmplifyReady(true);

//     // ✅ Check if user already signed in
//     const checkUser = async () => {
//       try {
//         const currentUser = await getCurrentUser();
//         console.log('User session found:', currentUser);
//         setLoggedIn(true);
//       } catch {
//         console.log('No user signed in');
//         setLoggedIn(false);
//       } finally {
//         setLoadingAuth(false);
//       }
//     };

//     checkUser();
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         const hasPermission = await requestStoragePermission();
//         if (!hasPermission) {
//           Alert.alert('Permission required', 'Storage access is needed.');
//           return;
//         }

//         const folderExists = await RNFS.exists(SYNC_FOLDER);
//         if (!folderExists) await RNFS.mkdir(SYNC_FOLDER);
//         await listLocalFiles();
//       } catch (err) {
//         console.error('Error creating folder:', err);
//       }
//     })();
//   }, []);

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         if (Platform.Version >= 33) {
//           const granted = await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
//           ]);
//           return (
//             granted['android.permission.READ_MEDIA_IMAGES'] === PermissionsAndroid.RESULTS.GRANTED ||
//             granted['android.permission.READ_MEDIA_VIDEO'] === PermissionsAndroid.RESULTS.GRANTED ||
//             granted['android.permission.READ_MEDIA_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
//           );
//         } else {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//             {
//               title: 'Storage Permission',
//               message: 'Snk needs access to storage to save files.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             }
//           );
//           return granted === PermissionsAndroid.RESULTS.GRANTED;
//         }
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const listLocalFiles = async () => {
//     try {
//       const files = await RNFS.readDir(SYNC_FOLDER);
//       setLocalFiles(files.filter(f => f.isFile()).map(f => f.name));
//     } catch (err) {
//       console.error('List local files error:', err);
//     }
//   };

//   const uploadFolderToS3 = async () => {
//     try {
//       const files = await RNFS.readDir(SYNC_FOLDER);
//       for (const file of files) {
//         if (!file.isFile()) continue;
//         await uploadFile(file);
//       }
//       Alert.alert('Success', 'Folder synced to S3!');
//       await listS3Files();
//     } catch (err) {
//       console.error('Upload folder error:', err);
//       Alert.alert('Error', 'Failed to upload folder to S3.');
//     }
//   };

//   const pickAndCopyFileToLocal = async () => {
//     try {
//       const hasPermission = await requestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert('Permission denied', 'Storage permission is required.');
//         return;
//       }

//       const [res] = await pick({ type: [types.allFiles] });
//       console.log('Picked file:', res);

//       const destPath = `${SYNC_FOLDER}/${res.name}`;
//       const sourcePath = res.uri.startsWith('file://') ? res.uri : `file://${res.uri}`;

//       await RNFS.copyFile(sourcePath, destPath);
//       await listLocalFiles();

//       Alert.alert('Success', `${res.name} copied to Snk folder!`);
//     } catch (err) {
//       if (isCancel(err)) console.log('User cancelled file picker');
//       else {
//         console.error('File pick/copy error:', err);
//         Alert.alert('Error', 'Failed to copy file to Snk folder.');
//       }
//     }
//   };

//   const removeLocalFile = async (filename: string) => {
//     try {
//       const path = `${SYNC_FOLDER}/${filename}`;
//       await RNFS.unlink(path);
//       await listLocalFiles();
//       Alert.alert('Removed', `${filename} deleted from Snk folder.`);
//     } catch (err) {
//       console.error('Remove file error:', err);
//       Alert.alert('Error', `Failed to delete ${filename}`);
//     }
//   };

//   const listS3Files = async () => {
//     try {
//       const result = await list({ path: 'public/' });
//       const files = result.items
//         .filter(item => item.path !== 'public/')
//         .map(item => item.path.replace('public/', ''));
//       setS3Files(files);
//       console.log('S3 Files:', files);
//     } catch (err) {
//       console.error('Error listing files:', err);
//     }
//   };


// const downloadFileFromS3 = async (filename: string) => {
//   try {
//     console.log('Downloading:', filename);

//     // Get a signed URL for the file
//     const { url } = await getUrl({ path: `public/${filename}` });

//     const destPath = `${SYNC_FOLDER}/${filename}`;

//     // Download file directly to local storage
//     const downloadRes = RNFS.downloadFile({
//       fromUrl: url.toString(),
//       toFile: destPath,
//     });

//     await downloadRes.promise;

//     console.log('Downloaded:', filename, '→', destPath);
//     await listLocalFiles();
//   } catch (err) {
//     console.error('Download error:', err);
//     Alert.alert('Error', `Failed to download ${filename}`);
//   }
// };



// const downloadAllFilesFromS3 = async () => {
//   try {
//     if (s3Files.length === 0) {
//       Alert.alert('No files', 'No files found in S3 to download.');
//       return;
//     }

//     for (const filename of s3Files) {
//       await downloadFileFromS3(filename);
//     }

//     Alert.alert('Success', 'All files downloaded to Snk folder.');
//   } catch (err) {
//     console.error('Download all error:', err);
//     Alert.alert('Error', 'Failed to download all files.');
//   }
// };



//   if (!isAmplifyReady || loadingAuth) {
//     return (
//       <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text>Loading...</Text>
//       </SafeAreaView>
//     );
//   }

//   if (loggedIn) {
//     return (
//       <SafeAreaView style={{ flex: 1, padding: 20 }}>
//         {/* ✅ Top bar with Logout button */}
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'flex-end',
//             marginBottom: 10,
//           }}
//         >
//           <TouchableOpacity
//             onPress={async () => {
//               try {
//                 await signOut();
//                 setLoggedIn(false);
//               } catch (err) {
//                 console.error('Sign out error:', err);
//               }
//             }}
//             style={{
//               backgroundColor: '#ff4d4d',
//               paddingVertical: 6,
//               paddingHorizontal: 12,
//               borderRadius: 8,
//             }}
//           >
//             <Text style={{ color: 'white', fontWeight: 'bold' }}>Log Out</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView contentContainerStyle={{ gap: 12 }}>
//           <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
//             Snk Storage Sync
//           </Text>

//           <Button title="Download All from S3" onPress={downloadAllFilesFromS3} />
//           <Button title="Upload Folder to S3" onPress={uploadFolderToS3} />
//           <Button title="Pick File from Phone" onPress={pickAndCopyFileToLocal} />
//           <Button title="List S3 Files" onPress={listS3Files} />

//           {/* Local Files */}
//           <View style={{ marginVertical: 10 }}>
//             <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
//               Snk Folder Files:
//             </Text>
//             {localFiles.length > 0 ? (
//               <View
//                 style={{
//                   backgroundColor: '#f2f2f2',
//                   padding: 10,
//                   borderRadius: 8,
//                 }}
//               >
//                 {localFiles.map((f, i) => (
//                   <View
//                     key={`local-${i}`}
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       borderBottomWidth: 0.5,
//                       borderBottomColor: '#ccc',
//                       paddingVertical: 4,
//                     }}
//                   >
//                     <Text style={{ fontSize: 16 }}>📄 {f}</Text>
//                     <TouchableOpacity onPress={() => removeLocalFile(f)}>
//                       <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//               </View>
//             ) : (
//               <Text>None</Text>
//             )}
//           </View>

//           {/* S3 Files */}
//           <View style={{ marginVertical: 10 }}>
//             <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
//               S3 Bucket Files:
//             </Text>
//             {s3Files.length > 0 ? (
//               <View
//                 style={{
//                   backgroundColor: '#e8f4ff',
//                   padding: 10,
//                   borderRadius: 8,
//                 }}
//               >
//                 {s3Files.map((f, i) => (
//                   <Text
//                     key={`s3-${i}`}
//                     style={{
//                       fontSize: 16,
//                       paddingVertical: 4,
//                       borderBottomWidth: 0.5,
//                       borderBottomColor: '#aaa',
//                     }}
//                   >
//                     ☁️ {f}
//                   </Text>
//                 ))}
//               </View>
//             ) : (
//               <Text>No files found in S3</Text>
//             )}
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }


// {/* S3 Files */}
// <View style={{ marginVertical: 10 }}>
//   <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
//     S3 Bucket Files:
//   </Text>
//   {s3Files.length > 0 ? (
//     <View
//       style={{
//         backgroundColor: '#e8f4ff',
//         padding: 10,
//         borderRadius: 8,
//       }}
//     >
//       {s3Files.map((f, i) => (
//         <View
//           key={`s3-${i}`}
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             borderBottomWidth: 0.5,
//             borderBottomColor: '#aaa',
//             paddingVertical: 6,
//           }}
//         >
//           <Text style={{ fontSize: 16 }}>☁️ {f}</Text>
//           <TouchableOpacity
//             onPress={() => downloadFileFromS3(f)}
//             style={{
//               backgroundColor: '#007AFF',
//               paddingVertical: 6,
//               paddingHorizontal: 12,
//               borderRadius: 8,
//             }}
//           >
//             <Text style={{ color: 'white', fontWeight: 'bold' }}>
//               Download
//             </Text>
//           </TouchableOpacity>
//         </View>
//       ))}
//     </View>
//   ) : (
//     <Text>No files found in S3</Text>
//   )}
// </View>



//   return <AuthScreen onSignIn={() => setLoggedIn(true)} />;
// }


// ==============================================================================================



import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
import { list, uploadData, downloadData, getUrl } from 'aws-amplify/storage';
import { signOut, getCurrentUser } from 'aws-amplify/auth';   // ✅ Import getCurrentUser
import AuthScreen from './src/AuthScreen';
import RNFS from 'react-native-fs';
import { pick, types, isCancel } from '@react-native-documents/picker';

Amplify.configure(awsExports);

// ✅ Use external storage for Android so folder shows in File Manager
const SYNC_FOLDER =
  Platform.OS === 'android'
    ? `${RNFS.ExternalStorageDirectoryPath}/Snk`
    : `${RNFS.DocumentDirectoryPath}/Snk`;

// ✅ Simple MIME type helper
const getMimeType = (filename: string) => {
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

// ✅ Upload single file (binary safe for images)
const uploadFile = async (file: { path: string; name: string }) => {
  try {
    const fileUri = file.path.startsWith('file://') ? file.path : `file://${file.path}`;
    const response = await fetch(fileUri);
    const blob = await response.blob();

    await uploadData({
      path: `public/${file.name}`,
      data: blob,
      options: {
        contentType: getMimeType(file.name),
      },
    });

    console.log('Uploaded:', file.name);
  } catch (err) {
    console.error('Upload error:', err);
    throw err;
  }
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [localFiles, setLocalFiles] = useState<string[]>([]);
  const [s3Files, setS3Files] = useState<string[]>([]);
  const [isAmplifyReady, setIsAmplifyReady] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);   // ✅ Track auth check

  useEffect(() => {
    console.log('Amplify configured.');
    setIsAmplifyReady(true);

    // ✅ Check if user already signed in
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log('User session found:', currentUser);
        setLoggedIn(true);
      } catch {
        console.log('No user signed in');
        setLoggedIn(false);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          Alert.alert('Permission required', 'Storage access is needed.');
          return;
        }

        const folderExists = await RNFS.exists(SYNC_FOLDER);
        if (!folderExists) await RNFS.mkdir(SYNC_FOLDER);
        await listLocalFiles();
      } catch (err) {
        console.error('Error creating folder:', err);
      }
    })();
  }, []);

  const requestStoragePermission = async () => {
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

  const listLocalFiles = async () => {
    try {
      const files = await RNFS.readDir(SYNC_FOLDER);
      setLocalFiles(files.filter(f => f.isFile()).map(f => f.name));
    } catch (err) {
      console.error('List local files error:', err);
    }
  };

  const uploadFolderToS3 = async () => {
    try {
      const files = await RNFS.readDir(SYNC_FOLDER);
      for (const file of files) {
        if (!file.isFile()) continue;
        await uploadFile(file);
      }
      Alert.alert('Success', 'Folder synced to S3!');
      await listS3Files();
    } catch (err) {
      console.error('Upload folder error:', err);
      Alert.alert('Error', 'Failed to upload folder to S3.');
    }
  };

  const pickAndCopyFileToLocal = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Storage permission is required.');
        return;
      }

      const [res] = await pick({ type: [types.allFiles] });
      console.log('Picked file:', res);

      const destPath = `${SYNC_FOLDER}/${res.name}`;
      const sourcePath = res.uri.startsWith('file://') ? res.uri : `file://${res.uri}`;

      await RNFS.copyFile(sourcePath, destPath);
      await listLocalFiles();

      Alert.alert('Success', `${res.name} copied to Snk folder!`);
    } catch (err) {
      if (isCancel(err)) console.log('User cancelled file picker');
      else {
        console.error('File pick/copy error:', err);
        Alert.alert('Error', 'Failed to copy file to Snk folder.');
      }
    }
  };

  const removeLocalFile = async (filename: string) => {
    try {
      const path = `${SYNC_FOLDER}/${filename}`;
      await RNFS.unlink(path);
      await listLocalFiles();
      Alert.alert('Removed', `${filename} deleted from Snk folder.`);
    } catch (err) {
      console.error('Remove file error:', err);
      Alert.alert('Error', `Failed to delete ${filename}`);
    }
  };

  const listS3Files = async () => {
    try {
      const result = await list({ path: 'public/' });
      const files = result.items
        .filter(item => item.path !== 'public/')
        .map(item => item.path.replace('public/', ''));
      setS3Files(files);
      console.log('S3 Files:', files);
    } catch (err) {
      console.error('Error listing files:', err);
    }
  };


const downloadFileFromS3 = async (filename: string) => {
  try {
    console.log('Downloading:', filename);

    // Get a signed URL for the file
    const { url } = await getUrl({ path: `public/${filename}` });

    const destPath = `${SYNC_FOLDER}/${filename}`;

    // Download file directly to local storage
    const downloadRes = RNFS.downloadFile({
      fromUrl: url.toString(),
      toFile: destPath,
    });

    await downloadRes.promise;

    console.log('Downloaded:', filename, '→', destPath);
    await listLocalFiles();
  } catch (err) {
    console.error('Download error:', err);
    Alert.alert('Error', `Failed to download ${filename}`);
  }
};



const downloadAllFilesFromS3 = async () => {
  try {
    if (s3Files.length === 0) {
      Alert.alert('No files', 'No files found in S3 to download.');
      return;
    }

    for (const filename of s3Files) {
      await downloadFileFromS3(filename);
    }

    Alert.alert('Success', 'All files downloaded to Snk folder.');
  } catch (err) {
    console.error('Download all error:', err);
    Alert.alert('Error', 'Failed to download all files.');
  }
};



  if (!isAmplifyReady || loadingAuth) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (loggedIn) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        {/* ✅ Top bar with Logout button */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              try {
                await signOut();
                setLoggedIn(false);
              } catch (err) {
                console.error('Sign out error:', err);
              }
            }}
            style={{
              backgroundColor: '#ff4d4d',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ gap: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
            Snk Storage Sync
          </Text>

          <Button title="Download All from S3" onPress={downloadAllFilesFromS3} />
          <Button title="Upload Folder to S3" onPress={uploadFolderToS3} />
          <Button title="Pick File from Phone" onPress={pickAndCopyFileToLocal} />
          <Button title="List S3 Files" onPress={listS3Files} />

          {/* Local Files */}
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              Snk Folder Files:
            </Text>
            {localFiles.length > 0 ? (
              <View
                style={{
                  backgroundColor: '#f2f2f2',
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                {localFiles.map((f, i) => (
                  <View
                    key={`local-${i}`}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#ccc',
                      paddingVertical: 4,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>📄 {f}</Text>
                    <TouchableOpacity onPress={() => removeLocalFile(f)}>
                      <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text>None</Text>
            )}
          </View>

          {/* S3 Files */}
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
              S3 Bucket Files:
            </Text>
            {s3Files.length > 0 ? (
              <View
                style={{
                  backgroundColor: '#e8f4ff',
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                {s3Files.map((f, i) => (
                  <Text
                    key={`s3-${i}`}
                    style={{
                      fontSize: 16,
                      paddingVertical: 4,
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#aaa',
                    }}
                  >
                    ☁️ {f}
                  </Text>
                ))}
              </View>
            ) : (
              <Text>No files found in S3</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }


{/* S3 Files */}
<View style={{ marginVertical: 10 }}>
  <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
    S3 Bucket Files:
  </Text>
  {s3Files.length > 0 ? (
    <View
      style={{
        backgroundColor: '#e8f4ff',
        padding: 10,
        borderRadius: 8,
      }}
    >
      {s3Files.map((f, i) => (
        <View
          key={`s3-${i}`}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: 0.5,
            borderBottomColor: '#aaa',
            paddingVertical: 6,
          }}
        >
          <Text style={{ fontSize: 16 }}>☁️ {f}</Text>
          <TouchableOpacity
            onPress={() => downloadFileFromS3(f)}
            style={{
              backgroundColor: '#007AFF',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Download
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  ) : (
    <Text>No files found in S3</Text>
  )}
</View>



  return <AuthScreen onSignIn={() => setLoggedIn(true)} />;
}
