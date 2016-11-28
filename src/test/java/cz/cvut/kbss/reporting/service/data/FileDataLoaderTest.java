package cz.cvut.kbss.reporting.service.data;

import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.Collections;

import static org.junit.Assert.assertEquals;

public class FileDataLoaderTest extends BaseServiceTestRunner {

    @Autowired
    @Qualifier("localDataLoader")
    private DataLoader loader;

    @Test
    public void loadDataLoadsDataFromLocalFile() throws Exception {
        final String file = "data/occurrenceWithSubEvents.json";
        final String expectedData = Environment.loadData(file, String.class);
        final String result = loader.loadData(file, Collections.emptyMap());
        assertEquals(expectedData, result);
    }

    @Test(expected = IllegalArgumentException.class)
    public void loadDataThrowsIllegalArgumentForUnknownFile() throws Exception {
        loader.loadData("unknown/file.txt", Collections.emptyMap());
    }
}