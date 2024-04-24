import { useEffect } from "react";

const withPlayerHandling = (WrappedComponent) => {
  const WithPlayerHandling = (props) => {
    useEffect(() => {
      const handleRouteChange = () => {
        // Ваш код для остановки проигрывания и очистки плеера при переходе на другую страницу
        // Например, вызовите функцию для остановки проигрывания и очистки состояния плеера из Redux
      };

      // Добавляем слушателя события для перехвата переходов между страницами
      window.addEventListener("beforeunload", handleRouteChange);

      return () => {
        // Удаляем слушателя события при размонтировании компонента
        window.removeEventListener("beforeunload", handleRouteChange);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  return WithPlayerHandling;
};

export default withPlayerHandling;
