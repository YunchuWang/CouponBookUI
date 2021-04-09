package com.coupon.webapp.controllers;

import com.coupon.webapp.utils.IndexPageRenderFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;

@Controller
@ControllerAdvice
public class IndexController {

    private static final Logger LOG = LoggerFactory.getLogger(IndexController.class);

    private static final String ROOT_URL = "/";
    private static final String EXAMPLE_URL = "/example";
    private static final String SAMPLE_URL = "/sample";

    private final IndexPageRenderFactory indexPageRenderFactory;

    public IndexController(final IndexPageRenderFactory indexPageRenderFactory) {
        this.indexPageRenderFactory = indexPageRenderFactory;
        LOG.info("IndexController initialized");
    }

    @GetMapping(value = {
            ROOT_URL,
            EXAMPLE_URL,
            SAMPLE_URL,
    })
    public ModelAndView index() throws JsonProcessingException {
        return handleRequest("app");
    }

    @ExceptionHandler(value = NoHandlerFoundException.class)
    public ModelAndView error(final Exception e) throws JsonProcessingException {
        LOG.info("IndexController error: {}", e.getMessage());
        return handleRequest("appError");
    }

    private ModelAndView handleRequest(final String appName) throws JsonProcessingException {
        return indexPageRenderFactory.create(appName).render();
    }
}
