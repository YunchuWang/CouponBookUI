package com.coupon.webapp.models;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

public class StaticResources {
    private final Builder builder;

    private StaticResources(final Builder builder) {
        this.builder = builder;
    }

    public List<String> getCssResources() {
        return builder.cssResources;
    }

    public List<String> getJsResources() {
        return builder.jsResources;
    }

    public static class Builder {
        private final List<String> cssResources = new ArrayList<>();
        private final List<String> jsResources = new ArrayList<>();

        private final HttpServletRequest httpServletRequest;
        private final FilenameMapperInterface filenameMapper;

        public Builder(final HttpServletRequest httpServletRequest, final FilenameMapperInterface filenameMapper) {
            this.httpServletRequest = httpServletRequest;
            this.filenameMapper = filenameMapper;
        }

        public Builder cssResource(final String cssResource) {
            cssResources.add(filenameMapper.getContentUrl(cssResource, httpServletRequest));
            return this;
        }

        public Builder jsResource(final String jsResource) {
            jsResources.add(filenameMapper.getContentUrl(jsResource, httpServletRequest));
            return this;
        }

        public StaticResources build() {
            return new StaticResources(this);
        }
    }
}
