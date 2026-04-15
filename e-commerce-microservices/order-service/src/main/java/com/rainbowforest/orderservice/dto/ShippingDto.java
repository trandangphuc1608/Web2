package com.rainbowforest.orderservice.dto;

import lombok.Data;

@Data
public class ShippingDto {
    private Long orderId;
    private String address;
}