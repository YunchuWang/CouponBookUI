package com.coupon.webapp.configs;

import com.google.common.collect.ImmutableList;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Bean
    public DataSource dataSource(
            @Value("${mysql.connection.url}") final String url,
            @Value("${mysql.connection.username}") final String userName,
            @Value("${mysql.connection.password}") final String password
    ) {
        final BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl(String.format(
                "%s?serverTimezone=America/Chicago"
                        + "&useSSL=false&useUnicode=true"
                        + "&character_set_server=utf8mb4"
                        + "&character_set_client=utf8mb4"
                        + "&characterEncoding=UTF-8",
                url
        ));
        dataSource.setUsername(userName);
        dataSource.setPassword(password);
        dataSource.setTestOnBorrow(true);
        dataSource.setConnectionInitSqls(ImmutableList.of("SET NAMES utf8mb4"));
        dataSource.setValidationQuery("SELECT 1");

        return dataSource;
    }
}
