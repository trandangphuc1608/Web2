package com.rainbowforest.userservice.controller;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.entity.UserDetails;
import com.rainbowforest.userservice.entity.UserRole;
import com.rainbowforest.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*") // Mở CORS cho chắc chắn
public class UserController {

    @Autowired
    private UserService userService;

    // ================= CLASS DTO TRUNG GIAN ĐỂ HỨNG DỮ LIỆU TỪ ADMIN REACT =================
    public static class UserDTO {
        private Long id;
        private String userName;
        private String username; 
        private String email;
        private String password;
        private String phone;
        private String address;
        private String role;
        private Boolean isActive;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    }

    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUserName(user.getUserName());
        dto.setUsername(user.getUserName());
        dto.setEmail(user.getEmail());
        dto.setIsActive(user.getActive() == 1);

        if (user.getRole() != null) {
            dto.setRole(user.getRole().getRoleName());
        } else {
            dto.setRole("Khách hàng");
        }

        if (user.getUserDetails() != null) {
            dto.setPhone(user.getUserDetails().getPhoneNumber());
            dto.setAddress(user.getUserDetails().getStreet());
        }
        return dto;
    }

    // ================= API ĐĂNG KÝ & ĐĂNG NHẬP THƯỜNG (ĐÃ SỬA LỖI TỪ KHÓA) =================

    @PostMapping(value = "/register")
    public ResponseEntity<User> register(@RequestBody Map<String, String> payload) {
        // Hỗ trợ cả 2 trường hợp React gửi username hoặc userName
        String userName = payload.containsKey("username") ? payload.get("username") : payload.get("userName");
        String password = payload.get("password");
        String email = payload.get("email");

        if (userName == null || password == null || userName.trim().isEmpty() || password.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if (userService.getUserByName(userName.trim()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); 
        }

        User newUser = new User();
        newUser.setUserName(userName.trim());
        newUser.setUserPassword(password.trim());
        newUser.setEmail(email != null ? email.trim() : userName.trim() + "@rainbow.com");
        newUser.setActive(1);

        try {
            userService.saveUser(newUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/login")
    public ResponseEntity<User> login(@RequestBody Map<String, String> payload) {
        // Hỗ trợ cả 2 trường hợp React gửi username hoặc userName
        String userName = payload.containsKey("username") ? payload.get("username") : payload.get("userName");
        String password = payload.get("password");

        if (userName == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        User user = userService.getUserByName(userName.trim());

        if (user == null || !password.trim().equals(user.getUserPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); 
        }

        // Nếu tài khoản bị khóa (active = 0) thì không cho đăng nhập
        if (user.getActive() == 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403 Forbidden
        }

        return ResponseEntity.ok(user);
    }

    // ================= API ĐĂNG NHẬP GOOGLE & FACEBOOK (ĐÃ KHÔI PHỤC LẠI) =================

    // Lớp nội bộ để hứng request Google (Do code cũ của bạn có xài)
    public static class GoogleLoginRequest {
        private String token;
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }

    public static class GoogleUserResponse {
        private String sub;
        private String name;
        private String email;
        public String getSub() { return sub; }
        public void setSub(String sub) { this.sub = sub; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    @PostMapping(value = "/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        try {
            if (request.getToken() == null || request.getToken().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token không được để trống!");
            }

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + request.getToken());
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<GoogleUserResponse> response = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    entity,
                    GoogleUserResponse.class
            );

            GoogleUserResponse googleUser = response.getBody();

            if (googleUser == null || googleUser.getEmail() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Dữ liệu Google trả về bị rỗng!");
            }

            User user = userService.getUserByEmail(googleUser.getEmail());

            if (user == null) {
                user = new User();
                user.setUserName("GG_" + googleUser.getSub());
                user.setEmail(googleUser.getEmail());
                user.setUserPassword(""); 
                user.setActive(1);
                userService.saveUser(user); 
            } else if (user.getActive() == 0) {
                 return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản đã bị khóa!");
            }

            return ResponseEntity.ok(user);

        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token Google đã hết hạn hoặc không hợp lệ!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống khi xử lý Đăng nhập Google: " + e.getMessage());
        }
    }

    @PostMapping(value = "/facebook")
    public ResponseEntity<?> loginWithFacebook(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token Facebook trống!");
            }

            RestTemplate restTemplate = new RestTemplate();
            String fbUrl = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + token;
            
            ResponseEntity<Map> response = restTemplate.getForEntity(fbUrl, Map.class);
            Map<String, Object> fbUser = response.getBody();

            if (fbUser == null || fbUser.get("id") == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mã xác thực Facebook không hợp lệ!");
            }

            String fbId = (String) fbUser.get("id");
            String name = (String) fbUser.get("name");
            String email = fbUser.get("email") != null ? (String) fbUser.get("email") : fbId + "@facebook.com";

            User user = userService.getUserByEmail(email);

            if (user == null) {
                user = new User();
                user.setUserName("FB_" + fbId); 
                user.setEmail(email);
                user.setUserPassword(""); 
                user.setActive(1);
                userService.saveUser(user); 
            } else if (user.getActive() == 0) {
                 return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản đã bị khóa!");
            }

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("id", user.getId());
            responseData.put("userName", name);
            responseData.put("email", user.getEmail());

            return ResponseEntity.ok(responseData);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống khi xử lý Facebook: " + e.getMessage());
        }
    }

    // ================= API CRUD DÀNH CHO TRANG QUẢN TRỊ (ADMIN) =================

    @GetMapping(value = "/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (!users.isEmpty()) {
            List<UserDTO> dtos = users.stream().map(this::mapToDTO).collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping(value = "/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping(value = "/users")
    public ResponseEntity<?> addUser(@RequestBody UserDTO dto) {
        try {
            User user = new User();
            String name = dto.getUserName() != null ? dto.getUserName() : dto.getUsername();
            user.setUserName(name);
            user.setEmail(dto.getEmail());
            user.setUserPassword(dto.getPassword() != null ? dto.getPassword() : "123456");
            user.setActive(dto.getIsActive() != null && dto.getIsActive() ? 1 : 0);

            UserRole role = new UserRole();
            role.setRoleName(dto.getRole() != null ? dto.getRole() : "Khách hàng");
            user.setRole(role);

            UserDetails details = new UserDetails();
            details.setFirstName(name); 
            details.setLastName(""); 
            details.setEmail(dto.getEmail()); 
            details.setPhoneNumber(dto.getPhone());
            details.setStreet(dto.getAddress());
            user.setUserDetails(details);

            User savedUser = userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToDTO(savedUser));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi Server: " + e.getMessage());
        }
    }

    @PutMapping(value = "/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") Long id, @RequestBody UserDTO dto) {
        User existingUser = userService.getUserById(id);
        if (existingUser != null) {
            try {
                String name = dto.getUserName() != null ? dto.getUserName() : dto.getUsername();
                if (name != null) existingUser.setUserName(name);
                if (dto.getEmail() != null) existingUser.setEmail(dto.getEmail());
                
                if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
                    existingUser.setUserPassword(dto.getPassword());
                }
                if (dto.getIsActive() != null) {
                    existingUser.setActive(dto.getIsActive() ? 1 : 0);
                }

                if (dto.getRole() != null) {
                    UserRole role = new UserRole();
                    role.setRoleName(dto.getRole());
                    existingUser.setRole(role);
                }

                UserDetails details = existingUser.getUserDetails();
                if (details == null) {
                    details = new UserDetails();
                    details.setFirstName(existingUser.getUserName());
                    details.setLastName("");
                }
                details.setEmail(existingUser.getEmail()); 
                if (dto.getPhone() != null) details.setPhoneNumber(dto.getPhone());
                if (dto.getAddress() != null) details.setStreet(dto.getAddress());
                existingUser.setUserDetails(details);

                User savedUser = userService.saveUser(existingUser);
                return ResponseEntity.ok(mapToDTO(savedUser));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi Server: " + e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping(value = "/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            try {
                userService.deleteUser(id);
                return ResponseEntity.ok().build();
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}