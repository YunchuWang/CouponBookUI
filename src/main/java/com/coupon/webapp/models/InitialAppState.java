package com.coupon.webapp.models;

import com.coupon.webapp.annotations.ImmutableStyle;
import org.immutables.value.Value;

@ImmutableStyle
@Value.Immutable
public interface InitialAppState {

    String exampleName();

    String exampleValue();
}
