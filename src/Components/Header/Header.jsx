import { Link } from "react-router-dom";
import styles from "./Header.module.scss";

const Header = () => {
  // Функция для чтения accessToken из cookie
  const getAccessToken = () => {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === "access_token") {
        return cookie[1];
      }
    }
    return null;
  };

  // Получаем accessToken из cookie
  const accessToken = getAccessToken();

  // Функция для удаления cookie
  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Обработчик выхода из системы
  const handleLogout = () => {
    // Удаляем accessToken из cookie
    deleteCookie("access_token");
    // Дополнительные действия, если необходимо
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        LowHat
      </Link>
      {accessToken ? (
        <button className={styles.accountLink} onClick={handleLogout}>
          Выйти
        </button>
      ) : (
        <Link to="/login" className={styles.accountLink}>
          Войти
        </Link>
      )}
    </header>
  );
};

export default Header;
