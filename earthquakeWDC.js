(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
      var cols = [{
        id: "event",
        alias: "event",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "date",
        alias: "date",
        dataType: tableau.dataTypeEnum.string
    }, {
        id: "cases",
        alias: "cases",
        dataType: tableau.dataTypeEnum.float
    },];

    var tableSchema = {
        id: "tests",
        alias: "Test Results",
        columns: cols
    };

    schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {
      $.getJSON("https://flatteningthecurve.herokuapp.com/covid/testresults", function(resp) {
          var feat = resp,
              tableData = [];

          var countries = Object.keys(feat)
          var dates = null
          var country = countries[1]
          var date = null
          var clen = countries.length - 1

          for (var i = 0; i < clen; i++) {
            country = countries[i]
            dates = Object.keys(feat[country])
            for (var j = 0, len = dates.length; j < len; j++) {
                date = dates[j]
                tableData.push({
                    "event": countries[i],
                    "date": dates[j],
                    "cases": feat[country][date]
                });
            }
          }

          table.appendRows(tableData);
          doneCallback();
      });
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "USGS Earthquake Feed";
        tableau.submit();
    });
});

})();
