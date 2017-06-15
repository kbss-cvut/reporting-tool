package cz.cvut.kbss.reporting.rest.dto;

import cz.cvut.kbss.reporting.dto.event.EventDto;
import cz.cvut.kbss.reporting.dto.event.FactorGraph;
import cz.cvut.kbss.reporting.dto.event.FactorGraphEdge;
import cz.cvut.kbss.reporting.dto.event.OccurrenceDto;
import cz.cvut.kbss.reporting.environment.generator.Generator;
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Factor;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.model.util.HasUri;
import cz.cvut.kbss.reporting.rest.dto.mapper.DtoMapper;
import cz.cvut.kbss.reporting.rest.dto.mapper.DtoMapperImpl;
import org.junit.Before;
import org.junit.Test;

import java.net.URI;
import java.util.*;

import static org.junit.Assert.*;

/**
 * These tests verify correct serialization of event (or occurrence) structure serialization.
 * <p>
 * I.e. mainly correct usage of reference ids when serializing graphs with loops.
 */
public class EventFactorsSerializationTest {

    private static final URI HAS_PART_URI = URI.create(Vocabulary.s_p_has_part);
    private static final String NODE_URI_PREFIX = "http://krizik.felk.cvut.cz/node-";

    private DtoMapper dtoMapper;

    @Before
    public void setUp() {
        this.dtoMapper = new DtoMapperImpl();
    }

    @Test
    public void testSerializationOfOccurrenceWithSubEvents() throws Exception {
        final Occurrence occurrence = generateOccurrenceWithSubEvents();
        dtoMapper.occurrenceToOccurrenceDto(occurrence);
        final FactorGraph container = dtoMapper.occurrenceToFactorGraph(occurrence);
        verifyStructure(occurrence, container);
    }

    public static Occurrence generateOccurrenceWithSubEvents() {
        final Occurrence occurrence = occurrence();
        occurrence.setChildren(new HashSet<>());
        final int maxDepth = Generator.randomInt(5);
        for (int i = 0; i < Generator.randomInt(5); i++) {
            occurrence.getChildren().add(generateSubEvents(0, maxDepth));
        }
        return occurrence;
    }

    private static Occurrence occurrence() {
        final Occurrence occurrence = new Occurrence();
        occurrence.setName("Test");
        occurrence.setUri(URI.create(Vocabulary.s_c_Occurrence + "#instance-" + Generator.randomInt()));
        return occurrence;
    }

    private static Event generateSubEvents(int currentDepth, final int maxDepth) {
        final Event evt = event();
        if (currentDepth < maxDepth) {
            evt.setChildren(new HashSet<>());
            currentDepth++;
            for (int i = 0; i < Generator.randomInt(5); i++) {
                evt.getChildren().add(generateSubEvents(currentDepth, maxDepth));
            }
        }
        return evt;
    }

    private static Event event() {
        final Event evt = new Event();
        evt.setUri(URI.create(Vocabulary.s_c_Event + "#instance-" + Generator.randomInt()));
        return evt;
    }

    private void verifyStructure(Occurrence occurrence, FactorGraph graph) {
        final Map<URI, EventDto> instanceMap = new HashMap<>();
        graph.getNodes().forEach(n -> instanceMap.put(n.getUri(), n));
        final Set<URI> visited = new HashSet<>();
        visited.add(occurrence.getUri());

        verifyFactors(occurrence, occurrence.getFactors(), graph, instanceMap, visited);
        if (occurrence.getChildren() != null) {
            occurrence.getChildren().forEach(child -> {
                verifyEdge(instanceMap.get(occurrence.getUri()), instanceMap.get(child.getUri()), HAS_PART_URI, graph);
                verifyStructure(child, graph, instanceMap, visited);
            });
        }
        assertEquals(graph.getNodes().size(), visited.size());
    }

