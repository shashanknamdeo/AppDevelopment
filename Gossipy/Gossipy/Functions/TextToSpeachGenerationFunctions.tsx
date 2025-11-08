console.log('Initialize TextToSpeachGenerationFunctions ---------------------------------------------------------')

// // this is my TextToSpeachGenerationFunctions do only required changes and give me full code

// // Functions/TextToSpeachGenerationFunctions.tsx
// import { generateClient } from "aws-amplify/api";
// import Sound from "react-native-sound";
// import { textToSpeech } from "../src/graphql/queries";

// // Create Amplify GraphQL client
// const client = generateClient();

// /**
//  * Convert text → speech using Amplify Predictions GraphQL (Polly)
//  * Plays the audio in React Native via react-native-sound
//  * @param text Text to synthesize
//  * @param voiceID Polly voice ID (defaults to "Salli")
//  */
// export async function speakWithPollyGraphQL(text: string, voiceID: string = "Salli") {
//   try {
//     if (!text?.trim()) return;

//     console.log("🎙️ Running Polly GraphQL request...");
//     const response = await client.graphql({
//       query: textToSpeech,
//       variables: { input: { convertTextToSpeech: { text, voiceID } } },
//     });

//     const url = response?.data?.textToSpeech;
//     if (!url) {
//       console.warn("⚠️ No presigned URL returned from Polly.");
//       return;
//     }

//     console.log("🎧 Playing Polly audio from URL:", url);

//     // Enable playback in silent mode (iOS-safe)
//     Sound.setCategory("Playback");

//     const sound = new Sound(url, null, (error) => {
//       if (error) {
//         console.error("❌ Failed to load sound:", error);
//         return;
//       }

//       sound.play((success) => {
//         if (success) {
//           console.log("✅ Audio finished playing");
//         } else {
//           console.warn("⚠️ Playback failed due to decoding errors");
//         }
//         sound.release();
//       });
//     });
//   } catch (err) {
//     console.error("Amplify Polly GraphQL error:", err);
//   }
// }

// this is my TextToSpeachGenerationFunctions do only required changes and give me full code

// Functions/TextToSpeachGenerationFunctions.tsx
import { generateClient } from "aws-amplify/api";
import Sound from "react-native-nitro-sound"; // ✅ switched to Nitro Sound
import { textToSpeech } from "../src/graphql/queries";

// Create Amplify GraphQL client
const client = generateClient();

/**
 * Convert text → speech using Amplify Predictions GraphQL (Polly)
 * Plays the audio in React Native via react-native-nitro-sound
 * @param text Text to synthesize
 * @param voiceID Polly voice ID (defaults to "Salli")
 */
export async function speakWithPolly(text: string, voiceID: string = "Salli") {
  try {
    if (!text?.trim()) return;

    console.log("🎙️ Running Polly GraphQL request...");
    const response = await client.graphql({
      query: textToSpeech,
      variables: { input: { convertTextToSpeech: { text, voiceID } } },
    });

    const url = response?.data?.textToSpeech;
    if (!url) {
      console.warn("⚠️ No presigned URL returned from Polly.");
      return;
    }

    console.log("🎧 Playing Polly audio from URL:", url);

    // Enable playback in silent mode (iOS-safe)
    Sound.setCategory("Playback");

    const sound = new Sound(url, null, (error) => {
      if (error) {
        console.error("❌ Failed to load sound:", error);
        return;
      }

      sound.play((success) => {
        if (success) console.log("✅ Audio finished playing");
        else console.warn("⚠️ Playback failed due to decoding errors");
        sound.release();
      });
    });
  } catch (err) {
    console.error("Amplify Polly Nitro Sound error:", err);
  }
}
