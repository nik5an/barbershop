const { google } = require("googleapis");
const readline = require("readline");

const CLIENT_ID =
  "548815813705-dgkgoro46pvq90abc4mtb8k46q4fd2ej.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000";

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate the authorization URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: "https://www.googleapis.com/auth/calendar.events", // This allows access to Google Calendar
});

console.log("Authorize this app by visiting this url:", authUrl);

// Use readline to capture the authorization code from the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from that page here: ", async (code) => {
  // Exchange the authorization code for an access token and refresh token
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("Tokens:", tokens);

    // Save the refresh token to your .env.local or somewhere secure
    console.log("Refresh Token:", tokens.refresh_token);
    rl.close();
  } catch (err) {
    console.error("Error getting tokens:", err);
    rl.close();
  }
});

// import axios from "axios";

// const exchangeCodeForTokens = async (authorizationCode) => {
//   try {
//     const response = await axios.post("https://oauth2.googleapis.com/token", {
//       code: "4/0AanRRrsovtvJfLMfgBLEEuksqSjci2U0w549XuwI-NAletDRavPMjufBkusiZakYzPqZjA",
//       client_id:
//         "548815813705-hkpoqm4b5dd0pa27dt1bnq4k654pt5bu.apps.googleusercontent.com",
//       client_secret: "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",
//       redirect_uri: "http://localhost:3000",
//       grant_type: "authorization_code",
//     });

//     console.log("Access Token:", response.data.access_token);
//     console.log("Refresh Token:", response.data.refresh_token);
//   } catch (error) {
//     console.error(
//       "Error exchanging authorization code:",
//       error.response?.data || error.message
//     );
//   }
// };

// // Replace this with the actual code from your redirect URI
// const authorizationCode =
//   "4/0AeanS0ZPpZjWpY-7_2U4crexE5F46D2Q5WkEXq5G8ThouKw4JjQC7dRMgdECQ4JIw8OtuA";
// exchangeCodeForTokens(authorizationCode);