    private void verifyEdge(EventDto start, EventDto end, URI type, FactorGraph graph) {
        final FactorGraphEdge edge = new FactorGraphEdge(null, start.getReferenceId(), end.getReferenceId(), type);
        assertTrue(graph.getEdges().contains(edge));
    }

    private void verifyStructure(Event event, FactorGraph graph, Map<URI, EventDto> instanceMap, Set<URI> visited) {
        if (visited.contains(event.getUri())) {
            return;
        }
        visited.add(event.getUri());
        verifyFactors(event, event.getFactors(), graph, instanceMap, visited);
        if (event.getChildren() != null) {
            event.getChildren().forEach(child -> {
                verifyEdge(instanceMap.get(event.getUri()), instanceMap.get(child.getUri()), HAS_PART_URI, graph);
                verifyStructure(child, graph, instanceMap, visited);
            });
        }
    }

    private void verifyFactors(HasUri target, Set<Factor> factors, FactorGraph graph, Map<URI, EventDto> instanceMap,
                               Set<URI> visited) {
        if (factors == null || factors.isEmpty()) {
            return;
        }
        for (Factor f : factors) {
            assert f.getTypes().size() == 1;
            verifyEdge(instanceMap.get(f.getEvent().getUri()), instanceMap.get(target.getUri()),
                    f.getTypes().iterator().next(), graph);
            verifyStructure(f.getEvent(), graph, instanceMap, visited);
        }
    }

    @Test
    public void testSerializationOfLinksBetweenOccurrenceAndEventsAtSameLevel() throws Exception {
        final Occurrence occurrence = generateOccurrenceWithLinkChainOnSameLevel();
        dtoMapper.occurrenceToOccurrenceDto(occurrence);
        final FactorGraph container = dtoMapper.occurrenceToFactorGraph(occurrence);
        verifyStructure(occurrence, container);
    }

    @Test
    public void serializationMapsFactorUriToEdgeUri() throws Exception {
        final Occurrence occurrence = occurrence();
        final Event e1 = event();
        final Event e2 = event();
        occurrence.addChild(e1);
        occurrence.addChild(e2);
        final Factor factor = new Factor();
        factor.setEvent(e2);
        e1.addFactor(factor);
        factor.addType(Generator.randomFactorType());
        factor.setUri(Generator.generateUri());

        dtoMapper.occurrenceToOccurrenceDto(occurrence);
        final FactorGraph graph = dtoMapper.occurrenceToFactorGraph(occurrence);
        final Optional<FactorGraphEdge> result = graph.getEdges().stream()
                                                      .filter(e -> e.getLinkType()
                                                                    .equals(factor.getTypes().iterator().next()))
                                                      .findAny();
        assertTrue(result.isPresent());
        assertEquals(factor.getUri(), result.get().getUri());
    }

    private Occurrence generateOccurrenceWithLinkChainOnSameLevel() {
        final Occurrence occurrence = occurrence();
        occurrence.setFactors(new HashSet<>());
        final int chainLength = Generator.randomInt(5);
        for (int i = 0; i < Generator.randomInt(5); i++) {
            occurrence.getFactors().add(generateChainItem(0, chainLength));
        }
        return occurrence;
    }

    private Factor generateChainItem(int currentIndex, final int maxIndex) {
        final Factor f = new Factor();
        f.addType(Generator.randomFactorType());
        f.setEvent(event());
        if (currentIndex < maxIndex) {
            f.getEvent().setFactors(new HashSet<>());
            currentIndex++;
            for (int i = 0; i < Generator.randomInt(5); i++) {
                f.getEvent().getFactors().add(generateChainItem(currentIndex, maxIndex));
            }
        }
        return f;
    }

    @Test
    public void testSerializationOfOccurrenceWithSubEventsConnectedByFactors() throws Exception {
        final Occurrence occurrence = generateOccurrenceWithSubEvents();
        addFactorsToStructure(occurrence.getChildren());
        dtoMapper.occurrenceToOccurrenceDto(occurrence);
        final FactorGraph graph = dtoMapper.occurrenceToFactorGraph(occurrence);

        verifyStructure(occurrence, graph);
    }

