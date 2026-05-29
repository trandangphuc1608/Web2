package com.rainbowforest.recommendationservice.controller;

import com.rainbowforest.recommendationservice.entity.Review;
import com.rainbowforest.recommendationservice.repository.ReviewRepository;
import com.rainbowforest.recommendationservice.feignclient.ProductClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
//@RequestMapping("/api/recommendation")
@CrossOrigin("*")
public class RecommendationController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductClient productClient;

    // =========================================================================
    // HÀM DÙNG CHUNG ĐỂ ĐỒNG BỘ SAO SANG PRODUCT SERVICE (TÁI SỬ DỤNG NHIỀU LẦN)
    // =========================================================================
    private void syncProductRating(Long productId) {
        try {
            Double avgDouble = reviewRepository.getAverageRatingByProductId(productId);
            Float avgRating = avgDouble != null ? avgDouble.floatValue() : 0f;
            
            // Làm tròn số sao (Ví dụ: 4.33333 -> 4.3)
            avgRating = (float) (Math.round(avgRating * 10.0) / 10.0);
            
            // Bắn kết quả sang Product Service
            productClient.updateProductRating(productId, avgRating);
            
        } catch (Exception e) {
            System.out.println("CẢNH BÁO: Lỗi đồng bộ sao trung bình sang Product Service: " + e.getMessage());
        }
    }

    // API 1: Lấy danh sách đánh giá của 1 món
    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewRepository.findByProductId(productId));
    }

    // API 2: Gửi đánh giá mới (ĐÃ ĐƯỢC NÂNG CẤP)
    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Review> addReview(@PathVariable Long productId, @RequestBody Review review) {
        review.setProductId(productId);
        if (review.getDate() == null || review.getDate().isEmpty()) {
            review.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        }
        
        // 1. Lưu bài review vào CSDL
        Review savedReview = reviewRepository.save(review);

        // 2. Tính lại sao trung bình và đồng bộ sang Product Service
        syncProductRating(productId);

        return ResponseEntity.ok(savedReview);
    }

    // API 3: Gọi Đề xuất (Trả về danh sách ID của 4 món được đánh giá cao nhất)
    @GetMapping("/products/{productId}/recommendations")
    public ResponseEntity<List<Long>> getRecommendations(@PathVariable Long productId) {
        // Lấy top 4 ID có điểm đánh giá cao nhất từ DB
        List<Long> recommendedIds = reviewRepository.findRecommendedProductIds(productId, PageRequest.of(0, 4));
        return ResponseEntity.ok(recommendedIds);
    }

    // API dành cho ADMIN: Lấy TẤT CẢ đánh giá trên hệ thống
    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewRepository.findAll());
    }

    // API dành cho ADMIN: Xóa một đánh giá theo ID
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        Optional<Review> reviewOpt = reviewRepository.findById(id);
        if (reviewOpt.isPresent()) {
            Long productId = reviewOpt.get().getProductId(); // Lưu lại ID món ăn trước khi xóa
            
            // 1. Xóa đánh giá khỏi CSDL
            reviewRepository.deleteById(id);
            
            // 2. Đồng bộ lại số sao (vì khi xóa thì điểm trung bình sẽ thay đổi)
            syncProductRating(productId);
            
            return ResponseEntity.ok("Đã xóa đánh giá thành công!");
        }
        return ResponseEntity.badRequest().body("Không tìm thấy đánh giá này!");
    }

    // API: Vote đánh giá hữu ích
    @PutMapping("/reviews/{id}/helpful")
    public ResponseEntity<Review> voteHelpful(@PathVariable Long id) {
        return reviewRepository.findById(id).map(review -> {
            review.setHelpfulCount((review.getHelpfulCount() == null ? 0 : review.getHelpfulCount()) + 1);
            return ResponseEntity.ok(reviewRepository.save(review));
        }).orElse(ResponseEntity.notFound().build());
    }

    // API: Chỉnh sửa đánh giá
    @PutMapping("/reviews/{id}")
    public ResponseEntity<Review> editReview(@PathVariable Long id, @RequestBody Review updatedReview) {
        return reviewRepository.findById(id).map(review -> {
            review.setText(updatedReview.getText());
            review.setRating(updatedReview.getRating());
            review.setIsEdited(true);
            
            // 1. Lưu bản chỉnh sửa
            Review savedReview = reviewRepository.save(review);
            
            // 2. Đồng bộ lại số sao (vì khách có thể đã đổi từ 1 sao thành 5 sao)
            syncProductRating(review.getProductId());
            
            return ResponseEntity.ok(savedReview);
        }).orElse(ResponseEntity.notFound().build());
    }
}