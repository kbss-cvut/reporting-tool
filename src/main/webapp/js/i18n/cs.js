/*
 * Copyright (C) 2016 Czech Technical University in Prague
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details. You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Czech localization.
 */

var Constants = require('../constants/Constants');

module.exports = {
    'locale': 'cs',

    'messages': {
        'add': 'Přidat',
        'back': 'Zpět',
        'cancel': 'Zrušit',
        'open': 'Otevřít',
        'close': 'Zavřít',
        'cancel-tooltip': 'Zrušit a zahodit změny',
        'save': 'Uložit',
        'delete': 'Smazat',
        'headline': 'Název',
        'summary': 'Shrnutí',
        'narrative': 'Popis',
        'fileNo': 'Číslo záznamu',
        'table-actions': 'Akce',
        'table-edit': 'Editovat',
        'save-success-message': 'Hlášení úspěšně uloženo.',
        'save-failed-message': 'Hlášení nelze uložit. Odpověď serveru: ',
        'author': 'Autor',
        'author-title': 'Autor hlášení',
        'description': 'Popis',
        'select.default': '--- Vybrat ---',
        'yes': 'Ano',
        'no': 'Ne',
        'unknown': 'Neznámé',
        'uploading-mask': 'Nahrávám',
        'please-wait': 'Prosím čekejte...',

        'detail.save-tooltip': 'Uložit změny',
        'detail.saving': 'Ukládám...',
        'detail.invalid-tooltip': 'Některá povinná pole nejsou vyplněna',
        'detail.large-time-diff-tooltip': 'Časový rozdíl počátku a konce události je příliš velký',
        'detail.submit': 'Nová revize',
        'detail.submit-tooltip': 'Vytvořit novou revizi tohoto hlášení',
        'detail.submit-success-message': 'Zpráva úspěšně odeslána.',
        'detail.submit-failed-message': 'Hlášení se nepodařilo odeslat. Odpověď serveru: ',
        'detail.phase-transition-success-message': 'Hlášení úspěšně převedeno do další fáze.',
        'detail.phase-transition-failed-message': 'Přechod do další fáze se nezdařil. Zachycena chyba: ',
        'detail.loading': 'Načítám hlášení...',
        'detail.not-found.title': 'Hlášení nenalezeno',


        'login.title': Constants.APP_NAME + ' - Přihlášení',
        'login.username': 'Uživatelské jméno',
        'login.password': 'Heslo',
        'login.submit': 'Přihlásit',
        'login.register': 'Registrace',
        'login.error': 'Přihlášení se nezdařilo.',
        'login.progress-mask': 'Přihlašuji...',

        'register.title': Constants.APP_NAME + ' - Nový uživatel',
        'register.first-name': 'Jméno',
        'register.last-name': 'Příjmení',
        'register.username': 'Uživatelské jméno',
        'register.password': 'Heslo',
        'register.password-confirm': 'Potvrzení hesla',
        'register.passwords-not-matching-tooltip': 'Heslo a jeho potvrzení se neshodují',
        'register.submit': 'Registrovat',
        'register.mask': 'Registruji...',

        'main.dashboard-nav': 'Hlavní strana',
        'main.reports-nav': 'Hlášení',
        'main.statistics-nav': 'Statistiky',
        'main.logout': 'Odhlásit se',

        'dashboard.welcome': 'Dobrý den, {name}, vítejte v ' + Constants.APP_NAME + '.',
        'dashboard.create-tile': 'Vytvořit hlášení',
        'dashboard.search-tile': 'Hledat hlášení',
        'dashboard.search-placeholder': 'Název hlášení',
        'dashboard.view-all-tile': 'Prohlížet všechna hlášení',
        'dashboard.create-empty-tile': 'Začít s prázdným hlášením',
        'dashboard.create-import-tile': 'Importovat hlášení',
        'dashboard.recent-panel-heading': 'Nedávno přidaná/upravená hlášení',
        'dashboard.recent-table-last-edited': 'Naposledy upraveno',
        'dashboard.recent.no-reports': 'Zatím nebylo vytvořeno žádné hlášení.',
        'dashboard.import.import-e5': 'Importovat hlášení ve formátu E5X/E5F',

        'dashboard.unprocessed': 'Máte {count} nezpracovaných hlášení.',

        'dropzone.title': 'Přetáhněte soubor sem nebo klikněte pro výběr souboru k nahrání.',
        'dropzone-tooltip': 'Klikněte zde pro výber souboru k nahrání',

        'reports.no-reports': 'Nenalezena žádná hlášení. Nové hlášení můžete vytvořit ',
        'reports.no-reports.link': 'zde.',
        'reports.no-reports.link-tooltip': 'Jít na hlavní stránku',
        'reports.open-tooltip': 'Kliknutím zobrazíte detail hlášení a můžete hlášení upravovat',
        'reports.delete-tooltip': 'Smazat toto hlášení',
        'reports.loading-mask': 'Nahrávám hlášení...',
        'reports.panel-title': 'Hlášení',
        'reports.table-date': 'Datum a čas',
        'reports.table-date.tooltip': 'Datum a čas hlášené události',
        'reports.table-moreinfo': 'Další informace',
        'reports.table-type': 'Typ hlášení',
        'reports.table-classification': 'Kategorie',
        'reports.table-classification.tooltip': 'Vyberte kategorií událostí, kterou chcete zobrazit',
        'reports.phase': 'Stav hlášení',
        'reports.filter.label': 'Zobrazit',
        'reports.filter.type.tooltip': 'Vyberte typ hlášení, která chcete zobrazit',
        'reports.filter.type.all': 'Všechna',
        'reports.filter.type.preliminary': 'Předběžná',
        'reports.filter.no-matching-found': 'Žádná hlášení neodpovídají zvoleným parametrům.',
        'reports.filter.reset': 'Zrušit filtry',
        'reports.paging.item-count': 'Zobrazuji {showing} z {total} položek.',
        'reports.create-report': 'Nové hlášení',

        'delete-dialog.title': 'Smazat hlášení?',
        'delete-dialog.content': 'Skutečně chcete smazat toto hlášení?',
        'delete-dialog.submit': 'Smazat',

        'occurrence.headline-tooltip': 'Krátké pojmenování události - pole je povinné',
        'occurrence.start-time': 'Počátek události',
        'occurrence.start-time-tooltip': 'Datum a čas kdy k události došlo',
        'occurrence.end-time': 'Konec události',
        'occurrence.end-time-tooltip': 'Datum a čas kdy událost skončila',
        'occurrence.class': 'Třída závažnosti',
        'occurrence.class-tooltip': 'Třída závažnosti - pole je povinné',

        'initial.panel-title': 'Prvotní hlášení',
        'initial.table-report': 'Hlášení',
        'initial.wizard.add-title': 'Přidat prvotní hlášení',
        'initial.wizard.edit-title': 'Editovat prvotní hlášení',
        'initial.label': 'Prvotní hlášení',
        'initial.tooltip': 'Text prvotního hlášení - pole je povinné',

        'report.summary': 'Shrnutí hlášení',
        'report.created-by-msg': 'Vytvořil(a) {name} {date}.',
        'report.last-edited-msg': 'Naposledy upravil(a) {name} {date}.',
        'report.narrative-tooltip': 'Popis - pole je povinné',
        'report.table-edit-tooltip': 'Editovat položku',
        'report.table-delete-tooltip': 'Smazat položku',
        'report.corrective.panel-title': 'Nápravná opatření',
        'report.corrective.table-description': 'Opatření',
        'report.corrective.description-placeholder': 'Popis nápravného opatření',
        'report.corrective.description-tooltip': 'Popis nápravného opatření - pole je povinné',
        'report.corrective.add-tooltip': 'Přida popis nápravného opatření',
        'report.corrective.wizard.title': 'Průvodce nápravným opatřením',
        'report.corrective.wizard.step-title': 'Popis nápravného opatření',
        'report.eventtype.table-type': 'Typ události',
        'report.eventtype.add-tooltip': 'Přidat popis typu události',
        'report.organization': 'Organizace',
        'report.responsible-department': 'Zodpovědné oddělení',

        'report.occurrence.category.label': 'Klasifikace události',
        'occurrencereport.title': 'Hlášení o události',
        'occurrencereport.label': 'Událost',

        'wizard.finish': 'Dokončit',
        'wizard.next': 'Další',
        'wizard.previous': 'Předchozí',
        'wizard.advance-disabled-tooltip': 'Některá povinná pole nejsou vyplněna',

        'eventtype.title': 'Typ události',
        'eventtype.default.description': 'Popis',
        'eventtype.default.description-placeholder': 'Popis události',

        'factors.panel-title': 'Faktory',
        'factors.scale': 'Měřítko',
        'factors.scale-tooltip': 'Kliknutím vyberete měřítko: ',
        'factors.scale.second': 'Sekundy',
        'factors.scale.minute': 'Minuty',
        'factors.scale.hour': 'Hodiny',
        'factors.scale.relative': 'Relativní',
        'factors.scale.relative-tooltip': 'Kliknutím vyberete relativní měřítko',
        'factors.link-type-select': 'Typ vztahu mezi faktory?',
        'factors.link-type-select-tooltip': 'Vyberte typ vztahu',
        'factors.link.delete.title': 'Smazat link?',
        'factors.link.delete.text': 'Určitě chcete smazat spojení vedoucí z faktoru {source} do faktoru {target}?',
        'factors.event.label': 'Událost',
        'factors.detail.title': 'Specifikace faktoru',
        'factors.detail.type': 'Typ faktoru',
        'factors.detail.type-placeholder': 'Typ faktoru',
        'factors.detail.time-period': 'Specifikace času',
        'factors.detail.start': 'Faktor nastal',
        'factors.detail.duration': 'Trvání',
        'factors.duration.second': '{duration, plural, =0 {sekund} one {sekunda} few {sekundy} other {sekund}}',
        'factors.duration.minute': '{duration, plural, =0 {minut} one {minuta} few {minuty} other {minut}}',
        'factors.duration.hour': '{duration, plural, =0 {hodin} one {hodina} few {hodiny} other {hodin}}',
        'factors.detail.details': 'Detail faktoru',
        'factors.detail.delete.title': 'Smazat faktor?',
        'factors.detail.delete.text': 'Určitě chcete smazat tento faktor?',
        'factors.detail.wizard-loading': 'Připravuji formulář...',

        'notfound.title': 'Nenalezeno',
        'notfound.msg-with-id': 'Záznam \'{resource}\' s identifikátorem {identifier} nenalezen.',
        'notfound.msg': 'Záznam \'{resource}\' nenalezen.',

        'notrenderable.title': 'Nelze zobrazit záznam',
        'notrenderable.error': 'Chyba: {message}',
        'notrenderable.error-generic': 'Zkontrolujte, prosím, zda je záznam validní.',

        'revisions.label': 'Revize zprávy',
        'revisions.created': 'Vytvořeno',
        'revisions.show-tooltip': 'Zobrazit tuto revizi',
        'revisions.readonly-notice': 'Starší revize jsou pouze ke čtení.',

        'sort.no': 'Kliknutím seřadíte záznamy podle tohoto sloupce',
        'sort.asc': 'Záznamy jsou seřazeny vzestupně',
        'sort.desc': 'Záznamy jsou seřazeny sestupně'
    }
};