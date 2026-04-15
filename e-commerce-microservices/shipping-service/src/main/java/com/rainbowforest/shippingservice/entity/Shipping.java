package com.rainbowforest.shippingservice.entity;

import lombok.Data;
import javax.persistence.*;

@Entity
@Table(name = "shippings")
@Data
public class Shipping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id")
    private Long orderId;

    private String address;
    private String status; // Ví dụ: PENDING, SHIPPED, DELIVERED
}