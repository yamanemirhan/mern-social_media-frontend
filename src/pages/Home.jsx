import Posts from "../components/Posts";
import StoriesSlider from "../components/StoriesSlider";
import { useSelector } from "react-redux";

function Home() {
  const { posts } = useSelector((state) => state.post);

  return (
    <div className="max-w-[1200px] mx-auto py-5">
      {/* <StoriesSlider /> */}
      <div className="p-1">
        <h2 className="mt-8 mb-4 text-2xl">Feeds</h2>
        <Posts posts={posts} />
      </div>
    </div>
  );
}

export default Home;
