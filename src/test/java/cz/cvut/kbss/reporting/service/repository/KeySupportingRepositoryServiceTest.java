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
package cz.cvut.kbss.reporting.service.repository;

import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;

public class KeySupportingRepositoryServiceTest extends BaseServiceTestRunner {

    @Autowired
    private RepositoryOccurrenceService occurrenceService;    // This one supports keys

    @Test
    public void testFindByKey() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        occurrenceService.persist(occurrence);

        final Occurrence result = occurrenceService.findByKey(occurrence.getKey());
        assertNotNull(result);
        assertEquals(occurrence.getUri(), result.getUri());
    }

    @Test
    public void findByKeyCallsPostLoad() {
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        final RepositoryOccurrenceService serviceSpy = Mockito.spy(occurrenceService);
        serviceSpy.persist(occurrence);

        final Occurrence result = serviceSpy.findByKey(occurrence.getKey());
        assertNotNull(result);
        verify(serviceSpy).postLoad(any(Occurrence.class));
    }
}
