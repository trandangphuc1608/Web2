package com.rainbowforest.orderservice.controller;

import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.domain.User;
import com.rainbowforest.orderservice.feignclient.UserClient;
import com.rainbowforest.orderservice.feignclient.ProductClient; // ĐÃ THÊM IMPORT NÀY
import com.rainbowforest.orderservice.client.ShippingClient;
import com.rainbowforest.orderservice.dto.ShippingDto;
import com.rainbowforest.orderservice.http.header.HeaderGenerator;
import com.rainbowforest.orderservice.service.CartService;
import com.rainbowforest.orderservice.service.OrderService;
import com.rainbowforest.orderservice.utilities.OrderUtilities;
import com.rainbowforest.orderservice.repository.ItemRepository; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class OrderController {

    @Autowired
    private UserClient userClient;

    @Autowired
    private ShippingClient shippingClient;

    // ĐÃ THÊM PRODUCT CLIENT ĐỂ LIÊN LẠC VỚI PRODUCT SERVICE
    @Autowired
    private ProductClient productClient;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Autowired
    private HeaderGenerator headerGenerator;

    @Autowired
    private ItemRepository itemRepository; 

    @PostMapping(value = "/order/{userId}")
    public ResponseEntity<Order> saveOrder(
            @PathVariable("userId") Long userId,
            @RequestHeader(value = "Cart-Id") String cartId,
            HttpServletRequest request){
        
        List<Item> cart = cartService.getAllItemsFromCart(cartId);
        User user = userClient.getUserById(userId);   
        
        if(cart != null && user != null) {
            
            for (Item item : cart) {
                itemRepository.save(item); 
            }

            Order order = this.createOrder(cart, user);

            try{
                // 1. Lưu hóa đơn vào CSDL Order
                orderService.saveOrder(order);

                // ================== THÊM MỚI Ở ĐÂY ==================
                // 2. Báo cho Product Service biết để cộng dồn số lượng Đã Bán
                try {
                    for (Item item : cart) {
                        productClient.incrementSoldCount(item.getProduct().getId(), item.getQuantity());
                    }
                } catch (Exception prodEx) {
                    System.out.println("CẢNH BÁO: Không thể cộng dồn số lượng bán sang Product Service.");
                    prodEx.printStackTrace();
                }
                // ===================================================

                // 3. Tạo vận đơn Shipping
                try {
                    ShippingDto shippingDto = new ShippingDto();
                    shippingDto.setOrderId(order.getId());
                    shippingDto.setAddress("Địa chỉ khách hàng"); 
                    shippingClient.createShipping(shippingDto);
                } catch (Exception shipEx) {
                    System.out.println("CẢNH BÁO: Không thể gọi Shipping Service, bỏ qua bước tạo vận đơn.");
                    shipEx.printStackTrace();
                }

                // 4. Xóa giỏ hàng sau khi đặt thành công
                cartService.deleteCart(cartId);
                
                return new ResponseEntity<Order>(
                        order, 
                        headerGenerator.getHeadersForSuccessPostMethod(request, order.getId()),
                        HttpStatus.CREATED);
                        
            }catch (Exception ex){
                ex.printStackTrace();
                return new ResponseEntity<Order>(
                        headerGenerator.getHeadersForError(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
  
        return new ResponseEntity<Order>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }
    
    @GetMapping(value = "/order/{orderId}")
    public ResponseEntity<Order> getOrder(@PathVariable("orderId") Long orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order != null) {
            return new ResponseEntity<>(order, HttpStatus.OK);
        }
        return new ResponseEntity<>(
                headerGenerator.getHeadersForError(), 
                HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders(); 
        if(orders != null && !orders.isEmpty()) {
            return new ResponseEntity<>(orders, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping(value = "/order/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable("orderId") Long orderId, @RequestBody Order statusUpdate) {
        Order order = orderService.getOrderById(orderId);
        if(order != null) {
            try {
                order.setStatus(statusUpdate.getStatus());
                orderService.saveOrder(order);
                return new ResponseEntity<>(order, HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping(value = "/order/{orderId}/pay")
    public ResponseEntity<Order> payOrder(@PathVariable("orderId") Long orderId) {
        Order order = orderService.getOrderById(orderId);
        if(order != null) {
            try {
                order.setStatus("PAID"); 
                orderService.saveOrder(order);
                return new ResponseEntity<>(order, HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    private Order createOrder(List<Item> cart, User user) {
        Order order = new Order();
        order.setItems(cart);
        order.setUser(user);
        order.setTotal(OrderUtilities.countTotalPrice(cart));
        order.setOrderedDate(LocalDate.now());
        order.setStatus("PAYMENT_EXPECTED");
        return order;
    }
}