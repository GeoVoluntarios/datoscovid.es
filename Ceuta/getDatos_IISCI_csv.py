import csv, requests
from tabulate import tabulate

CCAA = raw_input("Introduce CCAA (AN/AR/AS/IB/CN/CB/CM/CL/CT/CE/VC/EX/GA/MD/ML/MC/NC/PV/RI): ")
porFecha = raw_input("Quiere filtrar por fecha? (Y/N): ")

if porFecha == 'Y':
   fecha = raw_input("Introduce fecha (D/M/YYYY): ")

path = 'D:/Geovoluntarios/CCAA/'

url = 'https://cnecovid.isciii.es/covid19/resources/agregados.csv'
myfile = requests.get(url, allow_redirects=True)
open(path + 'agregados.csv', 'wb').write(myfile.content)


with open(path + 'agregados.csv') as csvfile:

    reader = csv.DictReader(csvfile, delimiter=',')
    table = []
    table.append(['FECHA', 'PCR+', 'TestAc+', 'SUMA', 'Fallecidos', 'Hospitalizados', 'Recuperados', 'CCAA', 'Casos', 'UCI'])
    for row in reader:
        if porFecha == 'N' and row['CCAA'] == CCAA:
           if row['TestAc+'] == '':
               row.update({"TestAc+": '0'})
           suma = int(row['PCR+']) + int(row['TestAc+'])
           valor = row.setdefault('SUMA',suma)
           table.append(row.values())

        elif porFecha == 'Y' and row['CCAA'] == CCAA and row['FECHA'] == fecha:
            if row['TestAc+'] == '':
                row.update({"TestAc+": '0'})
            suma = int(row['PCR+']) + int(row['TestAc+'])
            valor = row.setdefault('SUMA',suma)
            table.append(row.values())


print(tabulate(table, headers="firstrow", tablefmt="grid"))





