package cz.cvut.kbss.reporting.service.options;

import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.rest.dto.model.RawJson;
import cz.cvut.kbss.reporting.util.JsonLdProcessing;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportingPhaseService {

    private static final Logger LOG = LoggerFactory.getLogger(ReportingPhaseService.class);

    static final String PHASE_OPTION_TYPE = "reportingPhase";

    @Autowired
    private OptionsService optionsService;

    private final List<URI> phases = new ArrayList<>();
    private URI defaultPhase;

    @PostConstruct
    private void loadPhases() {
        final RawJson json;
        try {
            json = (RawJson) optionsService.getOptions(PHASE_OPTION_TYPE);
        } catch (IllegalArgumentException e) {
            LOG.warn("Reporting phases are not available (Message: {}).", e.getMessage());
            return;
        }
        this.phases.addAll(JsonLdProcessing.getOrderedOptions(json, Vocabulary.s_p_is_higher_than));
        this.defaultPhase = JsonLdProcessing.getItemWithType(json, Vocabulary.s_c_default_phase);
        if (defaultPhase == null) {
            LOG.warn("Default reporting phase not found.");
        }
    }

    /**
     * Gets the initial reporting phase.
     *
     * @return Initial reporting phase
     */
    public URI getInitialPhase() {
        if (phases.isEmpty()) {
            throw new IllegalStateException("No reporting phases have been found.");
        }
        return phases.get(0);
    }

    /**
     * Gets the default phase with which reports should be normally created.
     * <p>
     * Note that this phase can be different from the phase returned by {@link #getInitialPhase()} and it can also be
     * {@code null}.
     *
     * @return Default reporting phase
     * @see #getInitialPhase()
     */
    public URI getDefaultPhase() {
        return defaultPhase;
    }

    /**
     * Gets reporting phase which immediately follows the specified phase.
     * <p>
     * In case the current phase is {@code null}, {@code null} is also returned. If there is no phase after {@code
     * currentPhase}, the {@code currentPhase} is also returned.
     *
     * @param currentPhase Phase whose successor should be returned
     * @return Next reporting phase
     */
    public URI nextPhase(URI currentPhase) {
        if (currentPhase == null) {
            return null;
        }
        final int i = phases.indexOf(currentPhase);
        if (i == -1) {
            throw new IllegalArgumentException("Unsupported reporting phase " + currentPhase);
        }
        return phases.get(i == phases.size() - 1 ? i : i + 1);
    }
}
