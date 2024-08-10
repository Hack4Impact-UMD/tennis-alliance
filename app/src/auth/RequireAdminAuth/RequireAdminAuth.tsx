import { useRouter } from "next/router";
import React from "react";
import Loading from "../../components/LoadingScreen/Loading";
import { AuthProvider, useAuth } from "../AuthProvider";
import styles from "./RequireAdminAuth.module.css";

interface Props {
  children: JSX.Element;
}

const RequireAdminAuth: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const authContext = useAuth();
  if (authContext.loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />;
      </div>
    );
  } else if (
    !authContext.user &&
    authContext.token?.claims.role!.toString().toUpperCase() !== "ADMIN"
  ) {
    router.push("/login");
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default RequireAdminAuth;
