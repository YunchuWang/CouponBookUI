package com.coupon.webapp.annotations;

import org.immutables.value.Value;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({
        ElementType.PACKAGE,
        ElementType.TYPE,
})
@Retention(RetentionPolicy.SOURCE)
@Value.Style(
        init = "set*",
        get = { "get", "is*" },
        stagedBuilder = true
)
public @interface ImmutableStyle {
}
