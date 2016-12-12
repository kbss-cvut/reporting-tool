/**
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
package cz.cvut.kbss.reporting.dto.reportlist;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Works around Java type erasure and the problems it causes to JSON serialization.
 */
public class ReportList extends ArrayList<ReportDto> {

    public ReportList() {
    }

    public ReportList(Collection<? extends ReportDto> c) {
        super(c);
    }
}
