@echo off
echo Dang khoi dong he thong Microservices...

echo 1. Khoi dong Eureka Server...
start "Eureka Server" cmd /k "cd eureka-server && .\mvnw spring-boot:run"

echo Doi 20 giay de Eureka san sang...
timeout /t 20

echo 2. Khoi dong cac Services con lai...
start "API Gateway" cmd /k "cd api-gateway && .\mvnw spring-boot:run"
start "User Service" cmd /k "cd user-service && .\mvnw spring-boot:run"
start "Product Catalog" cmd /k "cd product-catalog-service && .\mvnw spring-boot:run"
start "Product Recommendation" cmd /k "cd product-recommendation-service && .\mvnw spring-boot:run"
start "Order Service" cmd /k "cd order-service && .\mvnw spring-boot:run"
start "Shipping Service" cmd /k "cd shipping-service && .\mvnw spring-boot:run"

echo Hoan thanh lenh goi! Cac cua so dang khoi dong.