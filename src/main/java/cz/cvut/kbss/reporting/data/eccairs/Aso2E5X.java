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
package cz.cvut.kbss.reporting.data.eccairs;

import cz.cvut.kbss.reporting.factorgraph.FactorGraphNodeVisitor;
import cz.cvut.kbss.reporting.factorgraph.traversal.DefaultFactorGraphTraverser;
import cz.cvut.kbss.reporting.model.AbstractEvent;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.qam.Question;
import cz.cvut.kbss.reporting.util.DetectHtml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.validation.Schema;
import java.net.URI;
import java.util.*;
import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

//import org.omg.PortableServer.POAPackage.AdapterAlreadyExistsHelper;


/**
 * Transform an OccurrenceReport into a e5x document.
 *
 * @author Bogdan Kostov <bogdan.kostov@fel.cvut.cz>
 * @implNote Generates dom elements. Notes on the generation of e5x output - attributes should be placed in the correct
 * order. e.g. First is Local_Date followed by UTC_Date followed by Headline
 */
public class Aso2E5X extends AbstractOccurrenceReportE5XExporter {

    private static final Logger LOG = LoggerFactory.getLogger(Aso2E5X.class);

    public Aso2E5X(Schema schema) {
        super(schema);
    }

    protected Document convertImpl(OccurrenceReport occurrenceReport) {
        Element root = createSET(occurrenceReport);
        elementCreateOccurrence(root, occurrenceReport);
        return getDocument();
    }

    protected Element createSET(OccurrenceReport r) {
        Element set = createElement(E5XXmlElement.SET);
        //TaxonomyName="ECCAIRS Aviation" TaxonomyVersion="3.4.0.2" Domain="RIT" Version="1.0.0.0"
//        set.setAttributeNS(E5XTerms.dataBridgeNS,"TaxonomyName", "ECCAIRS Aviation");
//        set.setAttributeNS(E5XTerms.dataBridgeNS,"TaxonomyVersion", "3.4.0.2");
//        set.setAttributeNS(E5XTerms.dataBridgeNS,"Domain", "RIT");
//        set.setAttributeNS(E5XTerms.dataBridgeNS,"Version", "1.0.0.0");
        set.setAttribute("TaxonomyName", "ECCAIRS Aviation");
        set.setAttribute("TaxonomyVersion", "3.4.0.2");
        set.setAttribute("Domain", "RIT");
        set.setAttribute("Version", "1.0.0.0");
        getDocument().appendChild(set);
        return set;
    }

    protected Element elementCreateOccurrence(Element p, OccurrenceReport r) {
        return new EntityBuilder(p, E5XTerms.Entity.Occurrence) {
            @Override
            protected void build() {
                if (r.getOccurrence() == null)// do not add elements if the occurrence is null
                    return;

                if (r.getOccurrence().getEventType() != null) {
                    String occurrenceCategoryId = null;
                    Pattern p = Pattern
                            .compile("^http://onto.fel.cvut.cz/ontologies/eccairs/aviation-[^/]+/vl-a-430/v-(.+)$");
                    Matcher m = p.matcher(r.getOccurrence().getEventType().toString());
                    occurrenceCategoryId = m.matches() ? m.group(1) : null;
                    this.addAttribute(E5XTerms.OccurrenceAttribute.Occurrence_Category, occurrenceCategoryId);
                }

                if (r.getSeverityAssessment() != null) {
                    String occurrenceClassId = null;
                    Pattern p = Pattern
                            .compile("^http://onto.fel.cvut.cz/ontologies/eccairs/aviation-[^/]+/vl-a-431/v-(.+)$");
                    Matcher m = p.matcher(r.getSeverityAssessment().toString());
                    occurrenceClassId = m.matches() ? m.group(1) : null;
                    this.addAttribute(E5XTerms.OccurrenceAttribute.Occurrence_Class, occurrenceClassId);
                }

                Date d = r.getOccurrence().getStartTime();
                if (d != null) { // add this attributes only if the date is not null
                    // UTC, and local date time
                    dateFormat.get().setTimeZone(TimeZone.getDefault());
                    timeFormat.get().setTimeZone(TimeZone.getDefault());
                    this.addAttribute(E5XTerms.OccurrenceAttribute.Local_Date, dateFormat.get().format(d));
                    this.addAttribute(E5XTerms.OccurrenceAttribute.Local_Time, timeFormat.get().format(d));
                    dateFormat.get().setTimeZone(TimeZone.getTimeZone("Z"));
                    timeFormat.get().setTimeZone(TimeZone.getTimeZone("Z"));
                    this.addAttribute(E5XTerms.OccurrenceAttribute.UTC_Date, dateFormat.get().format(d));
                    this.addAttribute(E5XTerms.OccurrenceAttribute.UTC_Time, timeFormat.get().format(d));
                }
                this.addAttribute(E5XTerms.OccurrenceAttribute.Headline, r.getOccurrence().getName());

                // TODO - implement event, occurrence class, occurrence category.\
                int i = 0;
                for (AbstractEvent event : extractFatorGraph(r.getOccurrence())) {
                    EntityBuilder eventElementBuilder = createEvent(event);
                    Element evtEl = this.addSubEntity(eventElementBuilder);
                    if (evtEl != null) {
                        evtEl.setAttribute("ID", "ID" + r.getKey() + "_" + i++);
                    }
                }

                this.addSubEntity(createNarrative(r));
                this.addSubEntity(createReportingHistory(r));
            }
        }.buildElement();
    }

