package cz.cvut.kbss.reporting.dto.event;

import cz.cvut.kbss.reporting.environment.generator.Generator;
import org.junit.Test;

import static org.junit.Assert.assertNotEquals;

public class FactorGraphEdgeTest {

    @Test
    public void twoEdgesBetweenSameFactorsButOfDifferentKindAreDifferent() {
        final int from = 117;
        final int to = 4529;
        final FactorGraphEdge eOne = new FactorGraphEdge(from, to, Generator.FACTOR_TYPES[0]);
        final FactorGraphEdge eTwo = new FactorGraphEdge(from, to, Generator.FACTOR_TYPES[1]);
        assertNotEquals(eOne, eTwo);
        assertNotEquals(eOne.hashCode(), eTwo.hashCode());
    }
}
