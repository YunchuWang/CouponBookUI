package com.coupon.webapp.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/example")
public class ExampleController {

    private static final Logger LOG = LoggerFactory.getLogger(ExampleController.class);

    public ExampleController() {
        // empty
    }

    @GetMapping(value = "")
    public String exampleGet(@RequestParam(defaultValue = "") final String query) {
        LOG.info("GET /api/example is visited with query = {}", query);
        return "example value: " + query;
    }
}
