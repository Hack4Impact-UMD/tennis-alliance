import { logOut } from "@/backend/AuthCalls";
import { updateUserEmail } from "@/backend/CloudFunctionsCalls";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../../auth/AuthProvider";
import Loading from "../../../components/LoadingScreen/Loading";
import styles from "./ChangeEmail.module.css";

type Fields = {
  email: string;
  emailConfirm: string;
  password: string;
};
type Status = {
  loading: boolean;
  error: boolean;
  errorMessage: string;
};

const ChangeEmail = ({ open, handleClose }: any) => {
  const auth = useAuth();

  const style = {
    width: "250px",
    padding: "10px 10px 10px 10px",
    fontFamily: "'Inter', sans-serif",
    height: "14px !important",
  };
  const [fields, setFields] = useState<Fields>({
    email: "",
    emailConfirm: "",
    password: "",
  });
  const [status, setStatus] = useState<Status>({
    loading: false,
    error: false,
    errorMessage: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = () => {
    setStatus({ ...status, loading: true });
    if (fields.email != fields.emailConfirm) {
      setStatus({
        error: true,
        loading: false,
        errorMessage: "Emails do not match",
      });
    } else {
      updateUserEmail(auth.user.email!, fields.emailConfirm, fields.password)
        .then(() =>
          setStatus({ ...status, loading: false, errorMessage: "none" })
        )
        .catch((error) => {
          setStatus({
            error: true,
            errorMessage: error,
            loading: false,
          });
        });
    }
  };
  const handleFullClose = () => {
    setFields({
      email: "",
      emailConfirm: "",
      password: "",
    });
    setStatus({ loading: false, error: false, errorMessage: "" });
    setShowPassword(false);
    handleClose();
    if (!status.error && status.errorMessage == "none") {
      logOut()
        .catch((error) => {})
        .finally(() => window.location.reload());
    }
  };
  return (
    <>
      <Modal open={open} onClose={handleFullClose}>
        <Paper className={styles.background}>
          {status.error ? (
            <div className={styles.center}>{status.errorMessage}</div>
          ) : status.errorMessage == "none" ? (
            <div className={styles.center}>
              Email updated successfully. You will now be redirected to the
              login page.
            </div>
          ) : (
            <>
              <p className={styles.header}>Update Email</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
                className={styles.form}
              >
                <TextField
                  required
                  label="Email"
                  placeholder="Enter Email"
                  type="email"
                  value={fields.email}
                  onChange={(event) => {
                    setFields({ ...fields, email: event.target.value });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                  }}
                  className={styles.muInput}
                />
                <TextField
                  required
                  label="Confirm Email"
                  placeholder="Re-enter Email"
                  type="email"
                  value={fields.emailConfirm}
                  onChange={(event) => {
                    setFields({ ...fields, emailConfirm: event.target.value });
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    style,
                  }}
                  className={styles.muiInput}
                />

                <TextField
                  required
                  label="Password"
                  placeholder="Enter Password"
                  type={showPassword ? "text" : "password"}
                  value={fields.password}
                  onChange={(event) => {
                    setFields({ ...fields, password: event.target.value });
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    style,
                  }}
                  className={styles.passwordStyling}
                ></TextField>
                {status.loading ? (
                  <Loading />
                ) : (
                  <Button
                    type="submit"
                    variant="outlined"
                    className={styles.submitButton}
                  >
                    Change Email
                  </Button>
                )}
              </form>
            </>
          )}
        </Paper>
      </Modal>
    </>
  );
};
export default ChangeEmail;
