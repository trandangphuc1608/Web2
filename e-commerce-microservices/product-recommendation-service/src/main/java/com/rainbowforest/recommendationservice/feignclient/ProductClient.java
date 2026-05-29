package com.rainbowforest.recommendationservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

// Đảm bảo tên service (hoặc URL) khớp với cổng của product-catalog-service nhé
@FeignClient(name = "product-catalog-service") 
public interface ProductClient {

    @PutMapping(value = "/products/{id}/update-rating")
    void updateProductRating(@PathVariable("id") Long id, @RequestParam("rating") Float rating);
}