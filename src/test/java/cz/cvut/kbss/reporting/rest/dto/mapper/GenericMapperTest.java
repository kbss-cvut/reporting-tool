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
package cz.cvut.kbss.reporting.rest.dto.mapper;

import cz.cvut.kbss.reporting.config.RestConfig;
import cz.cvut.kbss.reporting.dto.OccurrenceReportDto;
import cz.cvut.kbss.reporting.environment.config.MockServiceConfig;
import cz.cvut.kbss.reporting.environment.config.MockSesamePersistence;
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.model.Agent;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.net.URI;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {RestConfig.class, MockServiceConfig.class, MockSesamePersistence.class})
public class GenericMapperTest {

    @Autowired
    private GenericMapper mapper;

    @Test
    public void mapMapsOccurrenceReportDtoToOccurrenceReport() throws Exception {
        final OccurrenceReportDto dto = Environment
                .loadData("data/occurrenceReportWithFactorGraph.json", OccurrenceReportDto.class);
        final Object result = mapper.map(dto);
        assertNotNull(result);
        assertTrue(result instanceof OccurrenceReport);
    }

    @Test
    public void mapReturnsTheSameInstanceIfItCannotBeMapped() {
        final Agent agent = new Agent();
        agent.setUri(URI.create("http://agent007"));
        final Object result = mapper.map(agent);
        assertSame(agent, result);
    }

    @Test
    public void mapReturnsNullForNullArgument() {
        assertNull(mapper.map(null));
    }
}