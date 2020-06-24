GENERATE THE TOKEN FOR ARCGIS First you need to generate the token with your user and password for Arcgis

Rest Service Url: "https://www.arcgis.com/sharing/rest/generateToken" data: { username: "", password: "", f: "json", referer: "https://services7.arcgis.com" }

On the file script.js You will need to paste the token on the line 8

var tokenValue = "*";

As well you will need to uncomment the url for live or test.

//Service for live var service = "https://services7.arcgis.com/lTrEzFGSU2ayogtj/arcgis/rest/services/[COMPLETA]_Afectados_por_coronavirus_por_provincia_en_Espa%C3%B1a_historico/FeatureServer";

//Service for test var service = "https://services7.arcgis.com/lTrEzFGSU2ayogtj/arcgis/rest/services/DatosCovid_Dummy_para_Merce/FeatureServer";

To Run the script you only need to open index.html.
