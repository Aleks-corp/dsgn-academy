"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import Button from "@/components/buttons/Button";

interface Props {
  imageSrc: string;
  onConfirm: (file: File) => void;
  onCancel: () => void;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const size = Math.min(pixelCrop.width, pixelCrop.height);
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(new File([blob!], "avatar.jpg", { type: "image/jpeg" })),
      "image/jpeg",
      0.85
    );
  });
}

export default function AvatarCropModal({ imageSrc, onConfirm, onCancel }: Props) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setLoading(true);
    try {
      const file = await getCroppedImg(imageSrc, croppedAreaPixels);
      onConfirm(file);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-background rounded-2xl w-full max-w-sm flex flex-col overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-inter font-semibold text-base text-foreground">
            Змінити аватар
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        <div className="relative w-full" style={{ height: 300 }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 pt-4 pb-2 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-inter text-xs text-muted-text w-10 shrink-0">Масштаб</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-accent h-1.5 rounded-full cursor-pointer"
            />
            <span className="font-inter text-xs text-muted-text w-8 text-right shrink-0">
              {zoom.toFixed(1)}×
            </span>
          </div>

        </div>

        <div className="flex gap-3 px-5 pb-5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-border font-inter text-sm font-medium text-muted hover:text-foreground hover:border-foreground transition-all"
          >
            Скасувати
          </button>
          <Button
            type="button"
            text={loading ? "Збереження..." : "Зберегти"}
            disabled={loading}
            onClick={handleConfirm}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
