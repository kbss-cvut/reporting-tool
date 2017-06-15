# Building Reporting Tool

Tento dokument popisuje proces sestavení aplikace Reporting Tool.

## Reporting Tool


#### Požadované prostředí

Pro sestavení produkčního archivu reportovacího nástroje (dále jen RT) je třeba mít nainstalované a správně nakonfigurované následující knihovny a platformy:

* JDK 8 (ke stažení na [http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html](http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html)),
* Apache Maven 3.x (ke stažení na [https://maven.apache.org/](https://maven.apache.org/)),
* NodeJS v6.x (ke stažení na [https://nodejs.org/en/](https://nodejs.org/en/)),
* npm 3.x (je součástí distribuce NodeJS).

Při sestavení je též nutný přístup k internetu.


#### Konfigurace

Před sestavením archivu lze měnit nastavení, které bude RT používat při běhu. Toto nastavení je rozděleno do několika
skupin, které mají samostatné konfigurační soubory.

##### Hlavní konfigurace RT

Hlavní konfigurace reportovacího nástroje se nachází v souboru `src/main/resources/config.properties`. Nastavovat lze následující parametry:

* `repositoryUrl` - adresa hlavního úložiště, do kterého aplikace ukládá data,
* `eventTypesRepository` - adresa úložiště, ve kterém se nachází taxonomie a slovníky používané RT,
* `formGenRepositoryUrl` - adresa úložiště, které používá RT a generátor formulářů pro předávání dat, na jejichž základě se formuláře generují,
* `formGenServiceUrl` - adresa webové služby generátoru formulářů,
* `textAnalysisServiceUrl` - adresa webové služby analýzy textu.

Pokud při instalaci postupujete dle instalačního manuálu, není třeba tuto konfiguraci měnit, neboť je přednastavena pro hodnoty z manuálu.


##### Nastavení spojení se službou analýzy textu

Nastavení parametrů pro službu analýzy textu, která se používá při importu prvotního hlášení, se nachází v souboru `src/main/resources/text-analysis.properties`.

Soubor obsahuje následující konfigurační parametry:

* `text-analysis.vocabularies` - Čárkou oddělený seznam slovníků, které má služba použít při rozpoznávání pojmů v textu.


#### Sestavení

Po případných úpravách konfigurace lze přistoupit k sestavení produkční verze systému.

1. Spusťte terminál či příkazovou řádku.
1. Nastavte cestu do hlavní složky RT.
2. Spusťte sestavení příkazem `mvn clean package -p production`.
    1. Tento krok může trvat několik minut.
4. Výsledný archiv nese název `inbas-reporting-tool.war` a nachází se ve složce `target`.

Archiv `inbas-reporting-tool.war` lze nakopírovat do aplikačního serveru, kde bude pak aplikace dostupná na adrese 
`http://adresa.serveru/inbas-reporting-tool`, kde `http://adresa.serveru/` je adresa, na které je aplikační server dostupný.
