import urllib, json, ssl, os, arcpy

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

fc = "C:\Geovoluntarios\MADRID\MADRID_HIS.gdb\zonas_basicas_salud"
plantilla = "C:\Geovoluntarios\MADRID\MADRID.gdb\plantilla_areaSalud"
fields = ['codigo_geo', 'casos_confirmados_totales','tasa_incidencia_acumulada_ultimos_14dias','tasa_incidencia_acumulada_total', 'casos_confirmados_ultimos_14dias']

#insercion plantilla Municpios por fecha
fecha_input = raw_input("Introduce Fecha (YYYY/MM/DD): ")
fecha =  str(fecha_input + ' 09:00:00')


url = "https://datos.comunidad.madrid/catalogo/dataset/b3d55e40-8263-4c0b-827d-2bb23b5e7bab/resource/01a7d2e8-67c1-4000-819d-3356bb514d05/download/covid19_tia_zonas_basicas_salud.json"
response = urllib.urlopen(url, context=ctx)
data = response.read()
datastore = json.loads(data)

datos = datastore["data"]


# actualizamos fc municipios
arcpy.env.overwriteOutput =True

expression = '"fecha_informe" = ' + "'" + fecha + "'"

fc_select = os.path.join(arcpy.env.scratchGDB, "fc_select")
arcpy.Select_analysis(fc, fc_select, expression)
result = int(arcpy.GetCount_management(fc_select).getOutput(0))

if (result == 0 ):

    codigos = []
    dicci = {}
    for item in datos:
        if item["fecha_informe"] == fecha:
           codigo = item["codigo_geometria"]
           codigos.append(codigo)
           for cod in codigos:
               if (item ["codigo_geometria"] == cod):
                   casos = item.get("casos_confirmados_totales")
                   tasa_14d = item.get("tasa_incidencia_acumulada_ultimos_14dias")
                   tasa_total = item.get("tasa_incidencia_acumulada_total")
                   casos_14d = item.get("casos_confirmados_ultimos_14dias")
                   dicci[cod] = [casos, tasa_14d, tasa_total, casos_14d]
    #print dicci

    arcpy.CalculateField_management(plantilla, "fecha_informe", "'" + fecha + "'", "PYTHON_9.3", "")
    arcpy.CalculateField_management(plantilla, "FECHA", "!fecha_informe!", "PYTHON_9.3", "")
    arcpy.CalculateField_management(plantilla, "FECHA", "datetime.datetime.strptime( !FECHA! , '%d/%m/%Y %H:%M:%S') - datetime.timedelta(days=1)", "PYTHON_9.3", "")
    arcpy.Append_management(plantilla, fc, "NO_TEST", "", "")

    with arcpy.da.UpdateCursor(fc, fields, where_clause=expression) as cursor:
        for row in cursor:
            codigo = row[0]
            fc_casos = dicci[codigo][0]
            fc_tasa_14d = dicci[codigo][1]
            fc_tasa_total = dicci[codigo][2]
            fc_casos_14d = dicci[codigo][3]
            row[1] = fc_casos
            row[2] = fc_tasa_14d
            row[3] = fc_tasa_total
            row[4] = fc_casos_14d
            cursor.updateRow(row)
else:
     print "Los datos para esta fecha ya existen en BBDD"

print "Datos por areas sanitarias actualizados"




