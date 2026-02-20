import { cn } from "@/lib/utils";

interface MediaGalleryProps {
  images: { src: string; alt: string }[];
  className?: string;
}

export function MediaGallery({ images, className }: MediaGalleryProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Media & Documents
        </h3>
        <button className="flex items-center gap-1 text-xs font-mono text-primary hover:underline">
          <span className="material-symbols-outlined text-[14px]">upload</span>
          Upload
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden border border-border group cursor-pointer"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                zoom_in
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
