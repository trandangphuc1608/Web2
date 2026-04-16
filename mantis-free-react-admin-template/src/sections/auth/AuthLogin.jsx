import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Dùng để chuyển trang sau khi đăng nhập thành công
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '', // Để trống cho người dùng nhập
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().max(255).required('Tên đăng nhập / Email là bắt buộc'),
          password: Yup.string().max(255).required('Mật khẩu là bắt buộc')
        })}
        
        // ĐÃ THÊM: Logic xử lý khi bấm nút Đăng nhập
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // Gọi API Đăng nhập với đường dẫn accounts chuẩn
            const response = await fetch('http://localhost:8900/api/accounts/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              // Backend Spring Boot của bạn mong đợi 'userName' thay vì 'email'
              body: JSON.stringify({
                userName: values.email, 
                password: values.password
              })
            });

            if (response.ok) {
              const userData = await response.json();
              
              // Lưu thông tin vào LocalStorage để duy trì đăng nhập
              localStorage.setItem('user_info', JSON.stringify(userData));
              
              setStatus({ success: true });
              setSubmitting(false);
              
              // Chuyển hướng vào trang chủ Admin / Dashboard
              alert('Đăng nhập thành công!');
              navigate('/admin'); // <--- Sửa đường dẫn này nếu trang chủ của bạn khác
              
            } else {
              // Bắt lỗi 401 hoặc lỗi khác từ Server
              setStatus({ success: false });
              setErrors({ submit: 'Tài khoản hoặc mật khẩu không chính xác!' });
              setSubmitting(false);
            }
          } catch (err) {
            console.error('Lỗi kết nối:', err);
            setStatus({ success: false });
            setErrors({ submit: 'Lỗi kết nối đến máy chủ. Vui lòng thử lại!' });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          // ĐÃ SỬA: Gắn sự kiện handleSubmit vào form
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="email-login">Tên hiển thị (Username)</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="text"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Nhập tên đăng nhập"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-login">Mật khẩu</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Nhập mật khẩu"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>
              
              <Grid sx={{ mt: -1 }} size={12}>
                <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Ghi nhớ đăng nhập</Typography>}
                  />
                  <Link variant="h6" component={RouterLink} to="#" color="text.primary">
                    Quên mật khẩu?
                  </Link>
                </Stack>
              </Grid>

              {/* ĐÃ THÊM: Hiển thị thông báo lỗi nếu sai pass hoặc lỗi mạng */}
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error sx={{ textAlign: 'center', fontSize: '14px' }}>
                    {errors.submit}
                  </FormHelperText>
                </Grid>
              )}

              <Grid size={12}>
                <AnimateButton>
                  {/* ĐÃ SỬA: Thêm type="submit" và disabled khi đang gọi API */}
                  <Button 
                    disableElevation 
                    disabled={isSubmitting} 
                    fullWidth 
                    size="large" 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'VÀO CỬA HÀNG'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };