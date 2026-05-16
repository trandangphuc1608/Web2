package com.rainbowforest.userservice.controller;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // ================= API ĐĂNG KÝ & ĐĂNG NHẬP =================

    @PostMapping(value = "/register")
    public ResponseEntity<User> register(@RequestBody Map<String, String> payload) {
        String userName = payload.get("userName");
        String password = payload.get("password");
        String email = payload.get("email");

        if (userName == null || password == null || userName.trim().isEmpty() || password.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if (userService.getUserByName(userName.trim()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // 409: Tên đã tồn tại
        }

        User newUser = new User();
        newUser.setUserName(userName.trim());
        newUser.setUserPassword(password.trim());
        // Do DB bắt buộc có email nên nếu frontend không gửi, tạo 1 email ảo
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
        String userName = payload.get("userName");
        String password = payload.get("password");

        if (userName == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        User user = userService.getUserByName(userName.trim());

        // Kiểm tra user có tồn tại không và mật khẩu có khớp không
        if (user == null || !password.trim().equals(user.getUserPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401: Sai thông tin
        }

        return ResponseEntity.ok(user);
    }

    // ================= API CRUD =================

    @GetMapping(value = "/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (!users.isEmpty()) {
            return ResponseEntity.ok(users);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping(value = "/users", params = "name")
    public ResponseEntity<User> getUserByName(@RequestParam("name") String userName) {
        User user = userService.getUserByName(userName);
        if (user != null) {
            return ResponseEntity.ok(user);
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
    public ResponseEntity<User> addUser(@RequestBody User user) {
        if (user != null) {
            try {
                userService.saveUser(user);
                return ResponseEntity.status(HttpStatus.CREATED).body(user);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PutMapping(value = "/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") Long id, @RequestBody User user) {
        User existingUser = userService.getUserById(id);
        if (existingUser != null) {
            try {
                user.setId(id);
                userService.saveUser(user);
                return ResponseEntity.ok(user);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}