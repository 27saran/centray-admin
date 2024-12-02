import { TailSpin } from "react-loader-spinner";
import "@/components/Loader.css";

// ローディングコンポーネント
const Loader = () => {
  return (
    <div className="LoaderWrapper">
      <TailSpin height="100" width="100" color="#111927" ariaLabel="loading" />
    </div>
  );
};

export default Loader;
