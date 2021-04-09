package com.coupon.webapp.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sample")
public class SampleController {

    private static final Logger LOG = LoggerFactory.getLogger(SampleController.class);

    public SampleController() {
        // empty
    }

    @GetMapping(value = "")
    public String exampleGet(
            @RequestParam(defaultValue = "") final String query,
            @RequestParam(defaultValue = "0") final int page
    ) {
        LOG.info("GET /api/sample is visited with query = {}, and page = {}", query, page);
        return "sample value: " + query + " page: " + page;
    }
}
