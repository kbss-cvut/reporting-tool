package cz.cvut.kbss.reporting.rest.dto.mapper;

import cz.cvut.kbss.reporting.config.RestConfig;
import cz.cvut.kbss.reporting.dto.CorrectiveMeasureRequestDto;
import cz.cvut.kbss.reporting.dto.OccurrenceReportDto;
import cz.cvut.kbss.reporting.dto.agent.AgentDto;
import cz.cvut.kbss.reporting.dto.agent.OrganizationDto;
import cz.cvut.kbss.reporting.dto.agent.PersonDto;
import cz.cvut.kbss.reporting.dto.event.EventDto;
import cz.cvut.kbss.reporting.dto.event.FactorGraphEdge;
import cz.cvut.kbss.reporting.dto.event.OccurrenceDto;
import cz.cvut.kbss.reporting.environment.config.MockServiceConfig;
import cz.cvut.kbss.reporting.environment.config.MockSesamePersistence;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.generator.OccurrenceReportGenerator;
import cz.cvut.kbss.reporting.model.*;
import cz.cvut.kbss.reporting.model.util.HasUri;
import cz.cvut.kbss.reporting.model.util.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.util.Constants;
import cz.cvut.kbss.reporting.util.IdentificationUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.net.URI;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {RestConfig.class, MockServiceConfig.class, MockSesamePersistence.class})
public class DtoMapperTest {

    @Autowired
    private DtoMapper mapper;

    @Test
    public void correctiveMeasureRequestToDtoCopiesBasicAttributes() {
        final CorrectiveMeasureRequest req = generateCorrectiveMeasureRequestWithResponsibleAgents();
        final CorrectiveMeasureRequestDto dto = mapper.correctiveMeasureRequestToDto(req);
        assertNotNull(dto);
        assertEquals(req.getUri(), dto.getUri());
        assertEquals(req.getDescription(), dto.getDescription());
    }

    @Test
    public void correctiveMeasureRequestToDtoTransformsPersonsAndOrganizationsToPolymorphicAgentDtos() {
        final CorrectiveMeasureRequest req = generateCorrectiveMeasureRequestWithResponsibleAgents();
        final CorrectiveMeasureRequestDto dto = mapper.correctiveMeasureRequestToDto(req);
        assertNotNull(dto);
        verifyAgentsCorrespondToOrganizationsAndPersons(req, dto);
    }

    private void verifyAgentsCorrespondToOrganizationsAndPersons(CorrectiveMeasureRequest req,
                                                                 CorrectiveMeasureRequestDto dto) {
        assertEquals(req.getResponsibleOrganizations().size() + req.getResponsiblePersons().size(),
                dto.getResponsibleAgents().size());
        final Map<URI, HasUri> origAgents = new HashMap<>();
        req.getResponsiblePersons().forEach(p -> origAgents.put(p.getUri(), p));
        req.getResponsibleOrganizations().forEach(o -> origAgents.put(o.getUri(), o));
        for (AgentDto agent : dto.getResponsibleAgents()) {
            assertTrue(origAgents.containsKey(agent.getUri()));
            final HasUri orig = origAgents.get(agent.getUri());
            if (orig instanceof Person) {
                final Person p = (Person) orig;
                assertTrue(agent instanceof PersonDto);
                final PersonDto pDto = (PersonDto) agent;
                assertEquals(p.getFirstName(), pDto.getFirstName());
                assertEquals(p.getLastName(), pDto.getLastName());
                assertEquals(p.getUsername(), pDto.getUsername());
            } else {
                final Organization o = (Organization) orig;
                assertTrue(agent instanceof OrganizationDto);
                final OrganizationDto oDto = (OrganizationDto) agent;
                assertEquals(o.getName(), oDto.getName());
            }
        }
    }