    protected EntityBuilder createNarrative(OccurrenceReport r) {
        String summary = r.getSummary();
        if (summary == null || summary.isEmpty()) {
            return null;
        }
        if (DetectHtml.isHtml(summary)) {
            summary = docConverter.get().convertHtml2PlainText(summary);
            if (summary == null) {
                return null;
            }
        }
        return createNarrative(summary.trim(), E5XXmlElement.PlainText);
    }

    protected EntityBuilder createNarrative(String narrative, E5XXmlElement enclosingElement) {
        return new EntityBuilder(E5XTerms.Entity.Narrative) {
            @Override
            protected void build() {
                // TODO - use the value from the question if present. Otherwise do not add this attribute
                this.addAttribute(E5XTerms.NarrativeAttribute.Narrative_Language, "12");
                this.addAttribute(E5XTerms.NarrativeAttribute.Narrative_Text, narrative,
                        () -> createElement(enclosingElement)
                );
            }
        };
    }

    protected EntityBuilder createReportingHistory(OccurrenceReport r) {
        return new EntityBuilder(E5XTerms.Entity.Reporting_History) {
            @Override
            protected void build() {
                if (r.getOccurrence() == null)// do not add elements if the occurrence is null
                    return;

                this.addAttribute(E5XTerms.ReportingHistoryAttributes.Report_Identification, r.getFileNumber());
//                this.addAttribute(E5XTerms.Reporting_HistoryAttributes.Reporting_Entity, ); // TODO reporting entity, Person, Organization
//                this.addAttribute(E5XTerms.Reporting_HistoryAttributes.Report_Status, ); // TODO reporting entity, [r.getPhase()]

                this.addAttribute(E5XTerms.ReportingHistoryAttributes.Reporting_Date,
                        dateFormat.get().format(r.getDateCreated())); // Use current day, Use the local date
                this.addAttribute(E5XTerms.ReportingHistoryAttributes.Report_Version, r.getKey()); //
            }
        };
    }

    /**
     * Build events entity. TODO - translate part of the event part of hierarchy using phase and event types in a
     * transitive relation
     *
     * @param eventTypeId
     * @param phase
     * @param narrativeText
     * @return
     */
    protected EntityBuilder createEvent(String evtUri, String eventTypeId, String phase, String narrativeText) {
        if ((eventTypeId == null || eventTypeId.isEmpty()) && (phase == null || phase.isEmpty())) {
            LOG.warn(
                    "Bad input argument combination, one of eventTypeId or phase should be non null and not emty string.");
            return null;
//            throw new IllegalArgumentException("Bad input argument eventTypeId when creating an Events entity element builder.");
        }

        return new EntityBuilder(E5XTerms.Entity.Events) {
            @Override
            protected void build() {

                if (eventTypeId != null && !eventTypeId.isEmpty()) {
                    this.addAttribute(E5XTerms.EventsAttribute.Event_Type, eventTypeId);
                }
                if (phase != null && !phase.isEmpty()) {
                    this.addAttribute(E5XTerms.EventsAttribute.Phase, phase);
                }
                if (narrativeText != null && !narrativeText.isEmpty()) {
                    this.addAttribute(E5XTerms.EventsAttribute.Narrative_Text, narrativeText,
                            () -> createElement(E5XXmlElement.PlainText)
                    );
                }
            }
        };
    }

