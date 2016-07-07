package cz.cvut.kbss.reporting.service.options;

import cz.cvut.kbss.reporting.environment.util.TestUtils;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.net.URI;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ReportingPhaseServiceTest extends BaseServiceTestRunner {

    private static final List<URI> PHASES = Arrays
            .asList(URI.create("http://onto.fel.cvut.cz/ontologies/inbas-test/first"),
                    URI.create("http://onto.fel.cvut.cz/ontologies/inbas-test/second"),
                    URI.create("http://onto.fel.cvut.cz/ontologies/inbas-test/third"));

    @Autowired
    private ReportingPhaseService service;

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void getInitialPhaseReturnsFirstReportingPhase() {
        final URI initialPhase = PHASES.get(0);
        assertEquals(initialPhase, service.getInitialPhase());
    }

    @Test
    public void getInitialPhaseThrowsIllegalStateWhenNoPhasesWereLoaded() throws Exception {
        final Field phasesField = ReportingPhaseService.class.getDeclaredField("phases");
        phasesField.setAccessible(true);
        final List<?> lst = (List<?>) phasesField.get(service);
        lst.clear();
        thrown.expect(IllegalStateException.class);
        thrown.expectMessage("No reporting phases have been found.");
        service.getInitialPhase();
    }

    @Test
    public void nextPhaseGetsNextPhaseForPhases() throws Exception {
        for (int i = 0; i < PHASES.size() - 1; i++) {   // Leaving the last phase for a separate test
            assertEquals(PHASES.get(i + 1), service.nextPhase(PHASES.get(i)));
        }
    }

    @Test
    public void nextPhaseGetsTheSamePhaseForTheLastPhase() {
        final URI lastPhase = PHASES.get(PHASES.size() - 1);
        assertEquals(lastPhase, service.nextPhase(lastPhase));
    }

    @Test
    public void nextPhaseReturnsNullForNullPhase() {
        assertNull(service.nextPhase(null));
    }

    @Test
    public void nextPhaseThrowsIllegalArgumentForUnknownPhase() {
        final String unsupportedPhase = "http://unsupportedPhase";
        thrown.expect(IllegalArgumentException.class);
        thrown.expectMessage("Unsupported reporting phase " + unsupportedPhase);
        service.nextPhase(URI.create(unsupportedPhase));
    }

    @Test
    public void getDefaultPhaseReturnsDefaultReportPhase() {
        final URI expected = URI.create("http://onto.fel.cvut.cz/ontologies/inbas-test/second");
        assertEquals(expected, service.getDefaultPhase());
    }

    @Test
    public void initializationHandlesSituationWhenNoPhasesAreAvailable() throws Exception {
        final OptionsService optionsServiceMock = mock(OptionsService.class);
        when(optionsServiceMock.getOptions(ReportingPhaseService.PHASE_OPTION_TYPE))
                .thenThrow(new IllegalArgumentException("Unsupported option."));
        final ReportingPhaseService service = new ReportingPhaseService();
        TestUtils.setFieldValue(ReportingPhaseService.class.getDeclaredField("optionsService"), service,
                optionsServiceMock);

        final Method loadPhases = ReportingPhaseService.class.getDeclaredMethod("loadPhases");
        loadPhases.setAccessible(true);
        loadPhases.invoke(service);
        assertNull(service.getDefaultPhase());
        final Field phasesField = ReportingPhaseService.class.getDeclaredField("phases");
        phasesField.setAccessible(true);
        final List<?> phases = (List) phasesField.get(service);
        assertTrue(phases.isEmpty());
    }
}