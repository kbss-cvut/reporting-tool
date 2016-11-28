package cz.cvut.kbss.reporting.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.cvut.kbss.reporting.exception.JsonProcessingException;
import cz.cvut.kbss.reporting.rest.dto.model.RawJson;

import java.io.IOException;
import java.net.URI;
import java.util.*;

public class JsonLdProcessing {

    private static final String ID_PROPERTY = "@id";
    private static final String TYPE_PROPERTY = "@type";

    private JsonLdProcessing() {
        throw new AssertionError();
    }

    /**
     * Parses the specified JSON-LD, expecting it to represent a set of sortable options, and returns the URIs of the
     * options, ordered based on the {@code greaterThanProperty}.
     * <p>
     * It is expected that there is no absolute order of the options, the ordering is relative, i.e. each option only
     * specifies its predecessor (if any).
     * <p>
     * In general, the input is expected to be of the form:
     * <p>
     * <pre>
     * {@literal [
     *  {
     *      "@id": "some-id-1",
     *      "greaterThanProperty": [
     *          "some-id-2"
     *      ]
     *  }, {
     *      "@id": "some-id-2"
     *  }]
     *  }
     * </pre>
     *
     * @param json                The JSON-LD to process
     * @param greaterThanProperty Property used for ordering
     * @return Ordered list of options
     */
    public static List<URI> getOrderedOptions(RawJson json, String greaterThanProperty) {
        Objects.requireNonNull(json);
        Objects.requireNonNull(greaterThanProperty);
        try {
            return readAndOrderElements(json, greaterThanProperty);
        } catch (IOException e) {
            throw JsonProcessingException.createForInvalid(json.getValue(), e);
        }
    }

    private static List<URI> readAndOrderElements(RawJson json, String greaterThanProperty) throws IOException {
        final ObjectMapper objectMapper = new ObjectMapper();
        final List<URI[]> lst = new ArrayList<>();
        final JsonNode root = objectMapper.readTree(json.getValue());
        if (root == null) {
            return Collections.emptyList();
        }
        Iterator<JsonNode> elements = root.elements();
        while (elements.hasNext()) {
            final JsonNode n = elements.next();
            final URI id = URI.create(n.path(ID_PROPERTY).asText());
            final JsonNode gt = n.path(greaterThanProperty);
            URI gtNode = null;
            if (!gt.isMissingNode()) {
                gtNode = URI.create(gt.elements().next().path(ID_PROPERTY).asText());
            }
            lst.add(new URI[]{id, gtNode});
        }
        return sortElements(lst);
    }

    private static List<URI> sortElements(List<URI[]> elements) {
        final List<URI> res = new ArrayList<>();
        int runs = 0;
        while (res.size() < elements.size()) {
            if (runs > elements.size()) {
                throw new JsonProcessingException("The specified JSON does not contain options that can be sorted.");
            }
            for (URI[] el : elements) {
                // Either the result is empty and we are looking for the lowest one
                // Or we take the one whose predecessor is currently last in the result list
                if ((res.isEmpty() && el[1] == null) || (!res.isEmpty() && res.get(res.size() - 1).equals(el[1]))) {
                    res.add(el[0]);
                    break;
                }
            }
            runs++;
        }
        return res;
    }

    /**
     * Gets the first item with the specified type.
     *
     * @param json The JSON-LD to process
     * @param type The type to look for
     * @return ID of the first item with the specified type, or {@code null} if no such item is found
     */
    public static URI getItemWithType(RawJson json, String type) {
        Objects.requireNonNull(json);
        Objects.requireNonNull(type);
        try {
            return getItemWithTypeImpl(json.getValue(), type);
        } catch (IOException e) {
            throw JsonProcessingException.createForInvalid(json.getValue(), e);
        }
    }

    private static URI getItemWithTypeImpl(String json, String type) throws IOException {
        final ObjectMapper objectMapper = new ObjectMapper();
        final JsonNode root = objectMapper.readTree(json);
        if (root == null) {
            return null;
        }
        Iterator<JsonNode> elements = root.elements();
        while (elements.hasNext()) {
            final JsonNode n = elements.next();
            final URI id = URI.create(n.path(ID_PROPERTY).asText());
            final JsonNode typesNode = n.path(TYPE_PROPERTY);
            if (typesNode.isMissingNode()) {
                continue;
            }
            final Set<String> types = getItemTypes(typesNode);
            if (types.contains(type)) {
                return id;
            }
        }
        return null;
    }

    private static Set<String> getItemTypes(JsonNode typesNode) {
        final Set<String> types = new HashSet<>();
        if (typesNode.isValueNode()) {
            types.add(typesNode.asText());
        } else if (typesNode.isArray()) {
            final Iterator<JsonNode> nodes = typesNode.elements();
            while (nodes.hasNext()) {
                types.add(nodes.next().asText());
            }
        }
        return types;
    }
}
