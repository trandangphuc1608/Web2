package com.rainbowforest.productcatalogservice.entity; // Đổi lại package cho đúng

import javax.persistence.*;

@Entity
@Table(name = "banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", columnDefinition = "nvarchar(255)")
    private String title; // Tiêu đề banner (VD: Khuyến mãi Noel)

    @Column(name = "image_url", nullable = false)
    private String imageUrl; // Link ảnh

    @Column(name = "target_url")
    private String targetUrl; // Bấm vào banner thì dẫn đi đâu? (VD: /category/burger)

    @Column(name = "sort_order")
    private Integer sortOrder; // Thứ tự xuất hiện

    @Column(name = "is_active")
    private Boolean isActive; // Bật/Tắt banner

    public Banner() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getTargetUrl() { return targetUrl; }
    public void setTargetUrl(String targetUrl) { this.targetUrl = targetUrl; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}