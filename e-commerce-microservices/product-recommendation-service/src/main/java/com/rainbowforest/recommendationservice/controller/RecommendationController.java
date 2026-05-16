package com.rainbowforest.recommendationservice.controller;

import com.rainbowforest.recommendationservice.entity.Review;
import com.rainbowforest.recommendationservice.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
//@RequestMapping("/api/recommendation")
@CrossOrigin("*")
public class RecommendationController {

    @Autowired
    private ReviewRepository reviewRepository;

    // API 1: Lấy danh sách đánh giá của 1 món
    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewRepository.findByProductId(productId));
    }

    // API 2: Gửi đánh giá mới
    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Review> addReview(@PathVariable Long productId, @RequestBody Review review) {
        review.setProductId(productId);
        if (review.getDate() == null || review.getDate().isEmpty()) {
            review.setDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        }
        return ResponseEntity.ok(reviewRepository.save(review));
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
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
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
            return ResponseEntity.ok(reviewRepository.save(review));
        }).orElse(ResponseEntity.notFound().build());
    }
}