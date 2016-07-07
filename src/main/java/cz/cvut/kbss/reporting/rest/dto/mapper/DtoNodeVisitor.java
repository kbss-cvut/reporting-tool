package cz.cvut.kbss.reporting.rest.dto.mapper;

import cz.cvut.kbss.reporting.dto.event.EventDto;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphNodeVisitor;

import java.net.URI;
import java.util.Map;
import java.util.SplittableRandom;

class DtoNodeVisitor implements FactorGraphNodeVisitor {

    private final Map<URI, EventDto> instanceMap;

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

    private void generateReferenceId(URI uri) {
        final EventDto dto = instanceMap.get(uri);
        if (dto.getReferenceId() == null) {
            dto.setReferenceId(random.nextInt());
        }
    }

    @Override
    public void visit(Event event) {
        if (!instanceMap.containsKey(event.getUri())) {
            instanceMap.put(event.getUri(), mapper.eventToEventDto(event));
        }
        generateReferenceId(event.getUri());
    }


    Map<URI, EventDto> getInstanceMap() {
        return instanceMap;
    }
}
