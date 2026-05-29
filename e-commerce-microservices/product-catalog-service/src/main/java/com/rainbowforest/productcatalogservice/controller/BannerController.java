package com.rainbowforest.productcatalogservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rainbowforest.productcatalogservice.entity.Banner;
import com.rainbowforest.productcatalogservice.repository.BannerRepository;
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
@CrossOrigin("*")
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    // API cho Khách hàng xem (Chỉ lấy banner đang Bật)
    @GetMapping("/banners/active")
    public ResponseEntity<List<Banner>> getActiveBanners() {
        return ResponseEntity.ok(bannerRepository.findByIsActiveOrderBySortOrderAsc(true));
    }

    // API cho Admin xem tất cả
    @GetMapping("/admin/banners")
    public ResponseEntity<List<Banner>> getAllBanners() {
        return ResponseEntity.ok(bannerRepository.findAll());
    }

    @PostMapping(value = "/admin/banners", consumes = {"multipart/form-data"})
    public ResponseEntity<?> createBanner(
            @RequestPart("banner") String bannerJson,
            @RequestPart(value = "image", required = true) MultipartFile imageFile) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Banner banner = mapper.readValue(bannerJson, Banner.class);

            if (imageFile != null && !imageFile.isEmpty()) {
                banner.setImageUrl(saveImage(imageFile));
            }

            return ResponseEntity.ok(bannerRepository.save(banner));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }

    @PutMapping(value = "/admin/banners/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateBanner(
            @PathVariable Long id,
            @RequestPart("banner") String bannerJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Banner bannerDetails = mapper.readValue(bannerJson, Banner.class);

            return bannerRepository.findById(id).map(banner -> {
                banner.setTitle(bannerDetails.getTitle());
                banner.setTargetUrl(bannerDetails.getTargetUrl());
                banner.setSortOrder(bannerDetails.getSortOrder());
                banner.setIsActive(bannerDetails.getIsActive());

                if (imageFile != null && !imageFile.isEmpty()) {
                    try {
                        banner.setImageUrl(saveImage(imageFile));
                    } catch (Exception e) { throw new RuntimeException("Lỗi lưu ảnh"); }
                }
                return ResponseEntity.ok(bannerRepository.save(banner));
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/admin/banners/{id}")
    public ResponseEntity<?> deleteBanner(@PathVariable Long id) {
        bannerRepository.deleteById(id);
        return ResponseEntity.ok("Đã xóa banner");
    }

    private String saveImage(MultipartFile file) throws Exception {
        Path uploadPath = Paths.get("uploads/");
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return "uploads/" + fileName;
    }
}