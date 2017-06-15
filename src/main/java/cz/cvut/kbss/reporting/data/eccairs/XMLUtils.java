package cz.cvut.kbss.reporting.data.eccairs;

import com.sun.org.apache.xml.internal.utils.DefaultErrorHandler;
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
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Bogdan Kostov on 6/1/2017.
 */
public class XMLUtils {

    private static final Logger LOG = LoggerFactory.getLogger(XMLUtils.class);

    protected static Map<String,Schema> schemaMap = new HashMap<>();

    public static void serializeDocument(Document d, String fileName){
        try (FileOutputStream fos = new FileOutputStream(fileName)){
            serializeDocument(d, fos);
        } catch (FileNotFoundException ex) {
            LOG.info(String.format("Could not serialize xml document into file\"%s\", file not found.", fileName), ex );
        } catch (IOException ex) {
            LOG.info(String.format("Could not serialize xml document into file\"%s\", an error occured during writing to file.", fileName), ex );
        }
    }

    public static void serializeDocument(Document d, OutputStream os){
        try {
            TransformerFactory tf = TransformerFactory.newInstance();
            Transformer transformer = tf.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
            DOMSource source = new DOMSource(d);

            StreamResult result = new StreamResult(os);
            transformer.transform(source, result);
        } catch (TransformerConfigurationException ex) {
            LOG.info("Could not serialize xml document, configuring the transformer to serialize the docuemnt failed", ex);
        } catch (TransformerException ex) {
            LOG.info("Could not serialize xml document, the transformation from DOM to stream failed", ex);
        }
    }

    public static Schema loadSchema(String schemaLocation) throws MalformedURLException {
        Schema schema = schemaMap.get(schemaLocation);
        if(schema == null) {
            URL schemaFile = new URL(schemaLocation);
            // or File schemaFile = new File("/location/to/xsd"); // etc.
            SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            try {
                schema = schemaFactory.newSchema(schemaFile);
                schemaMap.put(schemaLocation, schema);
            } catch (SAXException e) {
                LOG.warn(schemaFile + "Schema file NOT valid", e);
            }
        }
        return schema;
    }



    public static boolean validateDocument(String schemaURL, String fileName, Document doc) throws MalformedURLException {
        return validateDocument(schemaURL, fileName, new DOMSource(doc));
    }

    public static boolean validateDocument(String schemaURL, String fileName, InputStream is) throws MalformedURLException {
        Source source = new StreamSource(is);
        return validateDocument(schemaURL, fileName, source);
    }

    public static boolean validateDocument(String schemaURL, String fileName,Source source) throws MalformedURLException {
        Schema schema = loadSchema(schemaURL);
        try{
            Validator validator = schema.newValidator();
            validator.setErrorHandler(new DefaultErrorHandler());
            validator.validate(source);
            LOG.info("{} is valid.", fileName);
            return true;
        } catch (SAXException e) {
            LOG.warn(fileName + " file is NOT valid.", e);
        } catch (IOException e) {
            LOG.warn("error reading file " + fileName , e);
        }
        return false;
    }

    public static void validateDocument2(String schemaURL, String fileName, InputStream is) throws MalformedURLException, ParserConfigurationException {
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        dbFactory.setSchema(loadSchema(schemaURL));
        DocumentBuilder documentBuilder = dbFactory.newDocumentBuilder();
        documentBuilder.setErrorHandler(new DefaultErrorHandler());
        try {

            Document doc = documentBuilder.parse(is);
        } catch (SAXException e) {
            LOG.warn(fileName + " file is NOT valid.", e);
        } catch (IOException e) {
            LOG.warn(fileName + " could not be validated, error reading file " + fileName , e);
        }

    }

    public static void validateFile2(String schemaURL, String fileName) throws FileNotFoundException, MalformedURLException, ParserConfigurationException {
        validateDocument2(schemaURL, fileName, new FileInputStream(fileName));
    }

    public static void validateFile(String schemaURL, String fileName) throws FileNotFoundException, MalformedURLException {
        validateDocument(schemaURL, fileName, new FileInputStream(fileName));
    }
}
