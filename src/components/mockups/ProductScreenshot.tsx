import Image from "next/image";
import BrowserMockup from "./BrowserMockup";
import DesktopMockup from "./DesktopMockup";
import LaptopMockup from "./LaptopMockup";
import TabletMockup from "./TabletMockup";
import PhoneMockup from "./PhoneMockup";
import DashboardIllustration from "../illustrations/DashboardIllustration";

type Frame = "browser" | "desktop" | "laptop" | "tablet" | "phone" | "none";
type Mode = "light" | "dark";

/**
 * The single entry point for showing product UI anywhere in the app.
 * Every hero, feature, and dashboard-preview surface should render
 * screenshots through this component — never `<img>` or a raw mockup
 * directly — so that:
 *   1. Swapping in real screenshots later is a one-line `src` change
 *      per call site, with zero layout/frame rework.
 *   2. Until a real screenshot exists, `src` can simply be omitted and
 *      this falls back to `DashboardIllustration` automatically, so
 *      pages never ship a broken image or a fabricated fake UI.
 *   3. `mode` flips the framed content to the (already-defined, not-yet-
 *      toggleable) Pass 2 dark theme tokens via `data-theme`, so a dark
 *      screenshot slot never needs its own bespoke styling.
 */
export default function ProductScreenshot({
  src,
  alt,
  frame = "browser",
  mode = "light",
  url,
  className = "",
}: {
  /** Omit until a real screenshot is captured — falls back to the illustration. */
  src?: string;
  alt: string;
  frame?: Frame;
  mode?: Mode;
  /** URL shown in the browser frame's address bar (browser frame only). */
  url?: string;
  className?: string;
}) {
  const content = src ? (
    <Image src={src} alt={alt} width={1280} height={800} className="w-full h-auto" />
  ) : (
    // DashboardIllustration is decorative (aria-hidden) since it's not a
    // real screenshot — so without this, a screen reader user gets no
    // description at all here. role="img" + a visually-hidden label gives
    // the fallback the same accessible name a real screenshot would have.
    <div role="img" aria-label={alt}>
      <DashboardIllustration className="border-0 rounded-none" />
    </div>
  );

  switch (frame) {
    case "browser":
      return (
        <BrowserMockup url={url} mode={mode} className={className}>
          {content}
        </BrowserMockup>
      );
    case "desktop":
      return (
        <DesktopMockup mode={mode} className={className}>
          {content}
        </DesktopMockup>
      );
    case "laptop":
      return (
        <LaptopMockup mode={mode} className={className}>
          {content}
        </LaptopMockup>
      );
    case "tablet":
      return (
        <TabletMockup mode={mode} className={className}>
          {content}
        </TabletMockup>
      );
    case "phone":
      return (
        <PhoneMockup mode={mode} className={className}>
          {content}
        </PhoneMockup>
      );
    default:
      return <div className={className}>{content}</div>;
  }
}
