// import path from "path"; Not in react native

import RNFS from 'react-native-fs';

import { 
  getProperties,
  list,
  getUrl,
} from 'aws-amplify/storage';

import CryptoJS from 'crypto-js';

import {functionLog} from './Logger'

import {
  uploadLocalStorageFilesToS3,
  downloadFileFromS3ToLocalStorage,
} from './StorageScreenFunctions'

functionLog("Initialize File -> SyncFunctions")

// ------------------------------------------------------------------------------------------------


type ManifestEntry = {
  path: string;         // Relative path of the file
  etag: string;         // MD5 hash
  lastModified: string; // ISO timestamp
  size: number;         // File size in bytes
};

type Manifest = {
  generatedAt: string;
  files: Record<string, ManifestEntry>;
};


export async function getLocalFileMD5(filePath: string): Promise<string> {
  functionLog("Initialize Function : createLocalManifest");
  try {
    const hash = await RNFS.hash(filePath, 'md5');
    return hash;
  } catch (err) {
    console.error('Error getting MD5 of local file', err);
    throw err;
  }
}


// ✅ Main Function: Create Manifest
export async function createLocalManifest(rootPath: string, manifestPath: string): Promise<void> {
  const files = await listLocalFilesRecursively(rootPath);
  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    files: {}
  };

  for (const file of files) {
    try {
      const stat = await RNFS.stat(file);
      const md5 = await getLocalFileMD5(file);
      // Store relative path (without root)
      const relativePath = file.replace(rootPath, '');

      manifest.files[relativePath] = {
        path: relativePath,
        etag: md5,
        lastModified: new Date(stat.mtime ?? Date.now()).toISOString(),
        size: stat.size
      };
      functionLog(`file : ${file}  |  lastModified : : ${new Date(stat.mtime ?? Date.now()).toISOString()}  |  size : : ${stat.size}  | md5 : ${md5}`)
    } catch (err) {
      console.warn(`⚠️ Could not process file: ${file}`, err);
    }
  }
  functionLog(`manifest : ${JSON.stringify(manifest.files, null, 2)}`)
  // Save manifest JSON file
  await RNFS.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✅ Local manifest created at: ${manifestPath}`);

  functionLog("Terminate Function : createLocalManifest");
}


// ------------------------------------------------------------------------------------------------



export async function getS3ETag(s3Path: string): Promise<string> {
  try {
    const result = await getProperties({ path: s3Path });
    // result.eTag comes with quotes sometimes -> remove them
    return result.eTag.replace(/"/g, '');
  } catch (err) {
    console.error('Error getting S3 ETag', err);
    throw err;
  }
}


export async function compareLocalWithS3(localPath: string, s3Path: string): Promise<boolean> {
  try {
    const [localMD5, s3ETag] = await Promise.all([
      getLocalFileMD5(localPath),
      getS3ETag(s3Path),
    ]);

    console.log('Local MD5:', localMD5);
    console.log('S3 ETag:', s3ETag);

    if (localMD5 === s3ETag){
      return true
    }
    else {
      return false
    };
  } catch (err) {
    console.error('Error comparing file and S3', err);
  }
}


// ------------------------------------------------------------------------------------------------


export async function listLocalFilesRecursively(path: string): Promise<string[]> {
  let results: string[] = [];

  try {
    const items = await RNFS.readDir(path); // list files & folders in dir

    for (const item of items) {
      if (item.isFile()) {
        results.push(item.path);
      } else if (item.isDirectory()) {
        // recursively go deeper
        const nested = await listLocalFilesRecursively(item.path);
        results = results.concat(nested);
      }
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }

  return results;
}


export async function listS3FilesRecursively(prefix: string): Promise<string[]> {
  let results: string[] = [];
  let nextToken: string | undefined = undefined;

  try {
    do {
      const response = await list({
        path: prefix,
        options: { nextToken },
      });

      // Collect file paths (only actual objects, not "folders")
      response.items.forEach(item => {
        if (item.path) {
          results.push(item.path);
        }
      });

      // Check if there are more files (pagination) BECAUSE 'List' API GIVE LIST OF OBJECT IN PAGES
      nextToken = response.nextToken;
    } while (nextToken);
  } catch (err) {
    console.error("Error listing S3 files:", err);
  }

  return results;
}


export function compareLocalAndS3( localFiles: string[], s3Files: string[], localRoot: string, s3Root: string)
{
// 
// Compare local and S3 file lists
//    localFiles - Array of local file paths (absolute)
//    s3Files - Array of S3 file paths (with s3Root prefix)
//    localRoot - The root folder of local files (to normalize relative paths)
//    s3Root - The root prefix of S3 files (e.g., "public/", "protected/123/")
// 
  // Convert absolute local paths → relative paths
  const localRelative = localFiles.map(file =>
    path.relative(localRoot, file).replace(/\\/g, "/") // normalize Windows paths
  );

  // Convert S3 paths → relative paths (remove s3Root)
  const s3Relative = s3Files.map(file => file.replace(new RegExp(`^${s3Root}`), ""));

  const localSet = new Set(localRelative);
  const s3Set = new Set(s3Relative);

  // Find differences
  const onlyLocal = [...localSet].filter(f => !s3Set.has(f)); // files only in local
  const onlyS3 = [...s3Set].filter(f => !localSet.has(f));     // files only in S3
  const common = [...localSet].filter(f => s3Set.has(f));      // files in both

  return { onlyLocal, onlyS3, common };
}


// ------------------------------------------------------------------------------------------------


export async function getLocalFileTimestamp(filePath: string): Promise<Date | null> {
  try {
    const stat = await RNFS.stat(filePath);
    // stat.mtime is a Date object (last modified time)
    return stat.mtime ?? null;
  } catch (err) {
    console.error("Error fetching local file timestamp:", err);
    return null;
  }
}



export async function getS3FileTimestamp(s3Path: string): Promise<Date | null> {
// Get the last modified timestamp of a file in S3
// s3Path = Path of the file in S3 (e.g., "public/Folder1/file.jpg")
// returns Date | null
  try {
    const result = await getProperties({ path: s3Path });

    if (result?.lastModified) {
      return result.lastModified; // already a Date object
    }

    return null;
  } catch (err) {
    console.error("Error fetching S3 file timestamp:", err);
    return null;
  }
}



// ------------------------------------------------------------------------------------------------


export async function sync(local_root_folder_path, local_manifest_folder_path, s3_root_folder_path, s3_manifest_folder_path){
  const local_manifest_file_path = `${local_manifest_folder_path}/manifest.json`
  // 
  // Create New Manifest
  await createLocalManifest(local_root_folder_path, local_manifest_file_path)
  // 
  // Download S3 Manifest
  await downloadFileFromS3ToLocalStorage('s3_manifest.json', s3_manifest_folder_path, local_manifest_folder_path)
  






















// upload local manifest to s3
// uploadLocalStorageFilesToS3(local_manifest_folder_path, s3_root_folder_path, 's3_manifest.json')
}