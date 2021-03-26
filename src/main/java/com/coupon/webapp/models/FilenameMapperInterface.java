package com.coupon.webapp.models;

import javax.annotation.Nonnull;
import javax.servlet.http.HttpServletRequest;
import java.util.Collection;

public interface FilenameMapperInterface {

    String getContentUrl(String localFilename, HttpServletRequest request);

    @Nonnull
    Collection<String> getHosts();
}
