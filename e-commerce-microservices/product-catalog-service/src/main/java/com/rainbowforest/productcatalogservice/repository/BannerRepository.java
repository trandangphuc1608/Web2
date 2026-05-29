package com.rainbowforest.productcatalogservice.repository;

import com.rainbowforest.productcatalogservice.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    // Lấy banner đang active cho khách hàng xem, sắp xếp theo thứ tự
    List<Banner> findByIsActiveOrderBySortOrderAsc(Boolean isActive);
}