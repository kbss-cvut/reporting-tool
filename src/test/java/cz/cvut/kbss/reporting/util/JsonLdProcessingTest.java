package cz.cvut.kbss.reporting.util;

import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.exception.JsonProcessingException;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.rest.dto.model.RawJson;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class JsonLdProcessingTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void getOrderedOptionsReadsOptionsFromJsonLdAndReturnsThemOrdered() throws Exception {
        final RawJson json = new RawJson(Environment.loadData("option/reportingPhase.json", String.class));
        final List<URI> expected = Arrays.asList(URI.create("http://onto.fel.cvut.cz/ontologies/inbas-test/first"),
                URI.create("http://onto.fel.cvut.cz/ontologies/inbas-test/second"),
                URI.create("http://onto.fel.cvut.cz/ontologies/inbas-test/third"));
        assertEquals(expected, JsonLdProcessing.getOrderedOptions(json, Vocabulary.s_p_is_higher_than));
    }

    @Test
    public void getOrderedOptionsThrowsProcessingExceptionForInvalidJson() throws Exception {
        final String invalidJson = "This is definitely not a valid JSON.";
        thrown.expect(JsonProcessingException.class);
        thrown.expectMessage("The specified JSON is not valid. JSON: " + invalidJson);
        JsonLdProcessing.getOrderedOptions(new RawJson(invalidJson), Vocabulary.s_p_is_higher_than);
    }

    @Test
    public void getOrderedOptionsThrowsProcessingExceptionWhenJsonCannotBeOrdered() throws Exception {
        final RawJson json = new RawJson(Environment.loadData("data/occurrenceWithSubEvents.json", String.class));
        thrown.expect(JsonProcessingException.class);
        thrown.expectMessage("The specified JSON does not contain options that can be sorted.");
        JsonLdProcessing.getOrderedOptions(json, Vocabulary.s_p_is_higher_than);
    }

    @Test
    public void getItemWithTypeReturnsFirstItemWithTheSpecifiedType() throws Exception {
        final URI expected = URI.create("http://onto.fel.cvut.cz/ontologies/inbas-test/second");

        final RawJson json = new RawJson(Environment.loadData("option/reportingPhase.json", String.class));
        final URI result = JsonLdProcessing.getItemWithType(json, Vocabulary.s_c_default_phase);
        assertEquals(expected, result);
    }

    @Test
    public void getItemWithTypeHandlesItemWithTypeNotAnArray() throws Exception {
        final URI expected = URI.create("http://onto.fel.cvut.cz/ontologies/inbas-test/second");
        final String json = "[{\"@id\": \"" + expected.toString() + "\", \"@type\": \"" + Vocabulary.s_c_default_phase + "\"}]";

        final URI result = JsonLdProcessing.getItemWithType(new RawJson(json), Vocabulary.s_c_default_phase);
        assertEquals(expected, result);
    }

    @Test
    public void getItemWithTypeReturnsNullIfNoMatchingItemIsFound() throws Exception {
        final RawJson json = new RawJson(Environment.loadData("option/reportingPhase.json", String.class));
        // Order property is definitely not it types of any of the items
        assertNull(JsonLdProcessing.getItemWithType(json, Vocabulary.s_p_is_higher_than));
    }

    @Test
    public void getItemWithTypeThrowsProcessingExceptionForInvalidJson() throws Exception {
        final String invalidJson = "This is definitely not a valid JSON.";
        thrown.expect(JsonProcessingException.class);
        thrown.expectMessage("The specified JSON is not valid. JSON: " + invalidJson);
        JsonLdProcessing.getItemWithType(new RawJson(invalidJson), Vocabulary.s_c_default_phase);
    }
}