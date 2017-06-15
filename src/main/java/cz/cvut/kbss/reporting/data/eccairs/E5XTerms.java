/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.cvut.kbss.reporting.data.eccairs;

/**
 *
 * @author Bogdan Kostov <bogdan.kostov@fel.cvut.cz>
 */
public class E5XTerms {

    public static final String dataBridgeNS = "http://eccairsportal.jrc.ec.europa.eu/ECCAIRS5_dataBridge.xsd";
    public static final String dataTypesNS = "http://eccairsportal.jrc.ec.europa.eu/ECCAIRS5_dataTypes.xsd";
    public static final String dataTypesPref = "dt";

    public static interface E5XTerm {
        public String getXmlElementName();
        public default String getNamespace(){
            return dataBridgeNS;
        }
        public String getEccairsId();
    }

    public static enum Entity implements E5XTerm {
        Occurrence("Occurrence","24"),
        Aircraft("Aircraft","4"),
        Narrative("Narrative","22"),
        Events("Events","14"),
        Descriptive_Factor("Descriptive_Factor", "12"), // not E5X entity
        Explanatory_Factor("Explanatory_Factor", "15"), // not E5X entity
        Aerodrome_General("Aerodrome_General","1"),
        Air_Space("Air_Space","3"),
        Reporting_History("Reporting_History","53"),

        ;
        private String xmlElementName;
        private String eccairsId;
        private Entity(String xmlElementName, String eccairsId) {
            this.xmlElementName = xmlElementName;
            this.eccairsId = eccairsId;
        }

        public String getXmlElementName() {
            return xmlElementName;
        }

        public String getEccairsId() {
            return eccairsId;
        }
    }
    // occurrence Attributes
    public static enum OccurrenceAttribute implements E5XTerm {
        Headline("Headline","601"),
        Occurrence_Category("Occurrence_Category","430"),
        Occurrence_Class("Occurrence_Class","431"),
        Occurrence_Status("Occurrence_Status","455"),
        Local_Date("Local_Date","433"),
        Local_Time("Local_Time","457"),
        UTC_Date("UTC_Date","477"),
        UTC_Time("UTC_Time","478"),
        Location_Name("Location_Name","440"),
        State_Area_Of_Occ("State_Area_Of_Occ","454"),
        Responsible_Entity("Responsible_Entity","453"),
        Weather_Relevant("Weather_Relevant","606")
        ;
        
        private String xmlElementName;
        private String eccairsId;

        private OccurrenceAttribute(String xmlElementName, String eccairsId) {
            this.xmlElementName = xmlElementName;
            this.eccairsId = eccairsId;
        }

        public String getXmlElementName() {
            return xmlElementName;
        }

        public String getEccairsId() {
            return eccairsId;
        }
    }
    
    // Aircraft attributes
    public static enum AircraftAttribute implements E5XTerm {
        // registration relator
        Aircraft_Registration("Aircraft_Registration","244"),
        State_Of_Registry("State_Of_Registry","281"),
        // endurant proprties tied to the manifacturing identity of the aircraft
        Manufacturer_Model("Manufacturer_Model","21"),
        Propulsion_Type("Propulsion_Type","232"),
        Aircraft_Category("Aircraft_Category","32"),
        Mass_Group("Mass_Group","319"),
        
        // flight description
        Call_Sign("Call_Sign","54"),
        Last_Departure_Point("Last_Departure_Point","167"),
        Planned_Destination("Planned_Destination","228"),
        Operation_Type("Operation_Type","214"),
        Filed_Traffic_Type("Filed_Traffic_Type","118"),
        
        // flight snapshot 
        Aircraft_Altitude("Aircraft_Altitude","22"),
        Cleared_Altitude("Cleared_Altitude","58"),
        
        // events during the flight
        Flight_Phase("Flight_Phase","121"),
        
        // describing entities to the aircraft
        Controlling_Agency("Controlling_Agency","64"),
        Operator("Operator","215"),
        ;
        
        private String xmlElementName;
        private String eccairsId;
        private AircraftAttribute(String xmlElementName, String eccairsId) {
            this.xmlElementName = xmlElementName;
            this.eccairsId = eccairsId;
        }

