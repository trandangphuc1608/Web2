package com.rainbowforest.productcatalogservice.controller;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping(value = "/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProduct();
        if (!products.isEmpty()) {
            return ResponseEntity.ok(products); // Cú pháp chuẩn, tự động sinh header đúng
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @GetMapping(value = "/products", params = "category")
    public ResponseEntity<List<Product>> getAllProductByCategory(@RequestParam("category") String category) {
        List<Product> products = productService.getAllProductByCategory(category);
        if (!products.isEmpty()) {
            return ResponseEntity.ok(products);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @GetMapping(value = "/products/{id}")
    public ResponseEntity<Product> getOneProductById(@PathVariable("id") long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @GetMapping(value = "/products", params = "name")
    public ResponseEntity<List<Product>> getAllProductsByName(@RequestParam("name") String name) {
        List<Product> products = productService.getAllProductsByName(name);
        if (!products.isEmpty()) {
            return ResponseEntity.ok(products);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @PostMapping(value = "/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product, HttpServletRequest request) {
        if (product != null) {
            try {
                // --- ĐÃ THÊM LOGIC XỬ LÝ TRẠNG THÁI (NHÁP / ĐĂNG) ---
                // Nếu React không gửi lên (hoặc bị null), mặc định là PUBLISHED để an toàn hiển
                // thị
                if (product.getVisibilityStatus() == null || product.getVisibilityStatus().isEmpty()) {
                    product.setVisibilityStatus("PUBLISHED");
                }

                Product savedProduct = productService.addProduct(product);
                return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PutMapping(value = "/products/{id}/increment-sold")
    public ResponseEntity<Void> incrementSoldCount(
            @PathVariable("id") Long id,
            @RequestParam("qty") int quantity) {

        productService.updateSoldCount(id, quantity);
        return ResponseEntity.ok().build();
    }

    // Thêm API này để Recommendation Service gọi sang cập nhật sao
    @PutMapping(value = "/products/{id}/update-rating")
    public ResponseEntity<Void> updateProductRating(
            @PathVariable("id") Long id,
            @RequestParam("rating") Float rating) {

        productService.updateAverageRating(id, rating);
        return ResponseEntity.ok().build();
    }
}