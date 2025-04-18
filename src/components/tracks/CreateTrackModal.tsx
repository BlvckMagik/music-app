"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrackFormData } from "@/types";
import { trackFormSchema } from "@/lib/validators";
import { createTrack, uploadTrackFile } from "@/app/actions/tracks";

interface CreateTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTrackModal({
  isOpen,
  onClose,
}: CreateTrackModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrackFormData>({
    resolver: zodResolver(trackFormSchema),
    defaultValues: {
      title: "",
      artist: "",
      album: "",
      genres: [],
      coverImage: "",
    },
  });

  const onSubmit = async (data: TrackFormData) => {
    try {
      setIsSubmitting(true);
      const track = await createTrack(data);
      if (selectedFile && track.id) {
        await uploadTrackFile(track.id, selectedFile);
      }
      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Створити новий трек</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Назва</label>
            <input
              {...register("title")}
              className="w-full border rounded p-2"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Виконавець</label>
            <input
              {...register("artist")}
              className="w-full border rounded p-2"
            />
            {errors.artist && (
              <p className="text-red-500 text-sm">{errors.artist.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Альбом</label>
            <input
              {...register("album")}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1">Обкладинка (URL)</label>
            <input
              {...register("coverImage")}
              className="w-full border rounded p-2"
            />
            {errors.coverImage && (
              <p className="text-red-500 text-sm">
                {errors.coverImage.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1">Жанри</label>
            <select
              multiple
              {...register("genres")}
              className="w-full border rounded p-2"
            >
              <option value="rock">Рок</option>
              <option value="pop">Поп</option>
              <option value="jazz">Джаз</option>
              <option value="classical">Класика</option>
            </select>
            {errors.genres && (
              <p className="text-red-500 text-sm">{errors.genres.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Аудіо файл</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Створення..." : "Створити"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
