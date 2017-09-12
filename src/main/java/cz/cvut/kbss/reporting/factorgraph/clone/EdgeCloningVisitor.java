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
package cz.cvut.kbss.reporting.factorgraph.clone;

import cz.cvut.kbss.reporting.factorgraph.FactorGraphEdgeVisitor;
import cz.cvut.kbss.reporting.factorgraph.FactorGraphItem;
import cz.cvut.kbss.reporting.model.Event;
import cz.cvut.kbss.reporting.model.Factor;
import cz.cvut.kbss.reporting.model.Vocabulary;

import java.net.URI;
import java.util.Map;

public class EdgeCloningVisitor implements FactorGraphEdgeVisitor {

    private static final URI HAS_PART_URI = URI.create(Vocabulary.s_p_has_part);

    private final Map<URI, FactorGraphItem> instanceMap;

    public EdgeCloningVisitor(Map<URI, FactorGraphItem> instanceMap) {
        this.instanceMap = instanceMap;
    }

    @Override
    public void visit(URI uri, URI from, URI to, URI type) {
        final FactorGraphItem source = instanceMap.get(from);
        assert source != null;
        final FactorGraphItem target = instanceMap.get(to);
        assert target != null;
        if (type.equals(HAS_PART_URI)) {
            source.addChild((Event) target);
        } else {
            final Factor factor = new Factor();
            factor.setEvent((Event) source);
            factor.addType(type);
            target.addFactor(factor);
        }
    }
}
