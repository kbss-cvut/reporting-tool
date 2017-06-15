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
package cz.cvut.kbss.reporting.data.eccairs;

import cz.cvut.kbss.reporting.model.OccurrenceReport;
import org.w3c.dom.Document;

import javax.xml.parsers.ParserConfigurationException;
import java.net.MalformedURLException;

/**
 * Created by Bogdan Kostov on 6/1/2017.
 */
public interface OccurrenceRportE5XExporter {

    Document convert(OccurrenceReport r) throws ParserConfigurationException, MalformedURLException;
}
