/**
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
package cz.cvut.kbss.reporting.rest.dto.model;

import cz.cvut.kbss.reporting.dto.OccurrenceReportDto;

import java.util.ArrayList;

/**
 * DTO for OccurrenceReport list serialization.
 * <p>
 * This is because Jackson is not able to write/determine polymorphic types in collection.
 * <p>
 * See <a href="https://github.com/FasterXML/jackson-databind/issues/336">https://github.com/FasterXML/jackson-databind/issues/336
 * </a> for more details.
 */
public class OccurrenceReportDtoList extends ArrayList<OccurrenceReportDto> {

    public OccurrenceReportDtoList() {
    }

    public OccurrenceReportDtoList(int initialCapacity) {
        super(initialCapacity);
    }
}
