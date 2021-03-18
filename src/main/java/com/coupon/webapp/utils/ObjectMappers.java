package com.coupon.webapp.utils;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;

public class ObjectMappers {

    public ObjectMappers() {
        // empty
    }

    public static ObjectMapper createObjectMapper() {
        final ObjectMapper objectMapper = new ObjectMapper();
        //objectMapper.registerModule(new GuavaModule());
        objectMapper.registerModule(new Jdk8Module());
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return objectMapper;
    }
}
