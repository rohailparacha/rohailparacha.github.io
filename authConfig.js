// Config object to be passed to Msal on creation  https://login.microsoftonline.com/73fbcf56-ad0e-441c-b431-2a36dc8918d7
const msalConfig = {
    auth: {
        clientId: "1d9d1288-0923-441e-ab13-d9ab13c6132c",
        authority: "https://login.microsoftonline.com/common"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};  

// Add here scopes for id token to be used at MS Identity Platform endpoints.
const loginRequest = {
    scopes: ["User.Read","dbcf1fa9-bb96-4fd8-9193-558d95e77409"]
};

// Add here the endpoints for MS Graph API services you would like to use.
const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages"
};

// Add here scopes for access token to be used at MS Graph API endpoints.
const tokenRequest = {
    scopes: ["Mail.Read","User.Read"],
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};

const silentRequest = {
    scopes: ["1d9d1288-0923-441e-ab13-d9ab13c6132c", "User.Read", "Mail.Read"]
};
