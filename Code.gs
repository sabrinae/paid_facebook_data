function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('PULL PACING')
    .addItem('Get Reports', 'showSidebar')
    .addItem('Backlog', 'backlog')
    .addItem('Clean Out Report', 'clearDataBtn')
    .addToUi();
}

function multipleIdRequest() {
  var facebookService = getFacebookService();
  
  var access_token = facebookService.getAccessToken();
  
  var params = {
    headers: {
      Authorization: 'Bearer ' + access_token
    },
    muteHttpExceptions: false
  };

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var formatSheet = ss.getSheetByName('formatting');
  
  var accountIdRange = formatSheet.getRange('C3:C').activate().getValues().filter(String);
  var accountIds = [];
  accountIds.push([accountIdRange].join(','));
  
  var query = encodeURIComponent(accountIds);
  
  var baseURL = 'https://graph.facebook.com/v3.3/insights?ids=';
  var fields = '&fields=account_id%2Caccount_name%2Ccampaign_id%2Ccampaign_name%2Cactions%2Cclicks%2Cimpressions%2Creach%2Cspend%2Ccpc%2Ccpm%2Cctr%2Cdate_start%2Cdate_stop&date_preset=this_month&level=campaign&limit=25&&access_token=';
  var url = baseURL + query + fields;

  var campaignResponse = UrlFetchApp.fetch(url, params);
  
  var campaignData = JSON.parse(campaignResponse.getContentText());
  //Logger.log(campaignData['act_10155815407855071'].data[0].reach);
  toSheet(campaignData);
}

function toSheet(campaignData) {
  var campaignRow = [];
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet1 = ss.getSheetByName('formatting');
  var sheet2 = ss.getSheetByName('Pacing - Campaign Level');
  
  var date = new Date();
    
  for (var i in campaignData) {
    for (var j in campaignData[i].data) {
      var client = campaignData[i].data[j].account_name;
      var clientId = campaignData[i].data[j].account_id;
      var campaignName = campaignData[i].data[j].campaign_name;
      var campaignId = campaignData[i].data[j].campaign_id;
      var startDate = campaignData[i].data[j].date_start;
      var endDate = campaignData[i].data[j].date_stop;
      var spend = campaignData[i].data[j].spend;
      var reach = campaignData[i].data[j].reach;
      var impressions = campaignData[i].data[j].impressions;
      var cpc = campaignData[i].data[j].cpc;
      var cpm = campaignData[i].data[j].cpm;
      var ctr = campaignData[i].data[j].ctr;
      var clicks = campaignData[i].data[j].clicks;

      campaignRow.push([date, client, clientId, campaignName, campaignId, spend, clicks, impressions, reach, cpc, cpm, ctr, startDate, endDate]);
      Logger.log(campaignRow);
    }
  }
  
  var campaignRange = sheet2.getRange(4, 1, campaignRow.length, campaignRow[0].length).setValues(campaignRow);
}

function backlog() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MMMM-dd-YYYY");
  var ssName = date + " " + ss.getName();
  
  var ogSSName = ss.getName();
  var backupSheet = DriveApp.getFilesByName(ogSSName);
  
  var destFolder = DriveApp.getFoldersByName('Old Pacing Reports').next();
  DriveApp.getFileById(ss.getId()).makeCopy('Backlog: ' + ssName, destFolder);
}

function clearDataBtn() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var dataRange = sheet.getRange(['A4:N1000']).activate();
  dataRange.clearContent(); 
}
