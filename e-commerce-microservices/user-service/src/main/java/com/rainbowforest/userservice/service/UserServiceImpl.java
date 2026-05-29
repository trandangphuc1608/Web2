package com.rainbowforest.userservice.service;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.entity.UserRole;
import com.rainbowforest.userservice.repository.UserRepository;
import com.rainbowforest.userservice.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        // Dùng findById thay cho getOne để tránh lỗi Lazy Initialization của Hibernate
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User getUserByName(String userName) {
        return userRepository.findByUserName(userName);
    }

    @Override
    public User saveUser(User user) {
        // ĐÃ NÂNG CẤP: Xử lý Role động, kiểm tra xem Role có trong CSDL chưa
        if (user.getRole() != null && user.getRole().getRoleName() != null) {
            UserRole existingRole = userRoleRepository.findUserRoleByRoleName(user.getRole().getRoleName());
            if (existingRole == null) {
                // Nếu chưa có (vd: tạo Shipper lần đầu), hệ thống tự sinh role mới
                existingRole = new UserRole();
                existingRole.setRoleName(user.getRole().getRoleName());
                existingRole = userRoleRepository.save(existingRole);
            }
            user.setRole(existingRole);
        } else {
            // Mặc định an toàn nếu hệ thống quên gửi quyền
            UserRole defaultRole = userRoleRepository.findUserRoleByRoleName("Khách hàng");
            if (defaultRole == null) {
                defaultRole = new UserRole();
                defaultRole.setRoleName("Khách hàng");
                defaultRole = userRoleRepository.save(defaultRole);
            }
            user.setRole(defaultRole);
        }

        // Đồng bộ id khóa ngoại cho bảng UserDetails
        if (user.getUserDetails() != null) {
            user.getUserDetails().setUser(user);
        }

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}