
// Declare depencencies
var mongoose = require('mongoose');
var Transaction = mongoose.model('transaction');
var TransactionRows = mongoose.model('transactionRows');
var config = require('config');
var Client = require('node-rest-client').Client;

var retOutputObj;
var intPattern = /^[0-9]+$/;
var decimalPattern = /^[+-]?\d+(\.\d+)?$/;
var datePattern = /([1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;


var dataType = {
  STRING: "String",
  NUMBER : "Number",
  DECIMAL: "Decimal",
  DATE : "Date"
};

// Create JsonResponse
var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var response;
//mongoose module for creating ingestion scheme
module.exports.cleaningsExecute = function(req, res) {
console.log('Called mapping service');
  var transaction =
    {
      partner_type : req.body.partner_type,
      partner_code : req.body.partner_code,
      createdOn : req.body.createdOn,
      reference : req.body.reference,
      rows : req.body.rows
    };

    response = res;
    cleanData(transaction);
    sendJSONresponse(response, 201, transaction);
};

// perform data matching and extract on the data from the file
var cleanData = function(transaction)
{
  var newRows = [];
  transaction.rows.forEach(function(rows)
  {
    var newRowData = [];
    rows.rowData.forEach(function(rowData)
    {
      if(intPattern.test(rowData.value))
        rowData.type = dataType.NUMBER;
     else if(decimalPattern.test(rowData.value))
        rowData.type = dataType.DECIMAL;
     else if(datePattern.test(rowData.value))
           rowData.type = dataType.DATE;
     else
          rowData.type = dataType.STRING;

      newRowData.push(rowData);

      console.log(rowData.value);
    });

     var rowInfo = new TransactionRows();
     rowInfo.rowKey = rows.rowKey;
     rowInfo.rowData = newRowData;
     newRows.push(rowInfo);

  });

   transaction.rows = newRows;
}
