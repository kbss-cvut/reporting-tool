package cz.cvut.kbss.reporting.data.eccairs;

import cz.cvut.kbss.reporting.model.OccurrenceReport;
import org.w3c.dom.Document;

import javax.xml.parsers.ParserConfigurationException;
import java.net.MalformedURLException;

/**
 * Created by Bogdan Kostov on 6/1/2017.
 */
public interface OccurrenceRportE5XExporter {

    Document convert(OccurrenceReport r) throws ParserConfigurationException, MalformedURLException;
}
