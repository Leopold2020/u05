    Vad är TypeScript och varför använder man det istället för vanlig JavaScript?
Typescript är ett språk som bygger på javascript vilket då lägger till type anmärkningar och visar error om den upptäcker logik fel i funktioner. Det andvänds för att underlätta för programerare i stora arvbeten för att kunna lättare felsöka problem, att ha flera rader javascript och leta efter ett fel kan ta onödigt mycket tid.



    Förklara skillnaden mellan unknown, any och en specifik typ som string. När bör man använda de olika typerna?
unknown och any är båda två typer som man kan assignera all olika typer i, men skillanden mellan de två är att unknown kan man inte göra om till andra värden, any variabler kan man göra om till strings eller number, men unknown stannar unknown. Medans string är en variabel som tolkas som text, man kan lägga in siffror men man kommer inte kunna andvända dom i matte funktioner för då måste man omvandla de till en number variabel. 

Helst ska man inte andvända any alls, det är mer stabilt om man bara andvänder specefika typer som string så det är lättare att hantera all värden utan att det kommer problem med någon konstig interkation mellan olika typer som hamnat i any. Och unknown andväns om man hämtar data från en tredje-part API då man inte redan vet vad för värde typ man kommer få.



    Vad är syftet med att använda types/interfaces i TypeScript? Varför är de viktiga när man bygger större projekt?
Det underlättar med att undvika buggar med t.ex man inte försöker subtrahera två stringar med varan i ens kalkylator webbsida man arbetat på. Man kan andvända exlusivt any typer men då kommer det leda till felhanteringa förr eller senare.