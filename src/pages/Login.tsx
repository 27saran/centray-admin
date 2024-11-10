import { useState } from "react";
import { useFormik } from "formik";
import { InferType } from "yup";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, TextField, Snackbar, Typography } from "@mui/material";
import { Layout as AuthLayout } from "@/layouts/login/layout";
import yup from "@/lib/yup";
import { commonValidationSchema } from "@/utils/commonValidationSchema";
import { useLogin } from "@/features/login/hooks/useLogin";
import { PresentBoxRoles } from "@/layouts/nav/config";

// MEMO: InferTypeは、Yupスキーマから生成された型を取得するための型ユーティリティ
const loginSchema = yup.object(commonValidationSchema.login);
type FormType = InferType<typeof loginSchema>;

export const Login = () => {
  const { handleLogin } = useLogin();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const formik = useFormik<FormType>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const data = await handleLogin({
          admin: { email: values.email, password: values.password },
        });
        console.log('aaaaaaaaa: ', data);
        if (data !== null) {
          if (data.roles.some((role) => PresentBoxRoles.includes(role))) {
            navigate("/devices");
          } else if (data.roles.length > 0) {
            navigate("/master_tables");
          } else {
            setSnackbarMessage("このアカウントは使用(ログイン)できません。");
            setOpen(true);

            navigate("/login");
          }
        } else {
          setSnackbarMessage("ログインに失敗しました。メールアドレスとパスワードが正しいか確認してください。");
          setOpen(true);

          navigate("/login");
        }
      } catch (err) {
        alert(err);
      }
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AuthLayout>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                  variant="filled"
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                  variant="filled"
                />
              </Stack>
              <Button
                fullWidth
                size="large"
                sx={{ mt: 4 }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
      />
    </AuthLayout>
  );
};
