import { useRouter } from "next/router";
import React from "react";
import Loading from "../../components/LoadingScreen/Loading";
import { AuthProvider, useAuth } from "../AuthProvider";
import styles from "./RequireAuth.module.css";

interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const authContext = useAuth();
  if (authContext.loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />;
      </div>
    );
  } else if (!authContext.user) {
    console.log("User is not authenticated");
    router.push("/login");
    return null;
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default RequireAuth;
