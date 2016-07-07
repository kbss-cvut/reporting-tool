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
package cz.cvut.kbss.reporting.service;

import cz.cvut.kbss.reporting.util.ConfigParam;
import cz.cvut.kbss.reporting.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Properties;

@Component
public class ConfigReader {

    @Autowired
    private Environment environment;

    private final Properties defaultConfig = new Properties();

    /**
     * Gets value of the specified configuration parameter.
     *
     * @param param Configuration parameter
     * @return Configuration parameter value, empty string if the parameter is not set
     */
    public String getConfig(ConfigParam param) {
        return getConfig(param, "");
    }

    public String getConfig(ConfigParam param, String defaultValue) {
        if (environment.containsProperty(param.toString())) {
            return environment.getProperty(param.toString());
        }
        return defaultConfig.getProperty(param.toString(), defaultValue);
    }

    @PostConstruct
    public void initDefaultConfiguration() {
        defaultConfig.setProperty(ConfigParam.INDEX_FILE.toString(), Constants.INDEX_FILE_LOCATION);
    }
}