    private void addFactorsToStructure(Set<Event> siblings) {
        if (siblings.size() >= 2) {
            final List<Event> asList = new ArrayList<>(siblings);
            for (int i = 0; i < Generator.randomInt(asList.size()); i++) {
                final Event from = asList.get(Generator.randomIndex(asList));
                final Event to = asList.get(Generator.randomIndex(asList));
                if (from == to) {
                    continue;
                }
                if (to.getFactors() == null) {
                    to.setFactors(new HashSet<>());
                }
                final Factor f = new Factor();
                f.setEvent(from);
                f.addType(Generator.randomFactorType());
                to.getFactors().add(f);
            }
        }
        siblings.stream().filter(e -> e.getChildren() != null).forEach(e -> addFactorsToStructure(e.getChildren()));
    }

    @Test
    public void testSerializationOfOccurrenceWithFactorsConnectingEventsFromDifferentSubtrees() {
        final Occurrence occurrence = generateOccurrenceWithSubEvents();
        addCrossSubtreeFactors(occurrence.getChildren());
        dtoMapper.occurrenceToOccurrenceDto(occurrence);
        final FactorGraph graph = dtoMapper.occurrenceToFactorGraph(occurrence);
        verifyStructure(occurrence, graph);
    }

    private void addCrossSubtreeFactors(Set<Event> siblings) {
        if (siblings.size() >= 2) {
            final List<Event> asList = new ArrayList<>(siblings);
            final Event e1 = asList.get(Generator.randomIndex(asList));
            final Event e2 = asList.get(Generator.randomIndex(asList));
            if (e1 != e2 && e1.getChildren() != null && e1.getChildren().size() >= 2 && e2.getChildren() != null &&
                    e2.getChildren().size() >= 2) {
                final List<Event> e1Children = new ArrayList<>(e1.getChildren());
                final List<Event> e2Children = new ArrayList<>(e2.getChildren());
                final Event from = e1Children.get(Generator.randomIndex(e1Children));
                final Event to = e2Children.get(Generator.randomIndex(e2Children));
                final Factor f = new Factor();
                f.addType(Generator.randomFactorType());
                f.setEvent(from);
                to.addFactor(f);
            }
        }
        siblings.stream().filter(e -> e.getChildren() != null).forEach(e -> addCrossSubtreeFactors(e.getChildren()));
    }

    @Test
    public void serializationOfEventSiblingsOrdersThemByIndex() {
        final Occurrence occurrence = prepareOccurrenceWithChildren(true);

        dtoMapper.occurrenceToOccurrenceDto(occurrence);
        final FactorGraph result = dtoMapper.occurrenceToFactorGraph(occurrence);
        Integer previousIndex = -1;
        for (EventDto node : result.getNodes()) {
            if (!(node instanceof OccurrenceDto)) {
                assertTrue(node.getIndex() > previousIndex);
                previousIndex = node.getIndex();
            }
        }
        assertEquals(1 + occurrence.getChildren().size(), result.getNodes().size());
    }

    private Occurrence prepareOccurrenceWithChildren(boolean withIndex) {
        final Occurrence occurrence = occurrence();
        final List<Event> events = new ArrayList<>();
        for (int i = 0; i < Generator.randomInt(10); i++) {
            final Event evt = event();
            if (withIndex) {
                evt.setIndex(i);
            }
            events.add(evt);
        }
        // Shuffle before insertion into HashSet to increase chances of non-sequence order
        Collections.shuffle(events);
        occurrence.setChildren(new HashSet<>(events));
        return occurrence;
    }

    @Test
    public void serializationOfEventsWithNullIndexIsLossLess() {
        final Occurrence occurrence = prepareOccurrenceWithChildren(false);
        final int expectedSize = 1 + occurrence.getChildren().size();
        dtoMapper.occurrenceToOccurrenceDto(occurrence);
        final FactorGraph result = dtoMapper.occurrenceToFactorGraph(occurrence);
        assertEquals(expectedSize, result.getNodes().size());
    }

