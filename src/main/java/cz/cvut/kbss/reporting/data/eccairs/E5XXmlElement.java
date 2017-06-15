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
