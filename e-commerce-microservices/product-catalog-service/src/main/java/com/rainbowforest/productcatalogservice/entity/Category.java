package com.rainbowforest.productcatalogservice.entity;

import javax.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    private String name;

    @Column(columnDefinition = "nvarchar(MAX)")
    private String description;

    // --- CÁC CỘT MỚI THÊM VÀO ---
    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "parent_id")
    private String parentId;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "status")
    private Boolean status;

    @Column(name = "seo_title", columnDefinition = "nvarchar(255)")
    private String seoTitle;

    @Column(name = "seo_desc", columnDefinition = "nvarchar(MAX)")
    private String seoDesc;

    public Category() {}

    // --- GETTERS & SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getParentId() { return parentId; }
    public void setParentId(String parentId) { this.parentId = parentId; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }

    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }

    public String getSeoDesc() { return seoDesc; }
    public void setSeoDesc(String seoDesc) { this.seoDesc = seoDesc; }
}