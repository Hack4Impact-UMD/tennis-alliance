import AdminDashboard from './admin-dashboard';
import RequireAdminAuth from '@/auth/RequireAdminAuth/RequireAdminAuth';

const Admin: React.FC = () => {
    return (
      <RequireAdminAuth>
        <div>
            <AdminDashboard />
        </div>
      </RequireAdminAuth>
    );
  };
  
  export default Admin;