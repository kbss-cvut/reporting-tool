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
package cz.cvut.kbss.reporting.service.options;

import cz.cvut.kbss.reporting.rest.dto.model.RawJson;

public interface OptionsService {

    /**
     * Gets options of the specified type.
     *
     * @param type Options type
     * @return Object representing the options. This will most often be a {@link RawJson} containing options retrieved
     * from a remote repository. Otherwise, it can be an array/list of options.
     * @throws IllegalArgumentException When the specified option type is not supported
     */
    Object getOptions(String type);
}
