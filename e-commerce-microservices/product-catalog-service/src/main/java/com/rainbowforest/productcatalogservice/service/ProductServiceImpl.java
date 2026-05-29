package com.rainbowforest.productcatalogservice.service;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getAllProductByCategory(String category) {
        return productRepository.findAllByCategory(category);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.getOne(id);
    }

    @Override
    public List<Product> getAllProductsByName(String name) {
        return productRepository.findAllByProductName(name);
    }

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    @Override
    public void updateSoldCount(Long productId, int quantity) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            // Lấy số lượng đã bán hiện tại cộng thêm số lượng vừa khách vừa mua
            int currentSold = product.getSoldCount() != null ? product.getSoldCount() : 0;
            product.setSoldCount(currentSold + quantity);
            productRepository.save(product);
        }
    }

    @Override
    public void updateAverageRating(Long productId, Float rating) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product != null) {
            product.setAverageRating(rating);
            productRepository.save(product);
        }
    }
}
