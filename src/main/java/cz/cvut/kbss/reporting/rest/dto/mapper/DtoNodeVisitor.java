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

import cz.cvut.kbss.reporting.dto.event.EventDto;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphNodeVisitor;
import cz.cvut.kbss.reporting.model.AbstractEntity;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;

import java.net.URI;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.SplittableRandom;

class DtoNodeVisitor implements FactorGraphNodeVisitor {

    private final Map<URI, EventDto> instanceMap;
    private final Set<URI> temporaryUris = new HashSet<>();

    private final DtoMapper mapper;
    private final SplittableRandom random;

    DtoNodeVisitor(DtoMapper mapper, SplittableRandom random, Map<URI, EventDto> instanceMap) {
        this.mapper = mapper;
        this.random = random;
        this.instanceMap = instanceMap;
    }

    @Override
    public void visit(Occurrence occurrence) {
        if (!instanceMap.containsKey(occurrence.getUri())) {
            instanceMap.put(occurrence.getUri(), mapper.occurrenceToOccurrenceDto(occurrence));
        }
        generateReferenceId(occurrence.getUri());
    }

    private void ensureNonNullUri(AbstractEntity instance) {
        if (instance.getUri() == null) {
            final URI tempUri = URI.create("http://temp" + temporaryUris.size());
            temporaryUris.add(tempUri);
            instance.setUri(tempUri);
        }
    }

    private void generateReferenceId(URI uri) {
        final EventDto dto = instanceMap.get(uri);
        if (dto.getReferenceId() == null) {
            dto.setReferenceId(random.nextInt());
        }
    }

    @Override
    public void visit(Event event) {
        ensureNonNullUri(event);
        if (!instanceMap.containsKey(event.getUri())) {
            instanceMap.put(event.getUri(), mapper.eventToEventDto(event));
        }
        generateReferenceId(event.getUri());
    }


    Map<URI, EventDto> getInstanceMap() {
        return instanceMap;
    }

    Set<URI> getTemporaryUris() {
        return temporaryUris;
    }
}