    protected EntityBuilder createEvent(AbstractEvent evt) {
        // take the event and find it in the eccairs repo.
        // get the value list that it belongs to,
        // based on the value list put the event in the right location in the e5x file:
        // - occurrence category events as OccurrenceAttributes.occurrence_Category
        // - occurrence class events as OccurrenceAttributes.occurrence_Category
        // - event types as events
        //      these will require some mapping knowledge
        //      - if an event type is mapped to have a participant aicraft add it
        //        as link to the aircraft entity. Do the same for other enetities
        //        which allow for links to events
        //


        // convert RT model events
        // extract eventTypeId
        String eventTypeId = null;
        if (evt.getEventType() != null) {
            // extract eventType
            String typeUriStr = evt.getEventType().toString();
            Pattern p = Pattern.compile("^http://onto.fel.cvut.cz/ontologies/eccairs/aviation-[^/]+/vl-a-390/v-(.+)$");
            Matcher m = p.matcher(typeUriStr);
            eventTypeId = m.matches() ? m.group(1) : null;
        }

        // extract phase
        String phaseId = null;
        if (evt.getEventType() != null) {
            // extract eventType
            String typeUriStr = evt.getEventType().toString();
            Pattern p = Pattern.compile("^http://onto.fel.cvut.cz/ontologies/eccairs/aviation-[^/]+/vl-a-391/v-(.+)$");
            Matcher m = p.matcher(typeUriStr);
            phaseId = m.matches() ? m.group(1) : null;
        }


        return createEvent(evt.getUri().toString(), eventTypeId, phaseId, null);// ignore the

//        // TODO Extract events from Question Answer model
//        // get Event type id
//        String eventTypeId;
//
//        Question eventTypeQ = findFirstQuestionWithOrigin(evt.getQuestion(), "^http://onto.fel.cvut.cz/ontologies/eccairs/aviation-[^/]+/a-390");
//        String codeUri = eventTypeQ.getAnswers().stream().map(a -> a.getCodeValue()).filter(ca -> ca != null).map(uri -> uri.toString()).findFirst().orElse(null);
//        Pattern p = Pattern.compile("^http://onto.fel.cvut.cz/ontologies/eccairs/aviation-3.4.0.2/vl-a-390/v-(.+)$");
//        Matcher m = p.matcher(codeUri);
//        eventTypeId = m.matches() ? m.group(1) : null;
//
//        // get Narrative Text
//        String narrativeText;
//        Question eventNarattiveQ = findFirstQuestionWithOrigin(evt.getQuestion(), "^http://onto.fel.cvut.cz/ontologies/eccairs/aviation-[^/]+/a-425");
//        narrativeText = eventNarattiveQ.getAnswers().stream().map( a -> a.getTextValue()).filter(Objects::isNull).findFirst().orElse(null);


//        createEvent(eventTypeId, narrativeText);

//        evt.getTypes().stream().map(et -> {
//
//        }).filter(eventId -> eventId != null).forEach(
//                eventId ->
//                {
//                    // create an event Element in the Occurrence entity element
//
//                }
//        );
    }

//    public Set<AbstractEvent> extractFatorGraph(AbstractEvent r) {
////        final StringBuilder builder = new StringBuilder();
//        for
//
//        return null;
//    }


    // Experiment using FactorGraphTraverser, however it is depth first
    public Collection<AbstractEvent> extractFatorGraph(AbstractEvent root) {
        final Map<URI, AbstractEvent> eventRegistry = new HashMap<>();
        DefaultFactorGraphTraverser graphTraverser = new DefaultFactorGraphTraverser(
                new FactorGraphNodeVisitor() {
                    @Override
                    public void visit(Occurrence occurrence) {
                    }

                    @Override
                    public void visit(Event event) {
                        eventRegistry.put(event.getUri(), event);
                    }
                }, null
        );
        graphTraverser.traverse(root);
        return eventRegistry.values();
    }
//    public void extractFatorGraph(AbstractEvent root) {
//
//
//        // layers of factors, each set in the stack is a
//        // stack because we need to reverse the order from consequence->factor to factor->consequence
//        // linear ordering strategy - the last in the list will be the sinks of the factor graph, followed by the factors
//        // with path of length 1 from the sink layer, and so on
//        final Map<URI, AbstractEvent> eventRegistry = new HashMap<>();
//        final List<Set<AbstractEvent>> linearization = new ArrayList<>();
//        final Stack<URI> traversedPath = new Stack();
//        DefaultFactorGraphTraverser graphTraverser = new DefaultFactorGraphTraverser(
//                new FactorGraphNodeVisitor() {
//                    @Override
//                    public void visit(Occurrence occurrence) {
//                        // do nothing
//                        linearization.set(traversedPath.size(), new HashSet<>());
//                    }
//
//                    @Override
//                    public void visit(Event event) {
//                        eventRegistry.put(event.getUri(), event);
//                        linearization.get(traversedPath.size()).add(event);
//                    }
//                },
//                new FactorGraphEdgeVisitor() {
//                    @Override
//                    public void visit(URI uri, URI from, URI to, URI type) {
//                        // uri - the id of the factor(the reified triple),
//                        // from - the uri of the event which is in the role of being factr
//                        // to - the uri of the event which is in the role of being influenced by the factor
//                        // type - the type of the factor, e.g. mitigating, contributing
//                        if(!Vocabulary.s_p_has_part.equals(type.toString())){
//                            if(traversedPath.empty()){
//                                traversedPath.push(to);
//                                traversedPath.push(from);
//                                linearization.set(0, new HashSet<>());
//                                linearization.set(1, new HashSet<>());
//                            }else if(!traversedPath.peek().equals(to)){
//                                // the top of the traversedPath
//                                traversedPath.push(to);
//                                linearization.set(traversedPath.size(), new HashSet<>());
//                            }
//                        }
//                    }
//                }
//        ){
//
//        };
//        List<String> str = new ArrayList<>();
//
////        };
//
//
//        graphTraverser.traverse(root);
//    }

