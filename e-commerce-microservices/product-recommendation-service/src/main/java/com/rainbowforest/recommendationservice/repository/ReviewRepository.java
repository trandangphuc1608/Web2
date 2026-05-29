package com.rainbowforest.recommendationservice.repository;

import com.rainbowforest.recommendationservice.entity.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // 1. Lấy toàn bộ đánh giá của 1 món ăn
    List<Review> findByProductId(Long productId);

    // 2. LOGIC ĐỀ XUẤT: Nhóm các món ăn lại, tính điểm trung bình, xếp giảm dần để lấy các món Top ngon nhất (trừ món hiện tại)
    @Query("SELECT r.productId FROM Review r WHERE r.productId != :currentProductId GROUP BY r.productId ORDER BY AVG(r.rating) DESC")
    List<Long> findRecommendedProductIds(@Param("currentProductId") Long currentProductId, Pageable pageable);

    // 3. TÍNH ĐIỂM SAO TRUNG BÌNH CỦA 1 MÓN ĂN
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);
}