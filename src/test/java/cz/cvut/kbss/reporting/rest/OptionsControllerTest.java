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
package cz.cvut.kbss.reporting.rest;

import cz.cvut.kbss.reporting.environment.config.MockServiceConfig;
import cz.cvut.kbss.reporting.environment.config.MockSesamePersistence;
import cz.cvut.kbss.reporting.environment.util.Environment;
import cz.cvut.kbss.reporting.environment.util.Generator;
import cz.cvut.kbss.reporting.rest.dto.model.RawJson;
import cz.cvut.kbss.reporting.service.options.OptionsService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ContextConfiguration(classes = {MockServiceConfig.class, MockSesamePersistence.class})
public class OptionsControllerTest extends BaseControllerTestRunner {

    @Autowired
    private OptionsService optionsServiceMock;

    @Before
    public void setUp() throws Exception {
        super.setUp();
        Mockito.reset(optionsServiceMock);
        Environment.setCurrentUser(Generator.getPerson());
    }

    @Test
    public void getOptionsReturnsOptionsForSpecifiedType() throws Exception {
        final String optionsType = "test";
        final String options = "[{\n" +
                "\"IATA\":\"OK\",\n" +
                "\"ICAO\":\"CSA\",\n" +
                "\"operator\":\"Czech Airlines\",\n" +
                "\"country\":\"Czech Rep.\",\n" +
                "\"radioCallsign\":\"CSA Lines\"\n" +
                "  }]";
        when(optionsServiceMock.getOptions(optionsType)).thenReturn(new RawJson(options));
        final MvcResult result = mockMvc.perform(get("/options").param("type", optionsType))
                                        .andExpect(status().isOk()).andReturn();
        assertEquals(options, result.getResponse().getContentAsString());
    }

    @Test
    public void getOptionsWithUnknownTypeReturnsIllegalArgumentWrappedInBadRequestResponse() throws Exception {
        final String unknownType = "unknownType";
        final String message = "Unsupported option type " + unknownType;
        when(optionsServiceMock.getOptions(unknownType)).thenThrow(new IllegalArgumentException(message));
        final MvcResult result = mockMvc.perform(get("/options").param("type", unknownType))
                                        .andExpect(status().isBadRequest()).andReturn();
        final String msg = result.getResponse().getContentAsString();
        assertTrue(msg.contains(message));
    }
}