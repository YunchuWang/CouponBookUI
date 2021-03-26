package com.coupon.webapp.models;

import com.google.common.collect.ImmutableList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.stream.Collectors;

public class PropertiesFileMap implements Map<String, String> {

    private static final Logger LOG = LoggerFactory.getLogger(PropertiesFileMap.class);

    private ImmutableList<Resource> propertiesResources;
    private Map<String, String> mappings = Collections.emptyMap();

    public PropertiesFileMap() {
        propertiesResources = ImmutableList.of();
    }

    public PropertiesFileMap(@Nonnull final List<Resource> optionalPropertiesResources) throws IOException {
        this.propertiesResources = ImmutableList.copyOf(optionalPropertiesResources);
        init();
    }

    public PropertiesFileMap(@Nonnull final Resource optionalPropertiesResource) throws IOException {
        this(ImmutableList.of(optionalPropertiesResource));
    }

    public PropertiesFileMap(@Nonnull final String... optionalClassPathPropertiesResources) throws IOException {
        this(Arrays.stream(optionalClassPathPropertiesResources)
                .map(ClassPathResource::new)
                .collect(Collectors.toList())
        );
    }

    public PropertiesFileMap(@Nonnull final String optionalClassPathPropertiesResource) throws IOException {
        this(new ClassPathResource(optionalClassPathPropertiesResource));
    }

    public final void init() throws IOException {
        mappings = new LinkedHashMap<>();
        for (final Resource propertiesResource : propertiesResources) {
            mappings.putAll(loadPropertiesFromOptionalResources(propertiesResource));
        }
    }

    @Nonnull
    private Map<String, String> loadPropertiesFromOptionalResources(final Resource resource) throws IOException {
        if (!resource.exists()) {
            LOG.warn("Properties resource \"" + resource + "\" doesn't exist");
            return Collections.emptyMap();
        }
        try (final InputStream inputStream = resource.getInputStream()) {
            final Properties properties = new Properties();
            properties.load(inputStream);
            return propertiesToMap(properties);
        }
    }

    private Map<String, String> propertiesToMap(Properties properties) {
        Map<String, String> map = new LinkedHashMap<>();
        for (Enumeration en = properties.keys(); en.hasMoreElements(); ) {
            String key = (String) en.nextElement();
            map.put(key, properties.getProperty(key));
        }
        return map;
    }

    @Nullable
    public Resource getPropertiesResource() {
        return propertiesResources.isEmpty() ? null : propertiesResources.get(0);
    }

    @Nonnull
    public ImmutableList<Resource> getPropertiesResources() {
        return propertiesResources;
    }

    public void setPropertiesResource(final Resource resource) throws IOException {
        if (resource == null) {
            this.propertiesResources = ImmutableList.of();
        } else {
            this.propertiesResources = ImmutableList.of(resource);
        }
    }

    public void setPropertiesResources(@Nonnull final List<Resource> optionalPropertiesResources) throws IOException {
        this.propertiesResources = ImmutableList.copyOf(optionalPropertiesResources);
    }

    public int size() {
        return mappings.size();
    }

    public boolean isEmpty() {
        return mappings.isEmpty();
    }

    public boolean containsKey(Object key) {
        return mappings.containsKey(key);
    }

    public boolean containsValue(Object value) {
        return mappings.containsValue(value);
    }

    public String get(Object key) {
        return mappings.get(key);
    }

    public String put(String key, String value) {
        throw new UnsupportedOperationException();
    }

    public String remove(Object key) {
        throw new UnsupportedOperationException();
    }

    public void putAll(Map<? extends String, ? extends String> map) {
        throw new UnsupportedOperationException();
    }

    public void clear() {
        throw new UnsupportedOperationException();
    }

    public Set<String> keySet() {
        return mappings.keySet();
    }

    public Collection<String> values() {
        return mappings.values();
    }

    public Set<Entry<String, String>> entrySet() {
        return mappings.entrySet();
    }

    @Override
    public String toString() {
        return mappings != null ? mappings.toString() : "null";
    }
}
