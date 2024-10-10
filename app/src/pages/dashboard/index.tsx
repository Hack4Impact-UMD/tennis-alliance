import MyCalendar from '../../components/calendar-main';
import Image from "next/image";
import styles from '../../styles/dashboard.module.css';  // Use relative path

const App: React.FC = () => {
    return (
      <div>
        <div className = {styles.calendar}>
          <MyCalendar />
        </div>
      </div>
    );
  };
  
  export default App;