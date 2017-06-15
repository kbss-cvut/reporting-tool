package cz.cvut.kbss.reporting.data.eccairs;

import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.util.DocConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.validation.Schema;
import java.io.IOException;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Common base class for occurrence report converters.
 * Instances are thread safe. See {@link Aso2E5X#convert}.
 *
 * Created by Bogdan Kostov on 6/1/2017.
 */
public abstract class AbstractOccurrenceReportE5XExporter implements OccurrenceRportE5XExporter{

    private static final Logger LOG = LoggerFactory.getLogger(AbstractOccurrenceReportE5XExporter.class);
    // thread-safe in in this usecase scenario, the state


    // non thread safe
    protected ThreadLocal<DateFormat> dateFormat = ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));
    protected ThreadLocal<DateFormat> timeFormat = ThreadLocal.withInitial(() -> new SimpleDateFormat("HH:mm:ss"));
    protected ThreadLocal<DocConverter> docConverter = ThreadLocal.withInitial(() -> new DocConverter());

    private ThreadLocal<DocumentBuilderFactory> dbFactory = ThreadLocal.withInitial(() -> DocumentBuilderFactory.newInstance());

    // created in method convert.
    private ThreadLocal<DocumentBuilder> documentBuilder = ThreadLocal.withInitial(() -> {
        try {
            DocumentBuilder documentBuilder = dbFactory.get().newDocumentBuilder();
            documentBuilder.setErrorHandler(new ErrorHandler() {
                @Override
                public void warning(SAXParseException exception) throws SAXException {
                    LOG.warn("warning when building an e5x", exception);
                }

                @Override
                public void error(SAXParseException exception) throws SAXException {
                    LOG.warn("error when building an e5x", exception);
                }

                @Override
                public void fatalError(SAXParseException exception) throws SAXException {
                    LOG.warn("fatalError when building an e5x", exception);
                }
            });
            return documentBuilder;
        } catch (ParserConfigurationException e) {
            e.printStackTrace();
        }
        return null;
    });


    private ThreadLocal<Document> document = new ThreadLocal<>();

    // thread safe
    private Schema schema;


    public AbstractOccurrenceReportE5XExporter(Schema schema) {
        this.schema = schema;
        dbFactory.get().setSchema(schema);
        dbFactory.get().setNamespaceAware(true);
    }


    /**
     * @implNote must not make nested calls to it self in order to ensure thread safety of instances of the class
     * @param occurrenceReport the report to be exported
     * @return the e5x xml dom representation of the report
     * @throws ParserConfigurationException
     * @throws MalformedURLException
     */
    @Override
    public Document convert(OccurrenceReport occurrenceReport) throws ParserConfigurationException, MalformedURLException {
        documentBuilder.get().reset();
        document.set(documentBuilder.get().newDocument());
        return convertImpl(occurrenceReport);
    }

    protected Document getDocument() {
        return document.get();
    }

    /**
     * The document
     * @param occurrenceReport
     * @return
     */
    protected abstract Document convertImpl(OccurrenceReport occurrenceReport);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////// Static methods //////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    public static void generateE5XFile(byte[] content, OutputStream os, String fileName) throws IOException {
        ZipOutputStream zip = new ZipOutputStream(os);
        // create the zip entry for the xml content
        ZipEntry xmlEntry = new ZipEntry(fileName + ".xml");
        zip.putNextEntry(xmlEntry);
        zip.write(content);
        zip.closeEntry();
        zip.flush();
        zip.close();
    }
}
