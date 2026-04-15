package com.rainbowforest.shippingservice.service;

import com.rainbowforest.shippingservice.entity.Shipping;
import com.rainbowforest.shippingservice.repository.ShippingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShippingService {

    @Autowired
    private ShippingRepository shippingRepository;

    public List<Shipping> getAllShippings() {
        return shippingRepository.findAll();
    }

    public Shipping getShippingByOrderId(Long orderId) {
        return shippingRepository.findFirstByOrderId(orderId);
    }

    public Shipping createShipping(Shipping shipping) {
        shipping.setStatus("PENDING"); // Mặc định khi mới tạo
        return shippingRepository.save(shipping);
    }

    public Shipping updateShippingStatus(Long id, String status) {
        Shipping shipping = shippingRepository.findById(id).orElse(null);
        if (shipping != null) {
            shipping.setStatus(status);
            return shippingRepository.save(shipping);
        }
        return null;
    }
}