# Obtener Datos covid-19 CCAA Madrid (ISCII)

_Mediante este script se puede consultar de la fuente oficial del Ministerio de Sanidad_

_Actualización diaria de la situación de COVID-19 en España, con información geográfica y características epidemiológicas de los casos de COVID-19 (referidos siempre a casos con confirmación virológica por PCR), así como de indicadores de evolución de la pandemia. Resultados obtenidos a partir de la notificación agregada diaria de las CCAA al Ministerio de Sanidad (datos agregados Min. Sanidad), y de la información individualizada de las CCAA a la Red Nacional de Vigilancia Epidemiológica (RENAVE) (datos individualizados RENAVE)._

https://cnecovid.isciii.es/covid19/



## Comenzando 🚀

 _Los parámetros de entrada son:_ 
* _Un menu para seleccionar CCAA (puede ser ampliable a otras)
* _Otro menu por si se quiere filtar por fecha o no_
* _La fecha de consulta, si en el menu anterior se seleccione filtrar por fecha_


### Pre-requisitos 📋

_Descargar el .csv en https://cnecovid.isciii.es/covid19/#documentaci%C3%B3n-y-datos

```
Los datos agregados notificados por las CCAA al Ministerio de Sanidad están disponibles aquí.
```


_Python 2.7_

```
C:\Users\scarrascov>python "D:\Geovoluntarios\GALICIA\scrappingSERGAS_menu.py"
```                  

### Ejecución 🔧

_Ejecuta el script desde la consola_

```
C:\Users\scarrascov>python "D:\Geovoluntarios\GALICIA\scrappingSERGAS_menu.py"
```

_Introduce la fecha de consulta o inserción_

```
Introduce fecha(dd MM YYYY): 13 05 2020
```

_Selecciona la opcion de solo consulta o consulta e insercion de datos_

```
Selecciona Solo Consulta(C) / Consulta y Grabar Datos(S): C
```

_Opción C: Se obtienen un informe por pantalla con los datos_

```
------------------------------------------
FECHA INFORME:                  13 05 2020
NOTA DE PRENSA: A Direcci¢n Xeral de Sa£de P£blica da Conseller¡a de Sanidade informa que, na £ltima actualizaci¢n, 
o n£mero de casos activos de coronavirus en Galicia ascende a 2.179 deles 532 son da  rea da Coru¤a, 124 da de Lugo, 
333 da de Ourense, 110 da de Pontevedra, 565 da  rea de Vigo, 436 da de Santiago, e 79 da de Ferrol.
------------------------------------------
CASOS POR EOXI
------------------------------------------
A Coruna = 1047
Pontevedra = 675
Ourense = 333
Lugo = 124
------------------------------------------
```

_Opción S: Se obtienen un informe por pantalla con los datos y se guarda en BBDD_

```
------------------------------------------
FECHA INFORME:                  13 05 2020
NOTA DE PRENSA: A Direcci¢n Xeral de Sa£de P£blica da Conseller¡a de Sanidade informa que, na £ltima actualizaci¢n, 
o n£mero de casos activos de coronavirus en Galicia ascende a 2.179 deles 532 son da  rea da Coru¤a, 124 da de Lugo, 
333 da de Ourense, 110 da de Pontevedra, 565 da  rea de Vigo, 436 da de Santiago, e 79 da de Ferrol.
------------------------------------------
CASOS POR EOXI
------------------------------------------
A Coruna = 1047
Pontevedra = 675
Ourense = 333
Lugo = 124
------------------------------------------
Guardando en bbdd...
Datos guardados correctamente
```

## Despliegue 📦

_Para guardar los datos y construir la bbdd historica, es necesario que:_
* Las GDBs se encuentren en el mismo directorio al que apunta el script
* Tengan la misma estructura de features y campos que se adjunta

## Construido con 🛠️

* [Python 2.7](https://www.python.org/download/releases/2.7/) - Lenguaje de programación
* [ArcGis 10.7](https://desktop.arcgis.com/es/arcmap/latest/get-started/installation-guide/installing-on-your-computer.htm) - Plataforma GIS

## Wiki 📖

Puedes encontrar mucho más información de este proyecto en [datoscovid](https://www.datoscovid.es/)

## Licencia 📄

Este proyecto está bajo la Licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## Autores ✒️

* **Sheila Carrasco** - *Trabajo Inicial* - [carrasco2](https://github.com/carrasco2)


