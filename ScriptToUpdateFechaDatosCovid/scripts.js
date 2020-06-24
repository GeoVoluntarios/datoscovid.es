$(document).ready(function () {
    $("#steps").append("Get the token </br>");
    //To generate the token with your use
    //const urlToken = "https://www.arcgis.com/sharing/rest/generateToken";
    //const data = { username: "*", password: "*", f: "json", referer: "https://services7.arcgis.com" }

    //paste your token here
    var tokenValue = "*";


    //Service for live
    //var service = "https://services7.arcgis.com/lTrEzFGSU2ayogtj/arcgis/rest/services/[COMPLETA]_Afectados_por_coronavirus_por_provincia_en_Espa%C3%B1a_historico/FeatureServer";

    //Service for test
    var service = "https://services7.arcgis.com/lTrEzFGSU2ayogtj/arcgis/rest/services/DatosCovid_Dummy_para_Merce/FeatureServer";


    const urlQuery = service + "/0/query";
    const values = { f: "json", token: tokenValue, where: "1=1", returnExceededLimitFeatures: true, returnGeometry: false, outFields: "*", returnIdsOnly: true }

    //Get the ids to update

    var urlApplyEdits = service + "/0/applyEdits";

    $.when(SetIdsToUpdate(urlQuery, values)).done(function (arrayIds) {
        var ids = $.parseJSON(arrayIds);
        ids = ids.objectIds;
        $.each(ids, function (index, value) {
            $("#steps").append("Ids to update " + value + " </br>");
            var valuesGetDate = { f: "json", token: tokenValue, where: "OBJECTID_1=" + value, returnExceededLimitFeatures: true, returnGeometry: false, outFields: "Fecha, FechaNormalizada", returnIdsOnly: false }
            $.post(urlQuery, valuesGetDate, function (valuesGetDate) {
                var v = $.parseJSON(valuesGetDate);
                var fecha = v.features[0].attributes.Fecha;
                //Vieja fecha 
                var today = new Date(fecha).getDate();
                var tomonth = new Date(fecha).getMonth() + 1;
                var toyear = new Date(fecha).getFullYear();
                var fechaNormalizada = tomonth + '/' + today + '/' + toyear;

                //update the date
                var attributes = "[{\"attributes\": {\"OBJECTID_1\": " + value + ",\"Fecha\":\"" + fechaNormalizada + " 7:59 PM\", \"FechaNormalizada\": \"" + fechaNormalizada + " 21:59:00\"}}]"
                var valuesUpdateDate = { f: "json", token: tokenValue, updates: attributes }

                $.post(urlApplyEdits, valuesUpdateDate, function (valuesUpdateDate) {
                    var updateResults = $.parseJSON(valuesUpdateDate);
                    $("#steps").append(updateResults.updateResults[0]);
                    console.log(updateResults);
                });

            });
        });
        //    $("#idsToUpdate").val(data.objectIds);
    });



});

function SetToken(url, data) {
    $.post(url, data, function (data) {
        data = $.parseJSON(data);
        $("#token").html(data.token);
    });
}

function SetIdsToUpdate(url, data) {
    return $.ajax({
        url: url,
        data: data,
        success: function (result) {
            //console.log("Success to get the ids to update ");
        }
    });

}

