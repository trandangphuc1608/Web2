package com.rainbowforest.userservice.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Dòng thêm 1

@JsonIgnoreProperties(ignoreUnknown = true) // Dòng thêm 2: Bỏ qua các trường thừa của Google
public class GoogleUserResponse {
    private String sub;   // ID của user trên Google
    private String name;  // Tên hiển thị (VD: Phúc Trần)
    private String email; // Email đăng ký
    private String picture; // Link ảnh đại diện

    // Getters và Setters
    public String getSub() { return sub; }
    public void setSub(String sub) { this.sub = sub; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
}