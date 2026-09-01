import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const sora = loadSora("normal", { weights: ["600", "700"], subsets: ["latin"] });
const inter = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const FONT_DISPLAY = `${sora.fontFamily}, sans-serif`;
export const FONT_BODY = `${inter.fontFamily}, sans-serif`;

export const C = {
  bg: "#0B0D11",
  bgSoft: "#141821",
  ink: "#F4F1EC",
  muted: "#9AA3B2",
  ember: "#F97316",
  emberSoft: "#FDBA74",
  line: "rgba(255,255,255,0.08)",
};
