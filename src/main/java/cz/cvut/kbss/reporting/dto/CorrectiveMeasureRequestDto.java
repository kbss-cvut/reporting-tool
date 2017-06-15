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
