package com.rainbowforest.productcatalogservice.controller;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/chat")
@CrossOrigin("*") 
public class AiChatController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<?> chatWithAI(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nội dung tin nhắn không được để trống!"));
        }

        // 1. LẤY MENU TỪ DATABASE (Bao gồm Tên, Giá, ID và Link Ảnh)
        List<Product> products = productService.getAllProduct();
        StringBuilder menuInfo = new StringBuilder("Danh sách món ăn đang bán: ");
        
        if (products != null && !products.isEmpty()) {
            for (Product p : products) {
                // Nối sẵn link localhost:8810 cho ảnh để React đọc được
                String imgUrl = (p.getImageUrl() != null && !p.getImageUrl().isEmpty()) 
                        ? "http://localhost:8810" + p.getImageUrl() 
                        : "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop";

                menuInfo.append("- ").append(p.getProductName())
                        .append(" (Giá: ").append(p.getPrice()).append(" VND, ")
                        .append("ID: ").append(p.getId()).append(", ")
                        .append("Ảnh: ").append(imgUrl).append("). ");
            }
        }

        // 2. ÉP AI SỬ DỤNG HTML ĐỂ RENDER ẢNH
        String systemContext = "Bạn là nhân viên tư vấn của RainbowFood. Trả lời ngắn gọn, thân thiện. " 
                             + menuInfo.toString() 
                             + " QUY TẮC BẮT BUỘC: Mỗi khi bạn giới thiệu tên một món ăn, BẠN PHẢI in kèm đoạn mã HTML sau ngay bên dưới tên món ăn đó: "
                             + "<br><a href='/product/{ID}'><img src='{Ảnh}' style='width:100%; border-radius:10px; margin-top:8px; border: 1px solid #ddd; box-shadow: 0 4px 8px rgba(0,0,0,0.1);'/></a><br> "
                             + "(Hãy tự động thay thế {ID} và {Ảnh} bằng dữ liệu ID và Ảnh tương ứng của món đó). Câu hỏi của khách là: ";
                             
        String fullMessage = systemContext + userMessage;

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", fullMessage);

            Map<String, Object> partsMap = new HashMap<>();
            partsMap.put("parts", Collections.singletonList(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(partsMap));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            String geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
            String urlWithKey = geminiApiUrl + "?key=" + geminiApiKey.trim();
            URI uri = new URI(urlWithKey);

            ResponseEntity<Map> response = restTemplate.postForEntity(uri, request, Map.class);

            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> partsList = (List<Map<String, Object>>) content.get("parts");
            String botReply = (String) partsList.get(0).get("text");

            return ResponseEntity.ok(Map.of("reply", botReply));

        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Google từ chối phục vụ: " + e.getResponseBodyAsString()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi phía Java Backend: " + e.getMessage()));
        }
    }
}