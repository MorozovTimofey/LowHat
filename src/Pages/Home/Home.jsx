import TracksSection from "../../Components/TracksSection/TracksSection";
import withPlayerHandling from "../../HOC/withPlayerHandling";

const Home = () => {
  return <TracksSection />;
};

export default withPlayerHandling(Home);
