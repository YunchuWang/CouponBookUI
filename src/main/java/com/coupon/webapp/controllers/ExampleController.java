package com.coupon.webapp.controllers;

import com.coupon.webapp.models.ExampleResponse;
import com.coupon.webapp.models.ImmutableExampleResponse;
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
    public ExampleResponse exampleGet(
            @RequestParam(defaultValue = "") final String query,
            @RequestParam(defaultValue = "0") final int page
    ) {
        LOG.info("GET /api/example is visited with query = {} and page = {}", query, page);
        return ImmutableExampleResponse.builder()
                .setDisplayStr("example value: " + query + " page: " + page)
                .build();
    }
}
