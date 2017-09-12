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
'use strict';

/**
 * Ontological vocabulary used by JSON-LD responses we get.
 */
module.exports = {
    RDFS_LABEL: 'http://www.w3.org/2000/01/rdf-schema#label',
    RDFS_COMMENT: 'http://www.w3.org/2000/01/rdf-schema#comment',

    OCCURRENCE_REPORT: 'http://onto.fel.cvut.cz/ontologies/documentation/occurrence_report',

    HAS_PART: 'http://onto.fel.cvut.cz/ontologies/ufo/has_part',
    TRANSITION_LABEL: 'http://onto.fel.cvut.cz/ontologies/documentation/transition_label',
    SUGGESTED: "http://onto.fel.cvut.cz/ontologies/reporting-tool/model/suggested-by-text-analysis",

    ROLE_ADMIN: 'http://onto.fel.cvut.cz/ontologies/reporting-tool/model/admin'
};
