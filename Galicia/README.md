# Obtener Casos activos covid-19 GALICIA (SERGAS)

_Mediante este script se puede consultar de la fuente oficial SERGAS, que facilita los datos mediante Notas de Prensa por EOXI, 
los casos activos por fecha desagregados en provincias (A Coruña, Pontevedra, Ourense y Lugo):_ 
https://saladecomunicacion.sergas.gal/Paginas/Buscar.aspx?k=coronavirus

_También puede guardar los datos de esa fecha en una GDB, ya generada, construyendo una base de datos histórica._

_Geometria **polygon y point**_

## Comenzando 🚀

* _Los parámetros de entrada son: la fecha de consulta/inserción de datos y un menu donde se selecciona si solo se quiere
consultar los datos o consultar los datos y además añadirlos a la base de datos_
* _La fecha se debe introducir segun el formato indicado_
* _El menu para consultar datos se indica C y para consultar y guardar datos S_ 

### Pre-requisitos 📋

_Python 2.7_

```
C:\Users\scarrascov>python "D:\Geovoluntarios\GALICIA\scrappingSERGAS_menu.py"
```
_GDB Plantilla:_ "C:\Geovoluntarios\GALICIA\GALICIA.gdb\plantilla_eoxi"

_GDB BBDD histórica:_ 
* fc = "C:\Geovoluntarios\GALICIA\GALICIA_HIS.gdb\galicia_areasSanitarias"
* fc_point = "C:\Geovoluntarios\GALICIA\GALICIA_HIS.gdb\galicia_areasSanitarias_P"
                     

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
