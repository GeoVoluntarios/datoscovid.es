import requests, arcpy
from bs4 import BeautifulSoup


fecha = raw_input("Introduce fecha(dd MM YYYY): ")
menu = raw_input("Selecciona Solo Consulta(C) / Consulta y Grabar Datos(S): ")

def consultaDatos():
    ## obtenemos idNova por fecha en la primera pagina del SERGAS
    URLSergas = 'https://saladecomunicacion.sergas.gal/Paginas/Buscar.aspx?k=coronavirus'
    page = requests.get(URLSergas)

    soup = BeautifulSoup(page.content, 'html.parser')
    #results = soup.find(id='WebPartWPQ4')

    job_elems = soup.find_all('div', class_='encabezadoNoticiaSinImg')
    for job_elem in job_elems:
        #print job_elem
        x = str(job_elem).find(fecha)
        y = str(job_elem).find("REXISTRA")
        if x != -1 and y != -1:
            div = job_elem

    #print div

    x = str(div).find("idNova")
    idNova = str(div)[x+7:x+12]
    #print idNova


    ## obtenemos los datos por areas sanitarias
    URL = 'https://saladecomunicacion.sergas.gal/Paginas/DetalleNova.aspx?idNova=' + idNova +'&idioma=ga'
    page = requests.get(URL)

    soup = BeautifulSoup(page.content, 'html.parser')
    #results = soup.find(id='WebPartWPQ4')

    job_elems = soup.find_all('div', class_='textoNewDetalle')

    texto = ''
    for job_elem in job_elems:
        fechaInforme = job_elem.find('span', class_="dataListaNovasSin")

        texto = job_elem.find('p', string=lambda text: 'Ourense')
        x = str(texto).find("Ourense")
        if x == -1:
            texto = job_elem.find('font', string=lambda text: 'Ourense')
            x = str(texto).find("Ourense")
            if x == -1:
                texto = job_elem.find_all('div', string=lambda text: 'Ourense')


    print ("------------------------------------------")
    print ("FECHA INFORME: " + fechaInforme.text)
    print ("------------------------------------------")

    ## tratamos el parrafo
    mystring = str(texto)
    mystring = mystring.split(',')


    def getDatos (cadena, index, item):

        area= cadena[index]
        area = area.split()
        areaDato =area[item]
        areaDatoN = areaDato.replace('.','')

        return areaDatoN

    indice = [i for i, s in enumerate(mystring) if 'deles' in s]

    #corunaDatoN = getDatos(mystring, indice[0], 13)
    corunaDatoN = getDatos(mystring, indice[0], 1)
    lugoDatoN = getDatos(mystring, indice[0]+1 , 0)
    ourenseDatoN = getDatos(mystring, indice[0]+2 , 0)
    pontevedraDatoN = getDatos(mystring, indice[0]+3 , 0)
    vigoDatoN = getDatos(mystring, indice[0]+4 , 0)
    santiagoDatoN = getDatos(mystring, indice[0]+5 , 0)
    ferrolDatoN = getDatos(mystring, indice[0]+6 , 1)

    '''print ferrolDatoN, santiagoDatoN, corunaDatoN
    print pontevedraDatoN, vigoDatoN
    print ourenseDatoN
    print lugoDatoN'''

    ## Calculamos los datos para provincias
    provinciaCoruna= int(ferrolDatoN) + int(santiagoDatoN) + int(corunaDatoN)
    provinciaPontevedra = int(pontevedraDatoN) + int(vigoDatoN)

    print ("CASOS POR EOXI")
    print ("A Coruna = " + str(provinciaCoruna))
    print ("Pontevedra = " + str(provinciaPontevedra))
    print ("Ourense = " + str(ourenseDatoN))
    print ("Lugo = " + str(lugoDatoN))
    print ("------------------------------------------")

    return corunaDatoN, santiagoDatoN, ferrolDatoN, lugoDatoN, ourenseDatoN, pontevedraDatoN, vigoDatoN

if menu == 'C':
    consultaDatos()
elif menu == 'S':
    corunaDatoN, santiagoDatoN, ferrolDatoN, lugoDatoN, ourenseDatoN, pontevedraDatoN, vigoDatoN = consultaDatos()

    ## Agregar datos a fc
    print ("Guardando en bbdd...")
    fc = "C:\Geovoluntarios\GALICIA\GALICIA_HIS.gdb\galicia_areasSanitarias"
    fc_point = "C:\Geovoluntarios\GALICIA\GALICIA_HIS.gdb\galicia_areasSanitarias_P"
    plantilla = "C:\Geovoluntarios\GALICIA\GALICIA.gdb\plantilla_eoxi"

    fecha =  str(fecha + ' 13:00:00')

    ## se preparan los datos para la actualizacion en BBDD
    arcpy.CalculateField_management(plantilla, "fecha_informe", "'" + fecha + "'", "PYTHON_9.3", "")
    arcpy.CalculateField_management(plantilla, "FECHA", "!fecha_informe!", "PYTHON_9.3", "")
    arcpy.CalculateField_management(plantilla, "FECHA", "datetime.datetime.strptime( !FECHA! , '%d/%m/%Y %H:%M:%S') - datetime.timedelta(days=1)", "PYTHON_9.3", "")
    arcpy.Append_management(plantilla, fc, "NO_TEST", "", "")

    ## actualizamos fc EOXI
    expression = '"fecha_informe" = ' + "'" + fecha + "'"
    fields = ['COD_EOXI', 'CASOS_CONFIRMADOS']

    with arcpy.da.UpdateCursor(fc, fields, where_clause=expression) as cursor:
        for row in cursor:
            codigo = row[0]
            if codigo == 1:
                row[1] = int(corunaDatoN)
            elif codigo == 2:
                row[1] = int(santiagoDatoN)
            elif codigo == 3:
                row[1] = int(ferrolDatoN)
            elif codigo == 4:
                row[1] = int(lugoDatoN)
            elif codigo == 5:
                row[1] = int(ourenseDatoN)
            elif codigo == 6:
                row[1] = int(pontevedraDatoN)
            elif codigo == 7:
                row[1] = int(vigoDatoN)
            cursor.updateRow(row)

    ## convertimos fc EOXI a entidad de puntos
    arcpy.env.overwriteOutput = True
    arcpy.FeatureToPoint_management (fc, fc_point, "CENTROID")

    print ("Datos guardados correctamente")
