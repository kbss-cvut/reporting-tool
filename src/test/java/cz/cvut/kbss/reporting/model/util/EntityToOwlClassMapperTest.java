package cz.cvut.kbss.reporting.model.util;

import cz.cvut.kbss.reporting.model.Occurrence;
import cz.cvut.kbss.reporting.model.Vocabulary;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class EntityToOwlClassMapperTest {

    @Test
    public void getOWlClassForEntityExtractsOwlClassIriFromEntityClass() {
        assertEquals(Vocabulary.s_c_Occurrence, EntityToOwlClassMapper.getOwlClassForEntity(Occurrence.class));
    }

    @Test(expected = IllegalArgumentException.class)
    public void getOwlClassForEntityThrowsIllegalArgumentForNonEntity() {
        EntityToOwlClassMapper.getOwlClassForEntity(Object.class);
    }
}