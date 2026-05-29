package com.rainbowforest.productcatalogservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", columnDefinition = "nvarchar(255)")
    @NotNull
    private String productName;

    @Column(name = "price")
    @NotNull
    private BigDecimal price;

    @Column(name = "description", columnDefinition = "nvarchar(MAX)")
    private String description;

    @Column(name = "category", columnDefinition = "nvarchar(255)")
    @NotNull
    private String category;

    @Column(name = "availability")
    @NotNull
    private int availability;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "visibility_status", length = 20)
    private String visibilityStatus;
    
    @Column(name = "sold_count", columnDefinition = "int default 0")
    private Integer soldCount = 0;

    @Column(name = "average_rating", columnDefinition = "float default 0.0")
    private Float averageRating = 0f;

    public Product() {}

    // ===== GETTERS / SETTERS =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getAvailability() {
        return availability;
    }

    public void setAvailability(int availability) {
        this.availability = availability;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getVisibilityStatus() {
        return visibilityStatus;
    }

    public void setVisibilityStatus(String visibilityStatus) {
        this.visibilityStatus = visibilityStatus;
    }
    public Integer getSoldCount() {
        return soldCount;
    }

    public void setSoldCount(Integer soldCount) {
        this.soldCount = soldCount;
    }

    public Float getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Float averageRating) {
        this.averageRating = averageRating;
    }
}