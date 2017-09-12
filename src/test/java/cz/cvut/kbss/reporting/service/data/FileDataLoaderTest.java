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
package cz.cvut.kbss.reporting.service.data;

import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.Collections;

import static org.junit.Assert.assertEquals;

public class FileDataLoaderTest extends BaseServiceTestRunner {

    @Autowired
    @Qualifier("localDataLoader")
    private DataLoader loader;

    @Test
    public void loadDataLoadsDataFromLocalFile() throws Exception {
        final String file = "data/occurrenceWithSubEvents.json";
        final String expectedData = Environment.loadData(file, String.class);
        final String result = loader.loadData(file, Collections.emptyMap());
        assertEquals(expectedData, result);
    }

    @Test(expected = IllegalArgumentException.class)
    public void loadDataThrowsIllegalArgumentForUnknownFile() throws Exception {
        loader.loadData("unknown/file.txt", Collections.emptyMap());
    }
}