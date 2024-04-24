import { useState } from "react";
import axios from "axios";
import styles from "./Login.module.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        username,
        password,
      });
      const accessToken = response.data.access_token;
      // Сохранение токена в cookies
      document.cookie = `access_token=${accessToken}; path=/`;
      // Перенаправление на другую страницу после успешного входа
      window.location.href = "/"; // Замените '/' на ваш URL
    } catch (error) {
      setError("Неверное имя пользователя или пароль");
    }
  };

  return (
    <section className={styles.login}>
      <div className={styles["login-container"]}>
        <h2>Страница входа</h2>
        <div>{error && <p>{error}</p>}</div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            type="text"
            value={username}
            placeholder="Логин"
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
          <input
            type="password"
            value={password}
            placeholder="Пароль"
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Войти
          </button>
        </form>
        <div>
          <p style={{ textAlign: "center" }}>
            Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
