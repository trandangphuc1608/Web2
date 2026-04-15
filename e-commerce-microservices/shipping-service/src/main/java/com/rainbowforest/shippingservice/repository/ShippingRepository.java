package com.rainbowforest.shippingservice.repository;

import com.rainbowforest.shippingservice.entity.Shipping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingRepository extends JpaRepository<Shipping, Long> {
    Shipping findFirstByOrderId(Long orderId);
}