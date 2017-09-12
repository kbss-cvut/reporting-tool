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
package cz.cvut.kbss.reporting.rest.dto.mapper;

import cz.cvut.kbss.reporting.exception.DtoMapperException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;

@Component
public class GenericMapper {

    @Autowired
    private DtoMapper dtoMapper;

    /**
     * Maps the specified object to/from DTO, if it is supported by this mapper.
     *
     * @param object The object to map
     * @return Mapping result, it will be the same instance if it cannot be mapped by this mapper
     * @see DtoMapper#canMap(Class)
     */
    public <T> Object map(T object) {
        if (object == null || !dtoMapper.canMap(object.getClass())) {
            return object;
        }
        final Method[] methods = dtoMapper.getClass().getDeclaredMethods();
        for (Method m : methods) {
            if (m.getParameterCount() != 1 || isPrivate(m)) {
                continue;
            }
            final Class<?>[] paramTypes = m.getParameterTypes();
            if (paramTypes[0].equals(object.getClass())) {
                try {
                    return m.invoke(dtoMapper, object);
                } catch (IllegalAccessException | InvocationTargetException e) {
                    throw new DtoMapperException(e);
                }
            }
        }
        throw new DtoMapperException("No suitable method found to map " + object);
    }

    private boolean isPrivate(Method m) {
        return (m.getModifiers() & Modifier.PRIVATE) == m.getModifiers();
    }
}
