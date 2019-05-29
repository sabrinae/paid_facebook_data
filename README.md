# facebook_pacing
Google Apps Script that connects with Facebook API to automatically pull pacing reports from ad accounts
-
First, create a new app by heading over to https://developers.facebook.com - this will be a web-based app since we are connecting the API to a Google Sheet. You will also need a <a href="https://developers.facebook.com/docs/marketing-api/businessmanager/systemuser">system user</a>. I created both a regular system user as well as an admin-level system user.

Add the Facebook Login capability in your dashboard under Products:

<!--![Facebook Login Product](images/1.PNG?raw=true)-->

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

Use Facebook's Graph API for Right Scopes
-

Get the Correct Permissions
-

Submit App for Review
-
Things you will need to submit your app for review:
- [ ] App Icon that's no bigger than 1024x1024
- [ ] A privacy policy -- you can <a href="https://www.freeprivacypolicy.com/">make one for free here</a> (depending on your needs, there may be some add on costs) 
- [ ] You will also need an app URL (since this is a web-based app). In your GAS editor, go to Publish > Deploy as web app... > then set it to "Only Myself" in the drop-down under "Who has access to this app?" -- take this URL and add it to your Facebook App dashboard.
- [ ] Under App Review > My Permissions and Features in your App Dashboard, you will need to make a case for each permission this app uses and why (in our case, this would be the ```ads_read``` and ```ads_management``` permissions we requested in the Graph API.
