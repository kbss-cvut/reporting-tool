package cz.cvut.kbss.reporting.rest.dto.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * Marker interface for DTOs used to provide data for form generation.
 * <p>
 * Its main purpose is to define the JSON type info, so that the unmarshaller knows the target type.
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "javaClass")
public interface FormGenData {
}
