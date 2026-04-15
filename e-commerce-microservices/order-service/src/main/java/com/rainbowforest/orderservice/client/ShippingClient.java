package com.rainbowforest.orderservice.client;

import com.rainbowforest.orderservice.dto.ShippingDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "shipping-service")
public interface ShippingClient {

    @PostMapping("/deliveries")
    ResponseEntity<Object> createShipping(@RequestBody ShippingDto shippingDto);
}