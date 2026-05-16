import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    Container, Grid, Typography, Button, Box, Paper, 
    IconButton, Rating, Divider, Skeleton, Alert, Card, CardMedia, CardContent, CardActions, Chip,
    Tabs, Tab, Avatar, TextField, Select, MenuItem, FormControl
} from '@mui/material';
import { 
    ShoppingCartOutlined, ArrowLeftOutlined, 
    PlusOutlined, MinusOutlined, FireFilled, LikeOutlined, EditOutlined
} from '@ant-design/icons';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    
    const [quantity, setQuantity] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [editingReviewId, setEditingReviewId] = useState(null);

    const [filterStar, setFilterStar] = useState(0);
    const [sortBy, setSortBy] = useState("newest");

    const primaryColor = '#ff4d4f'; 
    const hoverColor = '#d9363e';

    const user_info = JSON.parse(localStorage.getItem("user_info"));
    const currentUserName = user_info ? (user_info.userName || user_info.name || user_info.username) : "Khách Hàng";

    const getValidImage = (url) => {
        if (!url) return 'https://placehold.co/400x400?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:image')) return url;
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        const finalPath = cleanPath.startsWith('uploads/') ? cleanPath : `uploads/${cleanPath}`;
        return `http://localhost:8900/api/catalog/${finalPath}`;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        setError(null);
        setQuantity(1);
        setReviewText("");
        setEditingReviewId(null);

        const fetchProduct = fetch(`http://localhost:8900/api/catalog/products/${id}`).then(res => {
            if (!res.ok) throw new Error('Không tìm thấy sản phẩm này!');
            return res.json();
        });

        const fetchAll = fetch(`http://localhost:8900/api/catalog/products`).then(res => res.ok ? res.json() : []);

        const fetchReviews = fetch(`http://localhost:8900/api/recommendation/products/${id}/reviews`)
            .then(res => res.ok ? res.json() : []).catch(() => []); 

        // GỌI API ĐỀ XUẤT TỪ BACKEND
        const fetchRecommendations = fetch(`http://localhost:8900/api/recommendation/products/${id}/recommendations`)
            .then(res => res.ok ? res.json() : []).catch(() => []);

        Promise.all([fetchProduct, fetchAll, fetchReviews, fetchRecommendations])
            .then(([prodData, allData, reviewsData, recommendedIds]) => {
                setProduct(prodData);
                
                let actualAll = [];
                if (Array.isArray(allData)) actualAll = allData;
                else if (allData && Array.isArray(allData.data)) actualAll = allData.data;
                else if (allData && allData._embedded && Array.isArray(allData._embedded.products)) actualAll = allData._embedded.products;
                else if (allData && Array.isArray(allData.content)) actualAll = allData.content;

                // LOGIC ĐỀ XUẤT SẢN PHẨM
                let related = [];
                if (recommendedIds && recommendedIds.length > 0) {
                    // Nếu có đề xuất từ Backend (Top Rated)
                    related = actualAll.filter(item => recommendedIds.includes(Number(item.id || item.productId)));
                } else {
                    // Fallback: Mặc định đề xuất món cùng danh mục nếu CSDL trống
                    related = actualAll.filter(item => {
                        const itemId = (item.id || item.productId).toString();
                        return itemId !== id && item.category === prodData.category;
                    }).slice(0, 4);
                }

                setRelatedProducts(related);
                setReviews(Array.isArray(reviewsData) ? reviewsData : []);
            })
            .catch(err => setError(err.message || "Lỗi kết nối đến máy chủ"))
            .finally(() => setLoading(false));
    }, [id]);

    // --- ĐÃ FIX: THÊM LẠI 2 HÀM TĂNG GIẢM SỐ LƯỢNG BỊ THIẾU ---
    const handleDecrease = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
    const handleIncrease = () => setQuantity(prev => prev < 20 ? prev + 1 : 20);

    const handleAddToCart = (e, customProduct = product, customQty = quantity) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        let cart = JSON.parse(localStorage.getItem('rainbow_cart')) || [];
        const productRealId = customProduct.id || customProduct.productId;
        const index = cart.findIndex(item => (item.product.id || item.product.productId) === productRealId);

        if (index >= 0) cart[index].quantity += customQty;
        else cart.push({ product: customProduct, quantity: customQty });

        localStorage.setItem('rainbow_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated')); 
        alert(`Đã thêm ${customQty} phần "${customProduct.productName || customProduct.name}" vào giỏ hàng!`);
    };

    const submitReviewHandler = () => {
        if (!reviewText.trim()) {
            alert("Vui lòng nhập nội dung đánh giá!");
            return;
        }

        const payload = {
            author: currentUserName,
            rating: reviewRating,
            text: reviewText
        };

        const url = editingReviewId 
            ? `http://localhost:8900/api/recommendation/reviews/${editingReviewId}`
            : `http://localhost:8900/api/recommendation/products/${id}/reviews`;

        fetch(url, {
            method: editingReviewId ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error("Lỗi mạng");
        })
        .then(data => {
            if (editingReviewId) {
                setReviews(reviews.map(r => r.id === editingReviewId ? data : r));
                alert("Đã cập nhật đánh giá!");
            } else {
                setReviews([...reviews, data]);
                alert("Đã gửi đánh giá thành công!");
            }
            setReviewText(""); 
            setReviewRating(5);
            setEditingReviewId(null);
        })
        .catch(err => {
            console.error(err);
            // Fallback offline (Fake UI update)
            const localReview = editingReviewId 
                ? { ...payload, id: editingReviewId, date: "Vừa xong", isEdited: true } 
                : { ...payload, id: Date.now(), date: "Vừa xong" };
            
            if (editingReviewId) {
                setReviews(reviews.map(r => r.id === editingReviewId ? localReview : r));
            } else {
                setReviews([...reviews, localReview]);
            }
            setReviewText("");
            setEditingReviewId(null);
        });
    };

    const handleHelpfulVote = (reviewId) => {
        fetch(`http://localhost:8900/api/recommendation/reviews/${reviewId}/helpful`, { method: 'PUT' })
        .then(res => res.json())
        .then(data => {
            setReviews(reviews.map(r => r.id === reviewId ? { ...r, helpfulCount: data.helpfulCount } : r));
        })
        .catch(() => alert("Lỗi khi vote hữu ích!"));
    };

    const triggerEditReview = (rev) => {
        setEditingReviewId(rev.id);
        setReviewText(rev.text || rev.comment || "");
        setReviewRating(rev.rating || 5);
        document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((sum, rev) => sum + (rev.rating || 5), 0) / reviews.length).toFixed(1) 
        : 5.0;

    const processedReviews = reviews
        .filter(rev => filterStar === 0 || Math.floor(rev.rating || 5) === filterStar)
        .sort((a, b) => {
            if (sortBy === 'helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
            return (b.id || Date.now()) - (a.id || Date.now()); // newest
        });

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center' }}><Skeleton variant="rounded" width={300} height={300} /></Grid>
                        <Grid item xs={12} sm={7}><Skeleton variant="text" height={60} width="90%" /><Skeleton variant="rectangular" height={100} sx={{ mt: 3, borderRadius: 2 }} /></Grid>
                    </Grid>
                </Paper>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
                <Button variant="contained" component={Link} to="/" sx={{ bgcolor: primaryColor }}>Quay về thực đơn</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button startIcon={<ArrowLeftOutlined />} onClick={() => navigate('/')} sx={{ mb: 2, color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}>
                Quay lại thực đơn
            </Button>

            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid #f0f0f0', mb: 5 }}>
                <Grid container spacing={4} alignItems="flex-start">
                    <Grid item xs={12} sm={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box component="img" src={getValidImage(product.imageUrl || product.image || product.picture)} alt={product.productName || product.name} sx={{ width: '100%', maxWidth: '400px', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 3, border: '1px solid #f0f0f0', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }} />
                    </Grid>
                    <Grid item xs={12} sm={7} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{product.productName || product.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="#faaf00">{avgRating}</Typography>
                            <Rating value={parseFloat(avgRating)} precision={0.1} readOnly size="small" sx={{ color: '#faaf00' }}/>
                            <Typography variant="body2" color="text.secondary">({reviews.length} đánh giá)</Typography>
                            <Chip icon={<FireFilled style={{ color: '#fff' }}/>} label="Best Seller" size="small" sx={{ bgcolor: '#ff4d4f', color: '#fff', fontWeight: 'bold', ml: 1, border: 'none' }} />
                            <Chip label={product.category || "Thức ăn"} size="small" sx={{ ml: 1 }} />
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: primaryColor, mb: 2 }}>{(product.price || 0).toLocaleString('vi-VN')} ₫</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{product.description || 'Món ăn hấp dẫn, giòn rụm và giao nhanh tận nơi trong vòng 30 phút!'}</Typography>
                        <Divider sx={{ mb: 3, width: '100%' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 2 }}>
                                <IconButton onClick={handleDecrease}><MinusOutlined /></IconButton>
                                <Typography sx={{ px: 2, fontWeight: 'bold' }}>{quantity}</Typography>
                                <IconButton onClick={handleIncrease}><PlusOutlined /></IconButton>
                            </Box>
                            <Button variant="contained" startIcon={<ShoppingCartOutlined />} onClick={(e) => handleAddToCart(e, product, quantity)} sx={{ flexGrow: 1, bgcolor: primaryColor, textTransform: 'none', fontSize: '1.1rem', py: 1.2, '&:hover': { bgcolor: hoverColor } }}>
                                Thêm {((product.price || 0) * quantity).toLocaleString('vi-VN')} ₫
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* TAB MÔ TẢ VÀ ĐÁNH GIÁ */}
            <Box sx={{ mb: 6 }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3, borderBottom: '1px solid #f0f0f0' }} TabIndicatorProps={{ style: { backgroundColor: primaryColor } }}>
                    <Tab label="Mô tả món ăn" sx={{ fontWeight: 'bold', fontSize: '1rem', '&.Mui-selected': { color: primaryColor } }} />
                    <Tab label={`Đánh giá (${reviews.length})`} sx={{ fontWeight: 'bold', fontSize: '1rem', '&.Mui-selected': { color: primaryColor } }} />
                </Tabs>

                {tabValue === 0 && (
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.05rem', color: '#444' }}>
                            {product.description || 'Hương vị tuyệt hảo được chế biến từ những nguyên liệu tươi ngon nhất. Đóng gói cẩn thận, mang đến cho bạn bữa ăn trọn vị và cảm xúc.'}
                        </Typography>
                    </Paper>
                )}

                {tabValue === 1 && (
                    <Box>
                        {reviews.length > 0 && (
                            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                                <Typography variant="body2" fontWeight="bold">Lọc:</Typography>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <Select value={filterStar} onChange={(e) => setFilterStar(e.target.value)} displayEmpty>
                                        <MenuItem value={0}>Tất cả</MenuItem>
                                        {[5, 4, 3, 2, 1].map(star => <MenuItem key={star} value={star}>{star} Sao</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <MenuItem value="newest">Mới nhất</MenuItem>
                                        <MenuItem value="helpful">Hữu ích nhất</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        )}

                        {processedReviews.length === 0 ? (
                            <Typography color="text.secondary" sx={{ mb: 3 }}>Chưa có đánh giá nào phù hợp. Hãy là người đầu tiên nhận xét!</Typography>
                        ) : (
                            processedReviews.map((rev, idx) => (
                                <Paper key={idx} elevation={0} sx={{ p: 3, mb: 2, borderRadius: 3, border: '1px solid #f0f0f0' }}>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: primaryColor }}>{(rev.author || 'U').charAt(0)}</Avatar>
                                        <Box sx={{ width: '100%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{rev.author || 'Khách hàng'}</Typography>
                                                {rev.isEdited && <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>(Đã chỉnh sửa)</Typography>}
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Rating value={rev.rating || 5} readOnly size="small" />
                                                <Typography variant="caption" color="text.secondary">{rev.date}</Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ mb: 2 }}>{rev.text || rev.comment}</Typography>
                                            
                                            <Box display="flex" gap={2}>
                                                <Button size="small" startIcon={<LikeOutlined />} onClick={() => handleHelpfulVote(rev.id)} sx={{ color: 'text.secondary', textTransform: 'none' }}>
                                                    Hữu ích ({rev.helpfulCount || 0})
                                                </Button>
                                                {rev.author === currentUserName && (
                                                    <Button size="small" startIcon={<EditOutlined />} onClick={() => triggerEditReview(rev)} sx={{ color: primaryColor, textTransform: 'none' }}>
                                                        Sửa
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            ))
                        )}
                        
                        <Paper id="review-form" elevation={0} sx={{ p: 4, mt: 4, borderRadius: 4, bgcolor: '#f8f9fa' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                {editingReviewId ? "Chỉnh sửa đánh giá" : "Viết đánh giá của bạn"}
                            </Typography>
                            <Rating value={reviewRating} onChange={(e, newValue) => setReviewRating(newValue)} size="large" sx={{ mb: 2 }} />
                            <TextField fullWidth multiline rows={3} placeholder="Chia sẻ cảm nhận của bạn về món ăn này nhé..." sx={{ mb: 3, bgcolor: '#fff' }} value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="contained" onClick={submitReviewHandler} sx={{ bgcolor: '#212121', color: '#fff', '&:hover': { bgcolor: '#000' } }}>
                                    {editingReviewId ? "Cập Nhật" : "Gửi Đánh Giá"}
                                </Button>
                                {editingReviewId && (
                                    <Button variant="outlined" onClick={() => { setEditingReviewId(null); setReviewText(""); setReviewRating(5); }}>
                                        Hủy
                                    </Button>
                                )}
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Box>

            {relatedProducts.length > 0 && (
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Có thể bạn sẽ thích</Typography>
                    <Grid container spacing={2}> 
                        {relatedProducts.map((item) => {
                            const itemId = item.id || item.productId;
                            return (
                                <Grid item xs={12} sm={6} md={3} lg={3} key={itemId} sx={{ display: 'flex' }}>
                                    <Card sx={{ display: 'flex', flexDirection: 'column', width: '100%', borderRadius: 2, transition: 'all 0.3s ease', border: '1px solid #f0f0f0', boxShadow: 'none', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 24px rgba(255, 77, 79, 0.15)' } }}>
                                        <Box component={Link} to={`/product/${itemId}`} sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                            <Box sx={{ overflow: 'hidden', width: '100%', aspectRatio: '4 / 3', maxHeight: 195 }}>
                                                <CardMedia component="img" image={getValidImage(item.imageUrl || item.image || item.picture)} alt={item.productName || item.name} sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                                            </Box>
                                            <CardContent sx={{ flexGrow: 1, p: 1.5, pb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.8rem' }}>{item.productName || item.name}</Typography>
                                                <Chip label={`${(item.price || 0).toLocaleString('vi-VN')} ₫`} size="small" sx={{ fontWeight: 800, bgcolor: '#fff1f0', color: primaryColor }} />
                                            </CardContent>
                                        </Box>
                                        <CardActions sx={{ p: 1.5, pt: 0 }}>
                                            <Button variant="contained" fullWidth size="small" startIcon={<ShoppingCartOutlined />} onClick={(e) => handleAddToCart(e, item, 1)} sx={{ bgcolor: primaryColor, fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: hoverColor } }}>
                                                Thêm vào giỏ
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            )}
        </Container>
    );
}