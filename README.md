# facebook_pacing
Google Apps Script that connects with Facebook API to automatically pull pacing reports from ad accounts
-
First, create a new app by heading over to https://developers.facebook.com - this will be a web-based app since we are connecting the API to a Google Sheet. You will also need a <a href="https://developers.facebook.com/docs/marketing-api/businessmanager/systemuser">system user</a>. I created both a regular system user as well as an admin-level system user.

Add the Facebook Login capability in your dashboard under Products:

![Facebook Login Product](images/1.PNG?raw=true)

Get the API Access Token
-
We will now authorize this in the GAS with Facebook Login. Using the login method will generate a new access token each time the script is used - this is necessary since the access token expires after about a couple hours. 

Go to the desired spreadsheet, Tools > Script Editor, and delete the boiler-plate code. We will be using the <a href="https://github.com/gsuitedevs/apps-script-oauth2">OAuth2 library</a> for Apps Script. In the script editor, go to the top under Resources > Libraries and add in the OAuth2 libary ID:
```
1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF
```
Select the most up-to-date version of the libary and hit Save.

![Add Library to GAS](images/2.PNG?raw=true)

Reference the OAuth.gs script. You will need a Client ID and a Client Secret - both of these can be found in your app's dashboard. Go to Settings > Basic - the App ID is what you will put under CLIENT_ID, and the App Secret will be used for the CLIENT_SECRET variable in the script.

![Client ID and Client Secret](images/3.PNG?raw=true)

Use <a href="https://developers.facebook.com/tools/explorer/">Facebook's Graph API</a> for Right Scopes
-

Best Practices
-
Minimizing API Requests
- [ ] For accessing several URLs that may be unrelated, pulling data from multiple accounts / from multiple nodes, or <a href="https://developers.facebook.com/docs/graph-api/making-multiple-requests#simple">making batch requests</a>, reference <a href="https://www.sammyk.me/optimizing-request-queries-to-the-facebook-graph-api">this article</a> for a quick overview on many ways to do this.
- [ ] for further reference on batch requests in Google Apps Script, take a look at <a href="https://gist.github.com/tanaikech/f167b9280a8e710804e4061571b53fb9"> this Github page</a> and this <a href="https://stackoverflow.com/questions/47928024/unexpected-unpredictable-results-with-batch-requests-to-facebook-marketing-insig">post on StackOverflow</a>
- [ ] be aware of the API's <a href="https://developers.facebook.com/docs/marketing-api/insights/best-practices/">rate limit</a>
- [ ] <a href="https://developers.facebook.com/docs/graph-api/using-graph-api/#paging">use the Facebook Graph API</a> - this will save you time as you figure out the exact URL endpoint your app requires
- [ ] knowing how URLs are structured will be really helpful, take a look at this <a href="https://en.wikipedia.org/wiki/Query_string">article on URL query strings and encoding</a>
- [ ] here is a <a href="https://stackoverflow.com/questions/21454979/use-the-facebook-api-in-a-google-apps-script-web-app/23300702">really great overview</a> for branding any login processes for Facebook, working with the API in GAS, and establishing your app as a web app when working with GAS

Breaking Down the Script
-
This section will be heavily referencing the ```Code.gs``` file.
For the UX, this particular script will run when the user navigates to the top ribbon in the Google Sheet to click on our custom menu item. <a href="https://developers.google.com/apps-script/guides/menus">Click here</a> for more info on adjusting the sheet UI, custom menus/dialogues/sidebars in Apps Script.
This function calls the function we specify and the text to display:
```
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('PULL PACING')
    .addItem('Get Reports', 'showSidebar')
    .addItem('Clean Out Report', 'backlog')
    .addToUi();
}
```
It ends up looking something like this:
![Custom Menu Item GS](images/5.PNG?raw=true)

The API call URL has been divided into ```base``` and ```endpoint```. The base remains the same, but the endpoint may differ based on your inputs into the Graph API. If you change the JSON data you wish to pull, the endpoint may change -- separating the endpoint from the base of the URL is simply a best practice but is not necessary.
```
//setup api url
  var base = 'https://graph.facebook.com/v3.3/';
  var endpoint = 'me?fields=id%2Cname%2Caccounts%2Cadaccounts%7Baccount_id%2Camount_spent%2Cbusiness_name%2Cid%2Cadsets%7Bpacing_type%2Cbudget_remaining%2Ccreated_time%2Cend_time%2Cstart_time%7D%7D&access_token=';
  var url = base + endpoint;
  //Logger.log(url);
```
This script in particular is also set up to simply add on new information each time it is called with the <a href="https://developers.google.com/apps-script/reference/spreadsheet/sheet#appendRow(Object)">append row function</a> at the end:
```
function toSheet(string) {
  var id = string.accounts;
  var start = ...;
  var end = ...;
  var bidAmount = ...;
  //Logger.log(id);
  
  var row = [id, start, end, bidAmount]; // these are some examples of any variables you declare above -- list them in order of how you want them to appear in the spreadsheet cells
  
  var sheet = SpreadsheetApp.getActiveSheet();
  
  sheet.appendRow(row);
}
```
My team pulls pacing every month, so this script has a function accessible from the custom menu "PULL PACING" at the top to backlog the last month's data in a new spreadsheet and clear out this information so we can pull the current month's pacing report. For more on working with dates in Apps Script, <a href="https://developers.google.com/apps-script/reference/utilities/utilities#formatDate(Date,String,String)">check out the Utilities class</a>. 
```
function backlog() {
  // names the backup spreadsheet with current month and name of current spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MMMM-YYYY");
  var ssName = date + " " + ss.getName();
  Logger.log(ssName);
  
  var ogSSName = ss.getName();
  var backupSheet = DriveApp.getFilesByName(ogSSName);
  Logger.log(backupSheet.hasNext());
  
  // duplicate spreadsheet and put into specific folder
  var destFolder = DriveApp.getFoldersByName('<NAME OF FOLDER>').next();
  DriveApp.getFileById(ss.getId()).makeCopy('Backlog: ' + ssName, destFolder);
  
  // clear out old data from original spreadsheet
  var sheet = ss.getActiveSheet();
  var dataRange = sheet.getRange(['A3:G1000']).activate();
  dataRange.clearContent(); // rather than just doing .clear(), this will maintain any functions / formatting you may have in ss
}
```

Get the Correct Permissions
-

Submit App for Review
-
Things you will need to submit your app for review:
- [ ] App Icon that's no bigger than 1024x1024
- [ ] A privacy policy -- you can <a href="https://www.freeprivacypolicy.com/">make one for free here</a> (depending on your needs, there may be some add on costs) 
- [ ] You will also need an app URL (since this is a web-based app). In your GAS editor, go to Publish > Deploy as web app... > then set it to "Only Myself" in the drop-down under "Who has access to this app?" -- take this URL and add it to your Facebook App dashboard.
- [ ] Under App Review > My Permissions and Features in your App Dashboard, you will need to make a case for each permission this app uses and why (in our case, this would be the ```ads_read``` and ```ads_management``` permissions we requested in the Graph API.

![App Review](images/4.PNG?raw=true)