    /**
     * Tree structure:
     * <pre>
     *     {@code
     *           1
     *       2 | 3 | 4
     *     5 6 | 7 | 8 9 10
     *         | 11|
     *     }
     * </pre>
     */
    @Test
    public void testDeserializationOfOccurrenceWithSubEvents() throws Exception {
        final FactorGraph graph = loadGraph("data/occurrenceWithSubEvents.json");
        final Occurrence res = dtoMapper.factorGraphToOccurrence(graph);
        final Map<Integer, Collection<Integer>> expectedChildren = new HashMap<>();
        expectedChildren.put(1, Arrays.asList(2, 3, 4));
        expectedChildren.put(2, Arrays.asList(5, 6));
        expectedChildren.put(3, Collections.singletonList(7));
        expectedChildren.put(4, Arrays.asList(8, 9, 10));
        expectedChildren.put(7, Collections.singletonList(11));
        verifyDeserializedTree(graph, res, expectedChildren);
    }

    private void verifyDeserializedTree(FactorGraph graph, Occurrence o,
                                        Map<Integer, Collection<Integer>> expectedChildren) {
        final Map<URI, EventDto> dtos = new HashMap<>();
        graph.getNodes().forEach(n -> dtos.put(n.getUri(), n));
        verifyChildren(o.getChildren(), expectedChildren.get(dtos.get(o.getUri()).getReferenceId()), dtos);
        o.getChildren().forEach(c -> verifyDeserializedTree(c, expectedChildren, dtos));
    }

    private void verifyChildren(Set<Event> children, Collection<Integer> expectedChildren, Map<URI, EventDto> dtos) {
        assertEquals(expectedChildren.size(), children.size());
        final Map<URI, Event> childMap = new HashMap<>();
        children.forEach(c -> childMap.put(c.getUri(), c));
        for (Integer exp : expectedChildren) {
            assertTrue(childMap.containsKey(URI.create(NODE_URI_PREFIX + exp)));
            final Event e = childMap.get(URI.create(NODE_URI_PREFIX + exp));
            final EventDto dto = dtos.get(e.getUri());
            assertEquals(dto.getEventType(), e.getEventType());
            assertEquals(dto.getUri(), e.getUri());
        }
    }

    private void verifyDeserializedTree(Event e, Map<Integer, Collection<Integer>> expectedChildren,
                                        Map<URI, EventDto> dtos) {
        if (e.getChildren() == null || e.getChildren().isEmpty()) {
            assertNull(expectedChildren.get(dtos.get(e.getUri()).getReferenceId()));
            return;
        }
        verifyChildren(e.getChildren(), expectedChildren.get(dtos.get(e.getUri()).getReferenceId()), dtos);
        e.getChildren().forEach(c -> verifyDeserializedTree(c, expectedChildren, dtos));
    }

    /**
     * Tree structure:
     * <pre>
     *     {@code
     *           1
     *       2 | 3 | 4
     *     5 6 | 7 |
     *     }
     * </pre>
     * Links:
     * <pre>
     * <ul>
     *     <li>2 -> 3, causes</li>
     *     <li>4 -> 3, mitigates</li>
     *     <li>5 -> 7, causes</li>
     * </ul>
     * </pre>
     */
    @Test
    public void testDeserializationOfOccurrenceWithSubEventsWithFactors() throws Exception {
        final FactorGraph graph = loadGraph("data/occurrenceWithSubEventsConnectedByFactors.json");
        final Occurrence res = dtoMapper.factorGraphToOccurrence(graph);
        final Map<Integer, Collection<Integer>> expectedChildren = new HashMap<>();
        expectedChildren.put(1, Arrays.asList(2, 3, 4));
        expectedChildren.put(2, Arrays.asList(5, 6));
        expectedChildren.put(3, Collections.singletonList(7));
        verifyDeserializedTree(graph, res, expectedChildren);
        final Map<URI, FactorGraphItem> factorGraphNodes = flattenFactorGraph(res);
        verifyLinks(graph, factorGraphNodes);
    }

