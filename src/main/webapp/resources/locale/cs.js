/*
 * Copyright (C) 2017 Czech Technical University in Prague
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
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.ReactIntlLocaleData || (g.ReactIntlLocaleData = {})).cs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=[{locale:"cs",pluralRuleFunction:function(e,a){var n=String(e).split("."),t=n[0],o=!n[1];return a?"other":1==e&&o?"one":t>=2&&4>=t&&o?"few":o?"other":"many"},fields:{year:{displayName:"Rok",relative:{0:"tento rok",1:"příští rok","-1":"minulý rok"},relativeTime:{future:{one:"za {0} rok",few:"za {0} roky",many:"za {0} roku",other:"za {0} let"},past:{one:"před {0} rokem",few:"před {0} lety",many:"před {0} rokem",other:"před {0} lety"}}},month:{displayName:"Měsíc",relative:{0:"tento měsíc",1:"příští měsíc","-1":"minulý měsíc"},relativeTime:{future:{one:"za {0} měsíc",few:"za {0} měsíce",many:"za {0} měsíce",other:"za {0} měsíců"},past:{one:"před {0} měsícem",few:"před {0} měsíci",many:"před {0} měsícem",other:"před {0} měsíci"}}},day:{displayName:"Den",relative:{0:"dnes",1:"zítra",2:"pozítří","-1":"včera","-2":"předevčírem"},relativeTime:{future:{one:"za {0} den",few:"za {0} dny",many:"za {0} dne",other:"za {0} dní"},past:{one:"před {0} dnem",few:"před {0} dny",many:"před {0} dnem",other:"před {0} dny"}}},hour:{displayName:"Hodina",relativeTime:{future:{one:"za {0} hodinu",few:"za {0} hodiny",many:"za {0} hodiny",other:"za {0} hodin"},past:{one:"před {0} hodinou",few:"před {0} hodinami",many:"před {0} hodinou",other:"před {0} hodinami"}}},minute:{displayName:"Minuta",relativeTime:{future:{one:"za {0} minutu",few:"za {0} minuty",many:"za {0} minuty",other:"za {0} minut"},past:{one:"před {0} minutou",few:"před {0} minutami",many:"před {0} minutou",other:"před {0} minutami"}}},second:{displayName:"Sekunda",relative:{0:"nyní"},relativeTime:{future:{one:"za {0} sekundu",few:"za {0} sekundy",many:"za {0} sekundy",other:"za {0} sekund"},past:{one:"před {0} sekundou",few:"před {0} sekundami",many:"před {0} sekundou",other:"před {0} sekundami"}}}}},{locale:"cs-CZ",parentLocale:"cs"}],module.exports=exports["default"];
},{}]},{},[1])(1)
});