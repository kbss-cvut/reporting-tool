package cz.cvut.kbss.reporting.data.eccairs;

/**
 * Created by user on 5/23/2017.
 */
public enum E5XXmlElement implements E5XTerms.E5XTerm{



    attributeId("attributeId"),
    entityId("entityId"),
    ATTRIBUTES("ATTRIBUTES"),
    ENTITIES("ENTITIES"),
    LINKS("LINKS"),
    SET("SET"),
    PlainText("dt:PlainText", E5XTerms.dataTypesNS),
    EncodedText("dt:EncodedText",E5XTerms.dataTypesNS),
    ;



    private String elementName;
    private String namespace;

    E5XXmlElement(String elementName) {
        this.elementName = elementName;
        this.namespace = E5XTerms.dataBridgeNS;
    }

    private E5XXmlElement(String elementName, String namespace) {
        this.elementName = elementName;
        this.namespace = namespace;
    }

    public String getNamespace() {
        return namespace;
    }

    @Override
    public String getXmlElementName() {
        return elementName;
    }

    @Override
    public String getEccairsId() {
        return null;
    }
}