    private Map<URI, FactorGraphItem> flattenFactorGraph(Occurrence root) {
        final Map<URI, FactorGraphItem> visited = new HashMap<>();
        visited.put(root.getUri(), root);
        if (root.getChildren() != null) {
            root.getChildren().forEach(child -> traverseGraph(child, visited));
        }
        if (root.getFactors() != null) {
            root.getFactors().forEach(f -> traverseGraph(f.getEvent(), visited));
        }
        return visited;
    }

    private void traverseGraph(Event event, Map<URI, FactorGraphItem> visited) {
        if (visited.containsKey(event.getUri())) {
            return;
        }
        visited.put(event.getUri(), event);
        if (event.getChildren() != null) {
            event.getChildren().forEach(child -> traverseGraph(child, visited));
        }
        if (event.getFactors() != null) {
            event.getFactors().forEach(f -> traverseGraph(f.getEvent(), visited));
        }
    }

    private void verifyLinks(FactorGraph graph, Map<URI, FactorGraphItem> flattenedGraph) {
        final Map<Integer, URI> referenceToUri = new HashMap<>();
        graph.getNodes().forEach(dto -> referenceToUri.put(dto.getReferenceId(), dto.getUri()));
        for (FactorGraphEdge edge : graph.getEdges()) {
            if (edge.getLinkType().equals(HAS_PART_URI)) {
                // hasPart edges are checked in structure verification above
                continue;
            }
            final FactorGraphItem source = flattenedGraph.get(referenceToUri.get(edge.getFrom()));
            final FactorGraphItem target = flattenedGraph.get(referenceToUri.get(edge.getTo()));
            assertNotNull(target);
            final Optional<Factor> factor = target.getFactors().stream().filter(f ->
                    f.getTypes().contains(edge.getLinkType()) &&
                            f.getEvent().getUri().equals(source.getUri())).findFirst();
            assertTrue(factor.isPresent());
        }
    }

    @Test
    public void testDeserializationOfOccurrenceWithFactorsAtSameLevel() throws Exception {
        final FactorGraph graph = loadGraph("data/occurrenceWithFactorsAtSameLevel.json");
        final Occurrence res = dtoMapper.factorGraphToOccurrence(graph);
        final Map<Integer, Collection<Integer>> expectedChildren = new HashMap<>();
        expectedChildren.put(1, Collections.singletonList(8));
        expectedChildren.put(2, Arrays.asList(3, 4));
        expectedChildren.put(5, Arrays.asList(6, 7));
        verifyDeserializedTree(graph, res, expectedChildren);
        final Map<URI, FactorGraphItem> factorGraphNodes = flattenFactorGraph(res);
        verifyLinks(graph, factorGraphNodes);
    }

    private FactorGraph loadGraph(String fileName) throws Exception {
        return Environment.loadData(fileName, FactorGraph.class);
    }

    @Test
    public void deserializationCreatesFactorsWithExistingUri() throws Exception {
        final FactorGraph graph = loadGraph("data/occurrenceWithFactorsAtSameLevel.json");
        graph.getEdges().stream().filter(e -> !e.getLinkType().equals(HAS_PART_URI))
             .forEach(e -> e.setUri(Generator.generateUri()));
        final Occurrence res = dtoMapper.factorGraphToOccurrence(graph);
        assertEquals(2, res.getFactors().size());
        for (Factor f : res.getFactors()) {
            final Optional<FactorGraphEdge> edge = graph.getEdges().stream().filter(e ->
                    e.getFrom().equals(f.getEvent().getReferenceId()) && f.getTypes().contains(e.getLinkType()))
                                                        .findAny();
            assertTrue(edge.isPresent());
            assertEquals(edge.get().getUri(), f.getUri());
        }
    }
}
