package com.rainbowforest.productcatalogservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rainbowforest.productcatalogservice.entity.Category;
import com.rainbowforest.productcatalogservice.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // --- ĐÃ SỬA: POST HỖ TRỢ UPLOAD ẢNH VÀ JSON ---
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createCategory(
            @RequestPart("category") String categoryJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            // 1. Chuyển chuỗi JSON từ Frontend thành Object Category
            ObjectMapper mapper = new ObjectMapper();
            Category category = mapper.readValue(categoryJson, Category.class);

            // 2. Xử lý lưu ảnh nếu có
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = saveImage(imageFile);
                category.setImageUrl(imageUrl);
            }

            return ResponseEntity.ok(categoryRepository.save(category));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lưu danh mục: " + e.getMessage());
        }
    }

    // --- ĐÃ SỬA: PUT HỖ TRỢ UPLOAD ẢNH VÀ CẬP NHẬT TRƯỜNG MỚI ---
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id, 
            @RequestPart("category") String categoryJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Category categoryDetails = mapper.readValue(categoryJson, Category.class);

            return categoryRepository.findById(id).map(category -> {
                category.setName(categoryDetails.getName());
                category.setDescription(categoryDetails.getDescription());
                category.setParentId(categoryDetails.getParentId());
                category.setSortOrder(categoryDetails.getSortOrder());
                category.setStatus(categoryDetails.getStatus());
                category.setSeoTitle(categoryDetails.getSeoTitle());
                category.setSeoDesc(categoryDetails.getSeoDesc());

                // Nếu admin có up ảnh mới thì thay thế ảnh cũ
                if (imageFile != null && !imageFile.isEmpty()) {
                    try {
                        String imageUrl = saveImage(imageFile);
                        category.setImageUrl(imageUrl);
                    } catch (Exception e) {
                        throw new RuntimeException("Lỗi lưu ảnh");
                    }
                }
                
                return ResponseEntity.ok(categoryRepository.save(category));
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật danh mục: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return ResponseEntity.ok("Đã xóa danh mục thành công!");
        }
        return ResponseEntity.badRequest().body("Không tìm thấy danh mục!");
    }

    // --- HÀM PHỤ TRỢ: LƯU FILE VÀO THƯ MỤC uploads/ ---
    private String saveImage(MultipartFile file) throws Exception {
        Path uploadPath = Paths.get("uploads/");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        // Tạo tên file ngẫu nhiên để không bị trùng (VD: 123e4567-e89b..._pizza.jpg)
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return "uploads/" + fileName; // Trả về đường dẫn để lưu vào DB
    }
}