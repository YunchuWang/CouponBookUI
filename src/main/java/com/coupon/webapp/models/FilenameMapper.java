package com.coupon.webapp.models;

import com.google.common.collect.ImmutableList;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.servlet.http.HttpServletRequest;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

public class FilenameMapper implements FilenameMapperInterface {
    private String host;
    private Map<String, String> filenameMap = Collections.emptyMap();
    private boolean addContextPath = false;

    public FilenameMapper() {
    }

    @Nullable
    public String getHost() {
        return host;
    }

    @Nonnull
    @Override
    public Collection<String> getHosts() {
        if (host != null) {
            return ImmutableList.of(host);
        } else {
            return Collections.emptyList();
        }
    }

    public void setHost(String host) {
        if (host != null && host.endsWith("/")) {
            host = host.substring(0, host.length() - 1);
        }
        this.host = host;
    }

    public Map<String, String> getFilenameMap() {
        return filenameMap;
    }

    public void setFilenameMap(Map<String, String> map) {
        if (map == null) {
            throw new IllegalArgumentException("filenameMap must not be null");
        }
        this.filenameMap = Map.copyOf(map);
    }

    public boolean isAddContextPath() {
        return addContextPath;
    }

    public void setAddContextPath(boolean addContextPath) {
        this.addContextPath = addContextPath;
    }

    public String getContentUrl(String localFileName, HttpServletRequest request) {
        String versionizedFilename = filenameMap.get(localFileName);
        if (versionizedFilename == null) {
            // if not found in the filename map, then prepend the servlet context path
            versionizedFilename = request.getContextPath() + localFileName;
        } else if (addContextPath) {
            versionizedFilename = request.getContextPath() + versionizedFilename;
        }

        if (host != null) {
            return host + versionizedFilename;
        } else {
            return versionizedFilename;
        }
    }
}
