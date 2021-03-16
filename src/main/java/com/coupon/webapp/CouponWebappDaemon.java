package com.coupon.webapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CouponWebappDaemon {
    protected CouponWebappDaemon() {
        // empty
    }

    public static void main(final String[] args) {
        SpringApplication.run(CouponWebappDaemon.class, args);
    }
}
