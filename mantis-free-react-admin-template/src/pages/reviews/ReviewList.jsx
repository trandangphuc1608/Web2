import React, { useState, useEffect } from "react";
import {
  Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Chip, Typography, IconButton, Tooltip
} from "@mui/material";
import { DeleteOutlined } from "@ant-design/icons";
import MainCard from 'components/MainCard';
import { API_URL } from 'config';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const primaryColor = '#ff4d4f';

  const fetchReviews = () => {
    const timestamp = new Date().getTime();
    fetch(`${API_URL}/api/recommendation/reviews?t=${timestamp}`)
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi API");
        return res.json();
      })
      .then((data) => {
        let actualData = [];
        if (Array.isArray(data)) actualData = data;
        else if (data && Array.isArray(data.data)) actualData = data.data;
        else if (data && data._embedded && Array.isArray(data._embedded.reviews)) actualData = data._embedded.reviews;
        else if (data && Array.isArray(data.content)) actualData = data.content;

        setReviews(actualData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách đánh giá:", err);
        setReviews([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
      fetch(`${API_URL}/api/recommendation/reviews/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            alert("Xóa đánh giá thành công!");
            setReviews(reviews.filter((review) => review.id !== id));
          } else {
            alert("Có lỗi xảy ra khi xóa!");
          }
        })
        .catch((err) => console.error("Lỗi xóa đánh giá:", err));
    }
  };

  return (
    <MainCard title="Hệ Thống Quản Lý Đánh Giá">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress sx={{ color: primaryColor }} />
        </Box>
      ) : reviews.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: 'center', border: '1px solid #f0f0f0', borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary">
            Chưa có đánh giá nào trên hệ thống.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
          <Table sx={{ minWidth: 650 }} aria-label="Bảng đánh giá">
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell align="center" width="80">ID</TableCell>
                <TableCell width="150">Khách hàng</TableCell>
                <TableCell align="center" width="120">ID Món Ăn</TableCell>
                <TableCell align="center" width="100">Số Sao</TableCell>
                <TableCell width="300">Nội dung</TableCell>
                <TableCell width="120">Ngày đăng</TableCell>
                <TableCell align="center" width="100">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <TableRow 
                    key={review.id} 
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    {review.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{review.author}</TableCell>
                  <TableCell align="center">
                    <Chip 
                        label={`#${review.productId}`} 
                        size="small" 
                        sx={{ fontWeight: 'bold', bgcolor: '#e6f7ff', color: '#1890ff' }} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 'bold', color: '#faaf00', fontSize: '1rem' }}>
                      {review.rating} ⭐
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#555' }}>{review.text}</TableCell>
                  <TableCell sx={{ color: '#888' }}>{review.date}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xóa">
                        <IconButton color="error" onClick={() => handleDelete(review.id)}>
                            <DeleteOutlined />
                        </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </MainCard>
  );
};

export default ReviewList;