    private CorrectiveMeasureRequest generateCorrectiveMeasureRequestWithResponsibleAgents() {
        final CorrectiveMeasureRequest request = generateCorrectiveMeasureRequest();
        final Set<Person> persons = new HashSet<>();
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final Person p = new Person();
            p.setFirstName("FirstName" + i);
            p.setLastName("LastName" + i);
            p.setUsername("firstname-" + i + "@inbas.cz");
            p.setPassword("bflmpsvz");
            p.generateUri();
            persons.add(p);
        }
        request.setResponsiblePersons(persons);
        final Set<Organization> organizations = new HashSet<>();
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final Organization org = new Organization();
            org.setName("Knowledge Based Software Systems Division " + i);
            org.generateUri();
            organizations.add(org);
        }
        request.setResponsibleOrganizations(organizations);
        return request;
    }

    private CorrectiveMeasureRequest generateCorrectiveMeasureRequest() {
        final CorrectiveMeasureRequest request = new CorrectiveMeasureRequest();
        request.setUri(URI.create(Vocabulary.s_c_corrective_measure_request + "#req"));
        request.setDescription("Sample corrective measure.");
        return request;
    }

    @Test
    public void correctiveMeasureRequestToDtoTransformsEventToEventDto() {
        final CorrectiveMeasureRequest req = generateCorrectiveMeasureRequestBasedOnEvent();
        final CorrectiveMeasureRequestDto dto = mapper.correctiveMeasureRequestToDto(req);
        assertNotNull(dto);
        assertNotNull(dto.getBasedOn());
        final EventDto eventDto = dto.getBasedOn();
        assertEquals(req.getBasedOnEvent().getUri(), eventDto.getUri());
        assertEquals(req.getBasedOnEvent().getEventType(), eventDto.getEventType());
    }

    private CorrectiveMeasureRequest generateCorrectiveMeasureRequestBasedOnEvent() {
        final CorrectiveMeasureRequest req = generateCorrectiveMeasureRequest();
        final Event event = new Event();
        event.setUri(URI.create(Vocabulary.s_c_Event + "#instance"));
        event.setEventType(Generator.generateEventType());
        req.setBasedOnEvent(event);
        return req;
    }

    @Test
    public void correctiveMeasureRequestToDtoTransformsOccurrenceToPolymorphicOccurrenceDto() {
        final CorrectiveMeasureRequest req = generateCorrectiveMeasureRequestBasedOnOccurrence();
        final CorrectiveMeasureRequestDto dto = mapper.correctiveMeasureRequestToDto(req);
        assertNotNull(dto);
        assertNotNull(dto.getBasedOn());
        assertTrue(dto.getBasedOn() instanceof OccurrenceDto);
        final OccurrenceDto occurrenceDto = (OccurrenceDto) dto.getBasedOn();
        assertEquals(req.getBasedOnOccurrence().getUri(), occurrenceDto.getUri());
        assertEquals(req.getBasedOnOccurrence().getName(), occurrenceDto.getName());
        assertEquals(req.getBasedOnOccurrence().getKey(), occurrenceDto.getKey());
    }

    private CorrectiveMeasureRequest generateCorrectiveMeasureRequestBasedOnOccurrence() {
        final CorrectiveMeasureRequest req = generateCorrectiveMeasureRequest();
        final Occurrence occurrence = OccurrenceReportGenerator.generateOccurrence();
        occurrence.setKey(IdentificationUtils.generateKey());
        occurrence.setUri(URI.create(Vocabulary.s_c_Occurrence + "#instance"));
        req.setBasedOnOccurrence(occurrence);
        return req;
    }

    @Test
    public void correctiveMeasureRequestToDtoReturnsNullForNullArgument() {
        assertNull(mapper.correctiveMeasureRequestToDto(null));
    }

    @Test
    public void dtoToCorrectiveMeasureRequestCopiesBasicAttributes() {
        final CorrectiveMeasureRequestDto dto = generateCorrectiveMeasureRequestDto();
        final CorrectiveMeasureRequest req = mapper.dtoToCorrectiveMeasureRequest(dto);
        assertNotNull(req);
        assertEquals(dto.getUri(), req.getUri());
        assertEquals(dto.getDescription(), req.getDescription());
    }

    private CorrectiveMeasureRequestDto generateCorrectiveMeasureRequestDto() {
        final CorrectiveMeasureRequestDto dto = new CorrectiveMeasureRequestDto();
        dto.setUri(URI.create(Vocabulary.s_c_corrective_measure_request + "#req"));
        dto.setDescription("Sample corrective measure.");
        return dto;
    }

    @Test
    public void dtoToCorrectiveMeasureRequestTransformsAgentsToPersonsAndOrganizations() {
        final CorrectiveMeasureRequestDto dto = generateCorrectiveMeasureRequestDtoWithAgents();
        final CorrectiveMeasureRequest req = mapper.dtoToCorrectiveMeasureRequest(dto);
        assertNotNull(req);
        verifyAgentsCorrespondToOrganizationsAndPersons(req, dto);
    }

    private CorrectiveMeasureRequestDto generateCorrectiveMeasureRequestDtoWithAgents() {
        final CorrectiveMeasureRequestDto dto = generateCorrectiveMeasureRequestDto();
        final Set<AgentDto> agents = new HashSet<>();
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final PersonDto p = new PersonDto();
            p.setFirstName("FirstName" + i);
            p.setLastName("LastName" + i);
            p.setUsername("firstname-" + i + "@inbas.cz");
            p.setUri(URI.create(Constants.PERSON_BASE_URI + p.getFirstName() + "+" + p.getLastName()));
            agents.add(p);
        }
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final OrganizationDto o = new OrganizationDto();
            o.setName("Knowledge Based Software Systems Division " + i);
            o.setUri(URI.create(Constants.ORGANIZATION_BASE_URI + "KBSS" + i));
            agents.add(o);
        }
        dto.setResponsibleAgents(agents);
        return dto;
    }

    @Test
    public void dtoToCorrectiveMeasureRequestTransformsEventDtoToEvent() {
        final CorrectiveMeasureRequestDto dto = generateCorrectiveMeasureRequestDtoBasedOnEvent();
        final CorrectiveMeasureRequest req = mapper.dtoToCorrectiveMeasureRequest(dto);
        assertNotNull(req);
        assertNotNull(req.getBasedOnEvent());
        assertNull(req.getBasedOnOccurrence());
        assertEquals(dto.getBasedOn().getUri(), req.getBasedOnEvent().getUri());
        assertEquals(dto.getBasedOn().getEventType(), req.getBasedOnEvent().getEventType());
    }

    private CorrectiveMeasureRequestDto generateCorrectiveMeasureRequestDtoBasedOnEvent() {
        final CorrectiveMeasureRequestDto dto = generateCorrectiveMeasureRequestDto();
        final EventDto eventDto = new EventDto();
        eventDto.setEventType(Generator.generateEventType());
        eventDto.setUri(URI.create(Vocabulary.s_c_Event + "#instance"));
        dto.setBasedOn(eventDto);
        return dto;
    }

    @Test
    public void dtoToCorrectiveMeasureRequestTransformsOccurrenceDtoToOccurrence() {
        final CorrectiveMeasureRequestDto dto = generateCorrectiveMeasureRequestDtoBasedOnOccurrence();
        final CorrectiveMeasureRequest req = mapper.dtoToCorrectiveMeasureRequest(dto);
        assertNotNull(req);
        assertNotNull(req.getBasedOnOccurrence());
        assertNull(req.getBasedOnEvent());
        final OccurrenceDto oDto = (OccurrenceDto) dto.getBasedOn();
        assertEquals(oDto.getUri(), req.getBasedOnOccurrence().getUri());
        assertEquals(oDto.getName(), req.getBasedOnOccurrence().getName());
        assertEquals(oDto.getKey(), req.getBasedOnOccurrence().getKey());
    }

    private CorrectiveMeasureRequestDto generateCorrectiveMeasureRequestDtoBasedOnOccurrence() {
        final CorrectiveMeasureRequestDto dto = generateCorrectiveMeasureRequestDto();
        final OccurrenceDto occurrenceDto = new OccurrenceDto();
        occurrenceDto.setUri(URI.create(Vocabulary.s_c_Occurrence + "#instance"));
        occurrenceDto.setKey(IdentificationUtils.generateKey());
        occurrenceDto.setName("Some occurrence");
        occurrenceDto.setEventType(Generator.generateEventType());
        dto.setBasedOn(occurrenceDto);
        return dto;
    }

    @Test
    public void dtoToCorrectiveMeasureRequestReturnsNullForNullArgument() {
        assertNull(mapper.dtoToCorrectiveMeasureRequest(null));
    }

    @Test
    public void reportToReportDtoTransformsOccurrenceReportToOccurrenceReportDto() {
        final OccurrenceReport report = OccurrenceReportGenerator.generateOccurrenceReport(true);
        report.setCorrectiveMeasures(OccurrenceReportGenerator.generateCorrectiveMeasureRequests());
        final LogicalDocument dto = mapper.reportToReportDto(report);
        assertNotNull(dto);
        assertTrue(dto instanceof OccurrenceReportDto);
        final OccurrenceReportDto orDto = (OccurrenceReportDto) dto;
        assertEquals(report.getCorrectiveMeasures().size(), orDto.getCorrectiveMeasures().size());
        assertEquals(report.getUri(), orDto.getUri());
        assertEquals(report.getKey(), orDto.getKey());
        assertEquals(report.getFileNumber(), orDto.getFileNumber());
    }

    @Test
    public void reportDtoToReportTransformsOccurrenceReportDtoToOccurrenceReport() {
        final OccurrenceReportDto dto = generateOccurrenceReportDto();
        final LogicalDocument doc = mapper.reportDtoToReport(dto);
        assertNotNull(doc);
        assertTrue(doc instanceof OccurrenceReport);
        final OccurrenceReport report = (OccurrenceReport) doc;

        assertEquals(dto.getCorrectiveMeasures().size(), report.getCorrectiveMeasures().size());
    }

    private OccurrenceReportDto generateOccurrenceReportDto() {
        final OccurrenceReportDto dto = new OccurrenceReportDto();
        dto.setSummary("Occurrence report summary.");
        dto.setCorrectiveMeasures(new HashSet<>());
        dto.getCorrectiveMeasures().add(generateCorrectiveMeasureRequestDtoBasedOnEvent());
        dto.getCorrectiveMeasures().add(generateCorrectiveMeasureRequestDtoBasedOnOccurrence());
        dto.getCorrectiveMeasures().add(generateCorrectiveMeasureRequestDtoWithAgents());
        return dto;
    }

    @Test
    public void occurrenceToOccurrenceDtoReturnsNullForNullArgument() {
        assertNull(mapper.occurrenceToOccurrenceDto(null));
    }

    @Test
    public void occurrenceToFactorGraphReturnsNullForNullArgument() {
        assertNull(mapper.occurrenceToFactorGraph(null));
    }

    @Test
    public void reportToReportDtoReturnsNullForNullArgument() {
        assertNull(mapper.reportToReportDto(null));
    }

    @Test
    public void reportDtoToReportReturnsNullForNullArgument() {
        assertNull(mapper.reportDtoToReport(null));
    }

    @Test
    public void canMapReturnsTrueForMappableClasses() {
        assertTrue(mapper.canMap(Occurrence.class));
        assertTrue(mapper.canMap(OccurrenceReport.class));
        assertTrue(mapper.canMap(Event.class));
        assertTrue(mapper.canMap(OccurrenceReportDto.class));
        assertTrue(mapper.canMap(EventDto.class));
    }

    @Test
    public void canMapReturnsFalseForNonMappableClasses() {
        assertFalse(mapper.canMap(String.class));
        assertFalse(mapper.canMap(FactorGraphEdge.class));
        assertFalse(mapper.canMap(FactorGraphItem.class));
    }
}