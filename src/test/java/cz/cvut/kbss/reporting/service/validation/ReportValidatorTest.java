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
package cz.cvut.kbss.reporting.service.validation;

import cz.cvut.kbss.reporting.environment.util.Generator;
import cz.cvut.kbss.reporting.exception.ValidationException;
import cz.cvut.kbss.reporting.model.OccurrenceReport;
import cz.cvut.kbss.reporting.model.Person;
import cz.cvut.kbss.reporting.util.IdentificationUtils;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.net.URI;
import java.util.Date;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {ValidatorFactory.class})
public class ReportValidatorTest {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Autowired
    private ReportValidator validator;

    private OccurrenceReport original;
    private OccurrenceReport copy;

    @Before
    public void setUp() {
        this.original = Generator.generateOccurrenceReport(true);
        original.setUri(URI.create("http://onto.fel.cvut.cz/ontologies/documentation/report/original"));
        original.setKey(IdentificationUtils.generateKey());
        original.getAuthor().generateUri();
        this.copy = new OccurrenceReport();
        copy.setUri(original.getUri());
        copy.setKey(original.getKey());
        copy.setFileNumber(original.getFileNumber());
        copy.setDateCreated(original.getDateCreated());
        copy.setLastModified(original.getLastModified());
        copy.setRevision(original.getRevision());
        final Person authorCopy = new Person();
        authorCopy.setFirstName(original.getAuthor().getFirstName());
        authorCopy.setLastName(original.getAuthor().getLastName());
        authorCopy.setUsername(original.getAuthor().getUsername());
        authorCopy.generateUri();
        copy.setAuthor(authorCopy);
    }

    @Test
    public void modifiedUriInUpdateIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Instance URI cannot be modified.");
        copy.setUri(URI.create("http://onto.fel.cvut.cz/ontologies/documentation/report/modified"));
        validator.validateForUpdate(copy, original);
    }

    @Test
    public void modifiedKeyInUpdateIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Instance key cannot be modified.");
        copy.setKey("modifiedKey");
        validator.validateForUpdate(copy, original);
    }

    @Test
    public void modifiedAuthorInIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Report author cannot be different.");
        final Person newAuthor = new Person();
        newAuthor.setFirstName("Serin");
        newAuthor.setLastName("Osman");
        newAuthor.setUri(URI.create("http://www.inbas.cz/ontologies/reporting-tool/people#Serin+Osman"));
        newAuthor.setUsername("osman@unsc.org");
        copy.setAuthor(newAuthor);
        validator.validateForUpdate(copy, original);
    }

    @Test
    public void creationDateSetToNullInUpdateIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Report creation date cannot be modified.");
        copy.setDateCreated(null);
        validator.validateForUpdate(copy, original);
    }

    @Test
    public void modifiedCreationInUpdateIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Report creation date cannot be modified.");
        copy.setDateCreated(new Date(System.currentTimeMillis() - 100000));
        validator.validateForUpdate(copy, original);
    }

    @Test
    public void modifiedFileNumberInUpdateIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Report file number cannot be modified.");
        copy.setFileNumber(Long.MAX_VALUE);
        validator.validateForUpdate(copy, original);
    }

    @Test
    public void modifiedRevisionNumberInUpdateIsInvalid() {
        thrown.expect(ValidationException.class);
        thrown.expectMessage("Report revision number cannot be modified.");
        copy.setRevision(copy.getRevision() + 1);
        validator.validateForUpdate(copy, original);
    }

    @Test
    public void validUpdatedReportPassesValidation() {
        copy.setLastModified(new Date());
        copy.setLastModifiedBy(Generator.getPerson());
        validator.validateForUpdate(copy, original);
    }
}