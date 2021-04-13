package com.coupon.webapp.models;

import com.coupon.webapp.annotations.ImmutableStyle;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@ImmutableStyle
@Value.Immutable
@JsonSerialize(as = ImmutableExampleResponse.class)
@JsonDeserialize(as = ImmutableExampleResponse.class)
public interface ExampleResponse {

    String displayStr();

}
