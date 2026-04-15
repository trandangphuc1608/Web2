package com.rainbowforest.shippingservice.controller;

import com.rainbowforest.shippingservice.entity.Shipping;
import com.rainbowforest.shippingservice.service.ShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ShippingController {

    @Autowired
    private ShippingService shippingService;

    @GetMapping("/deliveries")
    public ResponseEntity<List<Shipping>> getAll() {
        return new ResponseEntity<>(shippingService.getAllShippings(), HttpStatus.OK);
    }

    @GetMapping("/deliveries/order/{orderId}")
    public ResponseEntity<Shipping> getByOrderId(@PathVariable("orderId") Long orderId) {
        Shipping shipping = shippingService.getShippingByOrderId(orderId);
        if (shipping != null) {
            return new ResponseEntity<>(shipping, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/deliveries")
    public ResponseEntity<Shipping> createShipping(@RequestBody Shipping shipping) {
        try {
            Shipping saved = shippingService.createShipping(shipping);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/deliveries/{id}/status")
    public ResponseEntity<Shipping> updateStatus(@PathVariable("id") Long id, @RequestParam("status") String status) {
        Shipping updated = shippingService.updateShippingStatus(id, status);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}