package com.rainbowforest.orderservice.service;

import com.rainbowforest.orderservice.domain.Order;
import java.util.List;

public interface OrderService {
    Order saveOrder(Order order);
    Order getOrderById(Long id);
    List<Order> getAllOrders();
}