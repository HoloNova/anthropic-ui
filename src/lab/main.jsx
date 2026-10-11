import { createRoot } from "react-dom/client";
import { Lab } from "./Lab.jsx";
import "../styles/foundation-1.css";
import "../styles/anthropicsans_dce02d96-module.css";
import "../styles/anthropicserif_e7e46c4-module.css";
import "../styles/anthropicmono_fae19af3-module.css";
import "../styles/foundation-2.css";
import "../styles/foundation-3.css";
import "../styles/ShareStrokes.css";
import "../styles/DropCap.css";
import "./lab.css";
import "./lab-demo.css";
import "./preview.css";

// 图鉴页是独立入口（component/index.html），不影响文章页。
// 这里复用 foundation 的设计变量与三个本地字体族，所以它看起来和文章页是同一套语言。
createRoot(document.querySelector("#lab-root")).render(<Lab />);
