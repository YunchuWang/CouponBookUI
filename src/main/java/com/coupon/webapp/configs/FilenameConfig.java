package com.coupon.webapp.configs;

import com.coupon.webapp.models.PropertiesFileMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Configuration
public class FilenameConfig {

    @Bean
    PropertiesFileMap propertiesFileMap(@Value("${statics.build.dir}") final String staticsBuildDir) throws IOException {
        return new PropertiesFileMap(new ClassPathResource(staticsBuildDir + "/staticfiles.properties"));
    }
}
