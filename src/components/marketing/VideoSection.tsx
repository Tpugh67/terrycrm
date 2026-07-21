"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import { Container, Section } from "../ui/Container";
import ProductScreenshot from "../mockups/ProductScreenshot";

export default function VideoSection({
  title,
  description,
  videoUrl,
  posterSrc,
  posterAlt,
}: {
  title?: string;
  description?: string;
  /** Embeddable video URL (e.g. YouTube/Vimeo embed link). */
  videoUrl?: string;
  posterSrc?: string;
  posterAlt?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <Section background="surface">
      <Container width="content">
        {(title || description) && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            {title && <h2 className="pd-text-h1 mb-4">{title}</h2>}
            {description && <p className="pd-text-body-lg">{description}</p>}
          </div>
        )}
        <div className="max-w-3xl mx-auto rounded-[var(--radius-2xl)] overflow-hidden shadow-[var(--shadow-lg)] relative aspect-video bg-(--color-secondary)">
          {playing && videoUrl ? (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              title={title ?? "Product video"}
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              disabled={!videoUrl}
              className="w-full h-full relative group disabled:cursor-default"
              aria-label="Play video"
            >
              <ProductScreenshot src={posterSrc} alt={posterAlt ?? title ?? "Video preview"} frame="none" className="w-full h-full object-cover" />
              {videoUrl && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <span className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-(--color-primary) text-2xl shadow-[var(--shadow-lg)]">
                    <Play size={26} fill="currentColor" />
                  </span>
                </span>
              )}
            </button>
          )}
        </div>
      </Container>
    </Section>
  );
}
