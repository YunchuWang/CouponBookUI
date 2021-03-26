package com.coupon.webapp.configs;

import com.coupon.webapp.models.FilenameMapper;
import com.coupon.webapp.models.FilenameMapperInterface;
import com.coupon.webapp.models.PropertiesFileMap;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@Import({
        FilenameConfig.class,
        ViewResolverConfig.class,
})
@ComponentScan(
        useDefaultFilters = false,
        includeFilters = @ComponentScan.Filter(value = {Controller.class, ControllerAdvice.class, Component.class}),
        basePackages = {
                "com.coupon.webapp.controllers",
                "com.coupon.webapp.services",
                "com.coupon.webapp.utils",
        }
)
@EnableWebMvc
public class MvcWebConfig extends WebMvcConfigurerAdapter {

    @Value("${statics.local}")
    private boolean staticsLocal;

    @Value("${statics.build.dir}")
    private String staticsBuildDir;

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        super.addResourceHandlers(registry);

        if (staticsLocal) {
            registry.addResourceHandler("/static/**")
                    .addResourceLocations("classpath:/webapp/static");
        } else {
            registry.addResourceHandler("/static/**")
                    .addResourceLocations("classpath:/" + staticsBuildDir + "/static/");
        }
    }

    @Bean(name = "filenameMapper")
    @Scope(value = "request", proxyMode = ScopedProxyMode.INTERFACES)
    public FilenameMapperInterface filenameMapper(
            @Qualifier("defaultFilenameMapper") final FilenameMapperInterface defaultFilenameMapper,
            @Qualifier("localFilenameMapper") final FilenameMapperInterface localFilenameMapper
    ) {
        if (staticsLocal) {
            return localFilenameMapper;
        } else {
            return defaultFilenameMapper;
        }
    }

    @Bean(name = "defaultFilenameMapper")
    public FilenameMapperInterface defaultFilenameMapper(
            @Value("${static.host:}") final String staticHost,
            final PropertiesFileMap propertiesFileMap
    ) {
        return buildFilenameMapper(staticHost, false, propertiesFileMap);
    }

    @Bean(name = "localFilenameMapper")
    public FilenameMapperInterface localFilenameMapper() {
        return buildFilenameMapper("https://localhost:3001", true, null);
    }

    private FilenameMapperInterface buildFilenameMapper(final String staticHost, final boolean isLocal, final PropertiesFileMap propertiesFileMap) {
        final FilenameMapper filenameMapper = new FilenameMapper();
        if (!staticHost.isEmpty()) {
            filenameMapper.setHost(staticHost);
        }
        if (!isLocal) {
            filenameMapper.setFilenameMap(propertiesFileMap);
        }
        return filenameMapper;
    }
}
