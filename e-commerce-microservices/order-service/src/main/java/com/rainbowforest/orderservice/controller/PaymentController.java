package com.rainbowforest.orderservice.controller;

import com.rainbowforest.orderservice.config.VnPayConfig;
import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.service.OrderService;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private OrderService orderService;

    @Value("${vnpay.tmnCode}")
    private String vnp_TmnCode;

    @Value("${vnpay.hashSecret}")
    private String secretKey;

    @Value("${vnpay.payUrl}")
    private String vnp_PayUrl;

    @Value("${vnpay.returnUrl}")
    private String vnp_ReturnUrl;

    // 1. API Tạo URL thanh toán VNPay
    @GetMapping("/create/{orderId}")
    public ResponseEntity<?> createPayment(@PathVariable("orderId") Long orderId, HttpServletRequest request) throws Exception {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found!");
        }

        BigDecimal total = order.getTotal() != null ? order.getTotal() : BigDecimal.ZERO;
        long amount = total.multiply(new BigDecimal("100")).longValue();

        // ÉP CỨNG SỐ TIỀN: Nếu đơn hàng tính ra bằng 0 hoặc dưới 5,000đ -> Tự động đổi thành 10,000đ (1,000,000 format VNPay) để test cho dễ.
        if(amount < 500000) { 
            amount = 1000000; 
        }

        String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
        String vnp_IpAddr = VnPayConfig.getIpAddress(request);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + orderId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl + "?orderId=" + orderId);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Build URL
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnp_PayUrl + "?" + queryUrl;

        return ResponseEntity.ok(paymentUrl);
    }

    // 2. API Nhận kết quả trả về từ VNPay (Đã xóa hàm cũ, giữ lại hàm dùng RedirectView)
    @GetMapping("/vnpay-return")
    public RedirectView paymentReturn(HttpServletRequest request, @RequestParam("orderId") Long orderId) {
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        Order order = orderService.getOrderById(orderId);

        if (order != null) {
            if ("00".equals(vnp_ResponseCode)) {
                // Thanh toán thành công -> Đổi status
                order.setStatus("PAID");
                orderService.saveOrder(order);
                
                // ĐÁ NGƯỜI DÙNG VỀ LẠI REACT APP (Kèm cờ thành công)
                return new RedirectView("http://localhost:3000/cart?payment=success");
            } else {
                order.setStatus("PAYMENT_FAILED");
                orderService.saveOrder(order);
                
                // ĐÁ NGƯỜI DÙNG VỀ LẠI REACT APP (Kèm cờ thất bại)
                return new RedirectView("http://localhost:3000/cart?payment=failed");
            }
        }
        return new RedirectView("http://localhost:3000/cart?payment=error");
    }
}