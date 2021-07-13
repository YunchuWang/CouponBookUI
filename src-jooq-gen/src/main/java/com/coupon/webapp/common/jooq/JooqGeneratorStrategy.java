package com.coupon.webapp.common.jooq;

import org.apache.commons.lang3.StringUtils;
import org.jooq.codegen.DefaultGeneratorStrategy;
import org.jooq.meta.AbstractTableDefinition;
import org.jooq.meta.Definition;

import java.util.Arrays;
import java.util.stream.Collectors;

public class JooqGeneratorStrategy extends DefaultGeneratorStrategy {

    public JooqGeneratorStrategy() {
        super();
    }

    private static String toSingular(final String maybePlural) {
        final Inflector inflector = new Inflector();
        return inflector.singularize(maybePlural);
    }

    private static String toSingularWordWise(final String camelCasedString) {
        return Arrays.stream(StringUtils.splitByCharacterTypeCamelCase(camelCasedString))
                .map(JooqGeneratorStrategy::toSingular)
                .collect(Collectors.joining(""));
    }

    @Override
    public String getJavaClassName(final Definition definition, final Mode mode) {
        final String baseName = toSingularWordWise(super.getJavaClassName(definition, mode));
        if ((mode == Mode.DEFAULT) && (definition instanceof AbstractTableDefinition)) {
            return baseName + "Table";
        }
        return baseName;
    }
}
