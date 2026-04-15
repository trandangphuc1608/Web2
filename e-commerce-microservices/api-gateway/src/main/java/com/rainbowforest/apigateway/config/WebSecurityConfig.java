package com.rainbowforest.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // 1. Kích hoạt bộ lọc CORS lên hàng đầu tiên
            .cors().and() 
            .csrf().disable()
            .authorizeRequests()
                // 2. LỆNH QUAN TRỌNG NHẤT: Mở cửa cho mọi tiếng "gõ cửa" (OPTIONS) từ React
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                .antMatchers("/api/users/login", "/api/users/register").permitAll()
                // Tạm thời cho qua tất cả để test hiển thị
                .anyRequest().permitAll(); 
    }

    // 3. Cấu hình cấp quyền CORS toàn diện
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(false); // Bắt buộc false khi dùng dấu *
        config.addAllowedOrigin("*");      // Cho phép React (127.0.0.1:3000) chui vào
        config.addAllowedHeader("*");      // Chấp nhận mọi loại Headers
        config.addAllowedMethod("*");      // Chấp nhận GET, POST, PUT, DELETE, OPTIONS
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}