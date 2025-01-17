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
    // Show a loading screen while authentication is being verified
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  if (!authContext.user) {
    // If the user is not authenticated, redirect to the login page
    router.push("/login");
    return null; // Prevent children from rendering
  }

  if (
    authContext.token?.claims.role?.toString().toUpperCase() !== "ADMIN"
  ) {
    // If the user is not an admin, redirect to the login page (or an error page)
    console.error("User does not have admin permissions");
    router.push("/login"); // Or handle with a different error page
    return null; // Prevent children from rendering
  }

  // Render the children only if the user is authenticated and an admin
  return <AuthProvider>{children}</AuthProvider>;
};

export default RequireAdminAuth;
