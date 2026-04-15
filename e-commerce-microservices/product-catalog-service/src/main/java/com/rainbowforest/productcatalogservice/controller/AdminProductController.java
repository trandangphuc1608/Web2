package com.rainbowforest.productcatalogservice.controller;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.http.header.HeaderGenerator;
import com.rainbowforest.productcatalogservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

// THÊM DÒNG NÀY ĐỂ REACT CÓ THỂ GỌI POST ĐƯỢC MÀ KHÔNG BỊ 403
@CrossOrigin(origins = "*") 
@RestController
@RequestMapping("/admin")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private HeaderGenerator headerGenerator;

    @PostMapping(value = "/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product, HttpServletRequest request){
        if(product != null) {
            try {
                productService.addProduct(product);
                return new ResponseEntity<Product>(
                        product,
                        headerGenerator.getHeadersForSuccessPostMethod(request, product.getId()),
                        HttpStatus.CREATED);
            }catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<Product>(
                        headerGenerator.getHeadersForError(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<Product>(
                headerGenerator.getHeadersForError(),
                HttpStatus.BAD_REQUEST);
    }
    
    @DeleteMapping(value = "/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long id){
        Product product = productService.getProductById(id);
        if(product != null) {
            try {
                productService.deleteProduct(id);
                return new ResponseEntity<Void>(
                        headerGenerator.getHeadersForSuccessGetMethod(),
                        HttpStatus.OK);
            }catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<Void>(
                        headerGenerator.getHeadersForError(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<Void>(headerGenerator.getHeadersForError(), HttpStatus.NOT_FOUND);      
    }

    @PostMapping(value = "/products/{id}/image")
    public ResponseEntity<?> uploadProductImage(@PathVariable("id") Long id, @RequestParam("file") MultipartFile file) {
        try {
            Product product = productService.getProductById(id);
            if (product == null) {
                return new ResponseEntity<>("Không tìm thấy sản phẩm!", HttpStatus.NOT_FOUND);
            }
            if (file.isEmpty()) {
                return new ResponseEntity<>("Vui lòng đính kèm file ảnh!", HttpStatus.BAD_REQUEST);
            }

            // Tạo thư mục 'uploads' ở thư mục gốc của project nếu chưa có
            String uploadDir = "uploads/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Random tên file để tránh trùng lặp
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            
            // Copy file vào ổ cứng
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Lưu đường dẫn vào Database
            String fileUrl = "/uploads/" + fileName;
            product.setImageUrl(fileUrl);
            productService.addProduct(product); 

            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Lỗi upload: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}