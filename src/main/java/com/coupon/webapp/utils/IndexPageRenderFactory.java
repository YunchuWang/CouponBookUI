package com.coupon.webapp.utils;

import com.coupon.webapp.models.ImmutableInitialAppState;
import com.coupon.webapp.models.InitialAppState;
import com.coupon.webapp.models.StaticResources;
import com.coupon.webapp.models.FilenameMapperInterface;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Component
public class IndexPageRenderFactory {
    private static final ObjectMapper OBJECT_MAPPER = ObjectMappers.createObjectMapper();

    private final FilenameMapperInterface filenameMapper;
    private final HttpServletRequest httpServletRequest;
    private final String exampleName;
    private final String exampleValue;

    @Autowired
    public IndexPageRenderFactory(
            @Qualifier("filenameMapper") final FilenameMapperInterface filenameMapper,
            final HttpServletRequest httpServletRequest,
            @Value("${example.name}") final String exampleName,
            @Value("${example.value}") final String exampleValue
    ) {
        this.filenameMapper = filenameMapper;
        this.httpServletRequest = httpServletRequest;
        this.exampleName = exampleName;
        this.exampleValue = exampleValue;
    }

    public IndexPageRender create(final String appName) {
        return new IndexPageRender(appName);
    }

    public class IndexPageRender {
        private final String appName;
        private String title = "Example Webapp";
        private String faviconFileName = "favicon.ico";

        IndexPageRender(final String appName) {
            this.appName = appName;
        }

        public IndexPageRender setTitle(final String title) {
            this.title = title;
            return this;
        }

        public ModelAndView render() throws JsonProcessingException {
            final StaticResources staticResources = new StaticResources.Builder(httpServletRequest, filenameMapper)
                    .cssResource("/static/styles/" + appName + ".css")
                    .jsResource("/static/scripts/" + appName + ".js")
                    .build();

            final InitialAppState initialAppState = ImmutableInitialAppState.builder()
                    .setExampleName(exampleName)
                    .setExampleValue(exampleValue)
                    .build();

            final String test = OBJECT_MAPPER.writeValueAsString(initialAppState);

            return new ModelAndView("index", ImmutableMap.<String, Object>builder()
                    .put("staticResources", staticResources)
                    .put("initialAppStateJson", OBJECT_MAPPER.writeValueAsString(initialAppState))
                    .put("favicon", filenameMapper.getContentUrl("/static/images/" + faviconFileName, httpServletRequest))
                    .put("title", title)
                    .build()
            );
        }
    }
}
