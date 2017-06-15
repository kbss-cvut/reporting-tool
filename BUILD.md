# Building Reporting Tool

This document describes the process of building the Reporting tool.

## Reporting Tool

#### Environment Requirements

Building a production archive of the reporting tool (RT) requires the presence and correct configuration of the following tools and platforms:

* JDK 8 (available at [http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html](http://www.oracle.com/technetwork/java/javase/downloads/index-jsp-138363.html)),
* Apache Maven 3.x (available at [https://maven.apache.org/](https://maven.apache.org/)),
* NodeJS v6.x (available at [https://nodejs.org/en/](https://nodejs.org/en/)),
* npm 3.x (part of NodeJS distribution).

The build process requires internet access.

#### Configuration

Before the actual build, it is possible to modify the configuration used by the RT at runtime. This configuration is divided
into several groups, which have their own configuration files.

##### Main RT Configuration

The main configuration of the RT resides in `src/main/resources/config.properties`. The following parameters can be set:

* `repositoryUrl` - URL of the main repository in which application stores its data,
* `eventTypesRepository` - URL of the repository containing vocabularies and taxonomies used by the RT,
* `formGenRepositoryUrl` - URL of the repository used by the RT and the form generator to share data used by the form generation process,
* `formGenServiceUrl` - URL of the form generator web service,
* `textAnalysisServiceUrl` - URL of the text analysis web service.

The application is preconfigured to values compatible with the installation guide.


##### Text Analysis Service Configuration

Configuration for the text analysis service, which is used in initial report import, is in `src/main/resources/text-analysis.properties`.

The following parameters can be configured:

* `text-analysis.vocabularies` - comma-separated list of vocabularies used in term recognition.

#### Build

When the configuration is finished, it is possible to build the application.

1. Open terminal or command line.
1. Change the current directory to the RT project root.
2. Start the build process using `mvn clean package -p production`.
    1. This can take a few minutes.
4. The output archive is called `reporting-tool.war` and it can be found in the `target` directory.

The `reporting-tool.war` archive can be deployed to an application server. It is then available at 
`http://server.url/reporting-tool`, where `http://server.url/` is the URL of the application server.



## Czech Version

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
4. Výsledný archiv nese název `reporting-tool.war` a nachází se ve složce `target`.

Archiv `reporting-tool.war` lze nakopírovat do aplikačního serveru, kde bude pak aplikace dostupná na adrese 
`http://adresa.serveru/reporting-tool`, kde `http://adresa.serveru/` je adresa, na které je aplikační server dostupný.
