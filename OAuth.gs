var CLIENT_ID = '<YOUR CLIENT ID>';
var CLIENT_SECRET = '<YOUR CLIENT SECRET>';
var ADMIN_USER_ID = '<YOUR SYSTEM USER ADMIN-LEVEL ID>'; 
var USER_ID = '<YOUR SYSTEM USER ID>'; 

var REDIRECT_URL = '<URL TO YOUR APP SCRIPT>';

/**
 * create the OAuth2 service
 */
 
function getFacebookService() {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  return OAuth2.createService('Facebook')

      // Set the endpoint URLs
      .setAuthorizationBaseUrl('https://www.facebook.com/v3.3/dialog/oauth?')
      .setTokenUrl('https://graph.facebook.com/v3.3/oauth/access_token?')

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      // Set the scopes to request
      .setScope('ads_read');

}

/**
 * Direct the user to the authorization URL
 */

function showSidebar() {
  var facebookService = getFacebookService();
  
  // if app does not have access yet
  if (!facebookService.hasAccess()) {
    var authorizationUrl = facebookService.getAuthorizationUrl();
    Logger.log(authorizationUrl);
    
    var template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        'Reopen the sidebar when the authorization is complete.');
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();
    SpreadsheetApp.getUi().showSidebar(page);
  } else {
    // app does have access
    Logger.log('App has access');
    
    // make the api request
    makeRequest();
  }
}

/**
 * Handle the callback
 */
 
function authCallback(request) {
  var facebookService = getFacebookService();
  var isAuthorized = facebookService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! Welcome to the data :)');
  } else {
    return HtmlService.createHtmlOutput('Denied. sorz ma dude');
  }
}
