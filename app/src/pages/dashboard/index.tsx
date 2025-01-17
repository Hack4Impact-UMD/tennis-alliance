import MyCalendar from '../../components/calendar-main';
import Image from "next/image";
import styles from '../../styles/dashboard.module.css';  // Use relative path
import RequireAuth from '@/auth/RequireAuth/RequireAuth';

const Dashboard: React.FC = () => {
    return (
      <RequireAuth>
        <div>
          <div className = {styles.calendar}>
            <MyCalendar />
          </div>
        </div>
      </RequireAuth>
    );
  };
  
  export default Dashboard;