        public String getXmlElementName() {
            return xmlElementName;
        }

        public String getEccairsId() {
            return eccairsId;
        }
    }
    
    public static enum NarrativeAttribute implements E5XTerm {
        // registration relator
        Narrative_Language("Narrative_Language","424"),
        Narrative_Text("Narrative_Text","425"),
        ;
        
        private String xmlElementName;
        private String eccairsId;
        private NarrativeAttribute(String xmlElementName, String eccairsId) {
            this.xmlElementName = xmlElementName;
            this.eccairsId = eccairsId;
        }

        public String getXmlElementName() {
            return xmlElementName;
        }

        public String getEccairsId() {
            return eccairsId;
        }
    }
    
    public static enum EventsAttribute implements E5XTerm {
        // registration relator
        Event_Type("Event_Type","390"),
        Phase("Phase","391"),
        Narrative_Text("Narrative_Text","425"),
        Event_Justification("Event_Justification","704"), // not E5X attribute
        Descriptive_Factor("Descriptive_Factor", "12"), // not E5X attribute, Entity relation
        ;
        
        private String xmlElementName;
        private String eccairsId;
        private EventsAttribute(String xmlElementName, String eccairsId) {
            this.xmlElementName = xmlElementName;
            this.eccairsId = eccairsId;
        }

        public String getXmlElementName() {
            return xmlElementName;
        }

        public String getEccairsId() {
            return eccairsId;
        }
    }

    public static enum Reporting_HistoryAttributes implements E5XTerm {

        Report_Identification("Report_Identification","438"),
        Reporting_Entity("Reporting_Entity","447"),
        Reporting_Form_Type("Reporting_Form_Type","495"),
        Report_Status("Report_Status","800"),
        Reporting_Date("Reporting_Date","801"),
        Report("Report","802"), // report attachments
        Parties_Informed("Parties_Informed","1064"),
        Corrective_Actions("Corrective_Actions","1069"),
        Conclusions("Conclusions", "1070"),
        Tracking_Sheet_Number("Tracking_Sheet_Number", "1071"),
        Report_Version("Report_Version", "1084"),
        ;

        private String xmlElementName;
        private String eccairsId;
        private Reporting_HistoryAttributes(String xmlElementName, String eccairsId) {
            this.xmlElementName = xmlElementName;
            this.eccairsId = eccairsId;
        }

        public String getXmlElementName() {
            return xmlElementName;
        }

        public String getEccairsId() {
            return eccairsId;
        }

    }
    public static enum Descriptive_FactorAttribute implements E5XTerm { // not E5X entity
        // registration relator
        Descr_Factor_Subject("Descr_Factor_Subject","385"), // not E5X attribute
        Descr_Modifier("Descr_Modifier","386"), // not E5X attribute
        Descr_Factor_Justification("Descr_Factor_Justification","705"), // not E5X attribute
        Explanatory_Factor("Explanatory_Factor", "15"), // not E5X attribute, Entity relation
        ;
        
        private String xmlElementName;
        private String eccairsId;
        private Descriptive_FactorAttribute(String xmlElementName, String eccairsId) {
            this.xmlElementName = xmlElementName;
            this.eccairsId = eccairsId;
        }

        public String getXmlElementName() {
            return xmlElementName;
        }

        public String getEccairsId() {
            return eccairsId;
        }
    }
    
    public static enum Explanatory_FactorAttribute implements E5XTerm { // not E5X entity
        // registration relator
        Expl_Factor_Subject("Expl_Factor_Subject","392"), // not E5X attribute
        Expl_Factor_Modifier("Expl_Factor_Modifier","393"), // not E5X attribute
        Organization_Person("Organization_Person","934"), // not E5X attribute
        Expl_Factor_Justification("Expl_Factor_Justification", "706"), // not E5X attribute, Entity relation
        ;
        
        private String xmlElementName;
        private String eccairsId;
        private Explanatory_FactorAttribute(String xmlElementName, String eccairsId) {
            this.xmlElementName = xmlElementName;
            this.eccairsId = eccairsId;
        }

        public String getXmlElementName() {
            return xmlElementName;
        }

        public String getEccairsId() {
            return eccairsId;
        }
    }
    
}
