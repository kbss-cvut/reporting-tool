package cz.cvut.kbss.reporting.dto;

import cz.cvut.kbss.reporting.dto.agent.AgentDto;
import cz.cvut.kbss.reporting.dto.event.EventDto;

import java.net.URI;
import java.util.Set;

public class CorrectiveMeasureRequestDto {

    private URI uri;

    private String description;

    private Set<AgentDto> responsibleAgents;

    private EventDto basedOn;

    public URI getUri() {
        return uri;
    }

    public void setUri(URI uri) {
        this.uri = uri;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<AgentDto> getResponsibleAgents() {
        return responsibleAgents;
    }

    public void setResponsibleAgents(Set<AgentDto> responsibleAgents) {
        this.responsibleAgents = responsibleAgents;
    }

    public EventDto getBasedOn() {
        return basedOn;
    }

    public void setBasedOn(EventDto basedOn) {
        this.basedOn = basedOn;
    }
}
