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

import com.sun.org.apache.xml.internal.utils.DefaultErrorHandler;
import cz.cvut.kbss.reporting.exception.NotFoundException;
import cz.cvut.kbss.reporting.exception.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Bogdan Kostov on 6/1/2017.
 */
public class XMLUtils {

    private static final Logger LOG = LoggerFactory.getLogger(XMLUtils.class);

    private static Map<String, Schema> schemaMap = new ConcurrentHashMap<>();

    public static void serializeDocument(Document d, String fileName) {
        try (FileOutputStream fos = new FileOutputStream(fileName)) {
            serializeDocument(d, fos);
        } catch (FileNotFoundException ex) {
            LOG.info(String.format("Could not serialize xml document into file\"%s\", file not found.", fileName), ex);
        } catch (IOException ex) {
            LOG.info(String.format(
                    "Could not serialize xml document into file\"%s\", an error occured during writing to file.",
                    fileName), ex);
        }
    }

    public static void serializeDocument(Document d, OutputStream os) {
        try {
            TransformerFactory tf = TransformerFactory.newInstance();
            Transformer transformer = tf.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
            DOMSource source = new DOMSource(d);

            StreamResult result = new StreamResult(os);
            transformer.transform(source, result);
        } catch (TransformerConfigurationException ex) {
            LOG.info("Could not serialize xml document, configuring the transformer to serialize the docuemnt failed",
                    ex);
        } catch (TransformerException ex) {
            LOG.info("Could not serialize xml document, the transformation from DOM to stream failed", ex);
        }
    }

    /**
     * Loads XML schema from the specified location.
     * <p>
     * The location can be: <ul> <li>URL of a remote/local file,</li> <li>Path to a local file,</li> <li>A classpath
     * resource location.</li> </ul>
     *
     * @param schemaLocation Location of the schema
     * @return Loaded schema
     * @throws NotFoundException   If the schema location does not point to a valid schema file
     * @throws ValidationException If the loaded schema file is not valid (cannot be parsed)
     */
    public static Schema loadSchema(String schemaLocation) {
        if (schemaMap.containsKey(schemaLocation)) {
            return schemaMap.get(schemaLocation);
        }
        Schema schema;
        try {
            SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            try {
                URL schemaFile = new URL(schemaLocation);
                schema = schemaFactory.newSchema(schemaFile);
            } catch (MalformedURLException e) {
                schema = tryLoadingSchemaFromFile(schemaLocation, schemaFactory);
            }
            schemaMap.put(schemaLocation, schema);
        } catch (SAXException e) {
            throw new ValidationException("Schema file at " + schemaLocation + " is not valid.", e);
        }
        return schema;
    }

    private static Schema tryLoadingSchemaFromFile(String schemaLocation, SchemaFactory schemaFactory)
            throws SAXException {
        final File schemaFile = new File(schemaLocation);
        if (schemaFile.exists()) {
            return schemaFactory.newSchema(new File(schemaLocation));
        } else {
            final URL fileUrl = XMLUtils.class.getClassLoader().getResource(schemaLocation);
            if (fileUrl == null) {
                throw new NotFoundException("No schema was found at " + schemaLocation);
            }
            return schemaFactory.newSchema(fileUrl);
        }
    }

    public static boolean validateDocument(String schemaLocation, String fileName, Document doc)
            throws MalformedURLException {
        return validateDocument(schemaLocation, fileName, new DOMSource(doc));
    }

    public static boolean validateDocument(String schemaLocation, String fileName, InputStream is)
            throws MalformedURLException {
        Source source = new StreamSource(is);
        return validateDocument(schemaLocation, fileName, source);
    }

    public static boolean validateDocument(String schemaLocation, String fileName, Source source)
            throws MalformedURLException {
        Schema schema = loadSchema(schemaLocation);
        try {
            Validator validator = schema.newValidator();
            validator.setErrorHandler(new DefaultErrorHandler());
            validator.validate(source);
            LOG.info("{} is valid.", fileName);
            return true;
        } catch (SAXException e) {
            LOG.warn(fileName + " file is NOT valid.", e);
        } catch (IOException e) {
            LOG.warn("error reading file " + fileName, e);
        }
        return false;
    }

    public static void validateDocument2(String schemaLocation, String fileName, InputStream is)
            throws MalformedURLException, ParserConfigurationException {
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        dbFactory.setSchema(loadSchema(schemaLocation));
        DocumentBuilder documentBuilder = dbFactory.newDocumentBuilder();
        documentBuilder.setErrorHandler(new DefaultErrorHandler());
        try {

            Document doc = documentBuilder.parse(is);
        } catch (SAXException e) {
            LOG.warn(fileName + " file is NOT valid.", e);
        } catch (IOException e) {
            LOG.warn(fileName + " could not be validated, error reading file " + fileName, e);
        }

    }

    public static void validateFile2(String schemaURL, String fileName)
            throws FileNotFoundException, MalformedURLException, ParserConfigurationException {
        validateDocument2(schemaURL, fileName, new FileInputStream(fileName));
    }

    public static void validateFile(String schemaURL, String fileName)
            throws FileNotFoundException, MalformedURLException {
        validateDocument(schemaURL, fileName, new FileInputStream(fileName));
    }
}