    protected Question findFirstQuestionWithOrigin(Question rootQ, String originRegex) {
        if (rootQ != null) {
            Set<String> types = rootQ.getTypes();
            types = types != null ? types : Collections.emptySet();
            URI questionOriginTemplate = rootQ.getOrigin();
            if (questionOriginTemplate != null) {
                String uri = questionOriginTemplate.toString();
                if (uri.matches(originRegex)) {
                    return rootQ;
                }
            }
            for (Question q : rootQ.getSubQuestions()) {
                findFirstQuestionWithOrigin(q, originRegex);
            }
        }
        return null;
    }

    public class EventTypeHandler {
        protected Pattern eventPattern;

        public EventTypeHandler(Pattern eventPattern) {
            this.eventPattern = eventPattern;
        }

        public void build() {

        }

        public Element buildElement() {

            return null;
        }
    }

    public class EntityBuilder {
        protected E5XTerms.E5XTerm entityTerm;
        protected Element parent;
        protected Element attributes = createElement(E5XXmlElement.ATTRIBUTES);
        protected Element entities = createElement(E5XXmlElement.ENTITIES);
        protected Element links = createElement(E5XXmlElement.LINKS);

        public EntityBuilder(Element parent, E5XTerms.E5XTerm entityTerm) {
            this.entityTerm = entityTerm;
            this.parent = parent;
        }

        public EntityBuilder(E5XTerms.E5XTerm entityTerm) {
            this.entityTerm = entityTerm;
        }

        protected void build() {

        }


        /**
         * Adds an element for the attribute term with the given value. If the value is null or an empty string nothing
         * no element is create/added to the dom.
         *
         * @param attributeTerm
         * @param value
         * @return
         */
        protected Element addAttribute(E5XTerms.E5XTerm attributeTerm, Object value) {
            return addAttribute(attributeTerm, value, null);
        }

        /**
         * Adds an element for the attribute term with the given value. If the value is null or an empty string nothing
         * no element is create/added to the dom.
         *
         * @param attributeTerm
         * @param val
         * @param valueElement
         * @return
         */
        protected Element addAttribute(E5XTerms.E5XTerm attributeTerm, Object val, Supplier<Element> valueElement) {
            String value = val == null ? null : Objects.toString(val);
            if (value == null || value.isEmpty()) {
                return null;
            }
            Element attribute = createElement(attributeTerm);
            attribute.setAttribute(E5XXmlElement.attributeId.getXmlElementName(), attributeTerm.getEccairsId());
            if (valueElement != null) {
                Element valueEl = valueElement.get();
                valueEl.setTextContent(value);
                attribute.appendChild(valueEl);
            } else {
                attribute.setTextContent(value);
            }
            attributes.appendChild(attribute);
            return attribute;
        }

        protected Element addSubEntity(EntityBuilder builder) {
            if (builder == null) {
                return null;
            }
            Element childEntity = builder.buildElement();
            if (childEntity != null) {
                entities.appendChild(childEntity);
            }
            return childEntity;
        }

        public Element buildElement() {
            build();
            final Element entity = createElement(entityTerm);
            // add entity id
            entity.setAttribute(E5XXmlElement.entityId.getXmlElementName(), entityTerm.getEccairsId());
            // append sections if not empty
            Stream.of(attributes, entities, links).
                    filter(el -> el.getChildNodes().getLength() > 0).
                          forEach(entity::appendChild);
            // attach element to parent
            if (parent != null)
                parent.appendChild(entity);
            return entity;
        }
    }

    protected Element createElement(E5XTerms.E5XTerm term) {
        Element el = getDocument().createElementNS(term.getNamespace(), term.getXmlElementName());
        el.setAttribute("xmlns", E5XTerms.dataBridgeNS);
        el.setAttribute("xmlns:dt", E5XTerms.dataTypesNS);
        return el;
    }

//    protected Element createElement(E5XXmlElement e5xmlElement){
//        Element el = document.createElement(e5xmlElement.getElementName());
//        el.setAttribute("__attr__", E5XTerms.dataBridgeNS);
//        el.setAttribute("__at_tr__", E5XTerms.dataTypesNS);
//        return el;
//    }
}
