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
package cz.cvut.kbss.reporting.service.jmx;

import cz.cvut.kbss.reporting.dto.reportlist.OccurrenceReportDto;
import cz.cvut.kbss.reporting.dto.reportlist.ReportDto;
import cz.cvut.kbss.reporting.model.Vocabulary;
import cz.cvut.kbss.reporting.service.BaseServiceTestRunner;
import cz.cvut.kbss.reporting.service.cache.ReportCache;
import cz.cvut.kbss.reporting.service.event.InvalidateCacheEvent;
import cz.cvut.kbss.reporting.util.IdentificationUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class AppAdminBeanTest extends BaseServiceTestRunner {

    @Autowired
    private AppAdminBean adminBean;

    @Autowired
    private ReportCache reportCache;

    @Autowired
    private AdminListener listener;

    @Test
    public void invalidateCachePublishesEventThatInvalidatesCaches() throws Exception {
        final ReportDto dto = new OccurrenceReportDto();
        dto.setUri(URI.create(Vocabulary.s_c_report + "-instance123345"));
        dto.setFileNumber(IdentificationUtils.generateFileNumber());
        reportCache.put(dto);
        assertFalse(reportCache.getAll().isEmpty());
        final CountDownLatch countDownLatch = new CountDownLatch(1);
        listener.setCountDownLatch(countDownLatch);
        countDownLatch.await(1000, TimeUnit.MILLISECONDS);
        adminBean.invalidateCaches();
        assertTrue(reportCache.getAll().isEmpty());
    }

    @Component
    public static class AdminListener implements ApplicationListener<InvalidateCacheEvent> {

        private CountDownLatch countDownLatch;

        void setCountDownLatch(CountDownLatch countDownLatch) {
            this.countDownLatch = countDownLatch;
        }

        @Override
        public void onApplicationEvent(InvalidateCacheEvent invalidateCacheEvent) {
            countDownLatch.countDown();
        }
    }
}