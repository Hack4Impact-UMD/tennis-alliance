import { logOut, updateUserPassword } from "@/backend/AuthCalls";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "../../../auth/AuthProvider";
import Loading from "../../../components/LoadingScreen/Loading";
import styles from "./ChangePassword.module.css";

type Fields = {
  oldPassword: string;
  newPassword: string;
  newConfirmPassword: string;
};
type Status = {
  loading: boolean;
  error: boolean;
  errorMessage: string;
};

const ChangePassword = ({ open, handleClose }: any) => {
  const auth = useAuth();
  const router = useRouter();
  const style = {
    width: "250px",
    padding: "10px 10px 10px 10px",
    fontFamily: "'Inter', sans-serif",
    height: "14px !important",
  };
  const [fields, setFields] = useState<Fields>({
    oldPassword: "",
    newPassword: "",
    newConfirmPassword: "",
  });
  const [status, setStatus] = useState<Status>({
    loading: false,
    error: false,
    errorMessage: "",
  });
  const [showPassword, setShowPassword] = useState<{
    showOldPass: boolean;
    showNewPass: boolean;
    showNewConfirmPass: boolean;
  }>({ showOldPass: false, showNewPass: false, showNewConfirmPass: false });

  const handleSubmit = () => {
    setStatus({ ...status, loading: true });
    if (fields.newPassword != fields.newConfirmPassword) {
      setStatus({
        error: true,
        loading: false,
        errorMessage: "Passwords do not match",
      });
    } else {
      updateUserPassword(fields.newPassword, fields.oldPassword)
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
      oldPassword: "",
      newPassword: "",
      newConfirmPassword: "",
    });
    setStatus({ loading: false, error: false, errorMessage: "" });
    setShowPassword({
      showOldPass: false,
      showNewPass: false,
      showNewConfirmPass: false,
    });
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
              Password updated successfully. You will now be redirected to the
              login page.
            </div>
          ) : (
            <>
              <p className={styles.header}>Update Password</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
                className={styles.form}
              >
                <TextField
                  required
                  label="Current Password"
                  placeholder="Enter Current Password"
                  type={showPassword.showOldPass ? "text" : "password"}
                  value={fields.oldPassword}
                  onChange={(event) => {
                    setFields({ ...fields, oldPassword: event.target.value });
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              showOldPass: !showPassword.showOldPass,
                            })
                          }
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
                <TextField
                  required
                  label="New Password"
                  placeholder="Enter New Password"
                  type={showPassword.showNewPass ? "text" : "password"}
                  value={fields.newPassword}
                  onChange={(event) => {
                    setFields({ ...fields, newPassword: event.target.value });
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              showNewPass: !showPassword.showNewPass,
                            })
                          }
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
                <TextField
                  required
                  label="Confirm New Password"
                  placeholder="Re-Enter New Password"
                  type={showPassword.showNewConfirmPass ? "text" : "password"}
                  value={fields.newConfirmPassword}
                  onChange={(event) => {
                    setFields({
                      ...fields,
                      newConfirmPassword: event.target.value,
                    });
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              showNewConfirmPass:
                                !showPassword.showNewConfirmPass,
                            })
                          }
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
                  <div className={styles.loadingMargin}>
                    {" "}
                    <Loading />
                  </div>
                ) : (
                  <Button
                    type="submit"
                    variant="outlined"
                    className={styles.submitButton}
                  >
                    Change Password
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
export default ChangePassword;
