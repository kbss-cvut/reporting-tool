package cz.cvut.kbss.reporting.dto;

import java.net.URI;
import java.util.Date;

public class ReportRevisionInfo {

    // Report URI
    private URI uri;

    // Report key
    private String key;

    private Date created;

    private Integer revision;

    public URI getUri() {
        return uri;
    }

    public void setUri(URI uri) {
        this.uri = uri;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Integer getRevision() {
        return revision;
    }

    public void setRevision(Integer revision) {
        this.revision = revision;
    }

    @Override
    public String toString() {
        return "ReportRevisionInfo{" +
                "uri=" + uri +
                ", revision=" + revision +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ReportRevisionInfo that = (ReportRevisionInfo) o;

        return uri.equals(that.uri);

    }

    @Override
    public int hashCode() {
        return uri.hashCode();
    }
}
