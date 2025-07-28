"use client";
import { useState } from "react";
import {
  TextInput,
  Paper,
  Popover,
  ColorSwatch,
  ColorPicker,
  Button,
  Notification,
} from "@mantine/core";
import Image from "next/image";
import { DropzoneDemo } from "@/components/DropzoneDemo";
import { useForm, Controller } from "react-hook-form";
import { IconCheck, IconX, IconTrash } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";

interface LandingFormValues {
  brand: string;
  desc: string;
  tracking: string;
  imageKey: string; // store S3 key
  brandColor: string;
  descColor: string;
}

export default function AdminLandingPage() {
  const [brandColorOpened, setBrandColorOpened] = useState(false);
  const [descColorOpened, setDescColorOpened] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LandingFormValues>({
    defaultValues: {
      brand: "My Brand",
      desc: "Welcome to our amazing product! This is a simple landing page built with Next.js, Mantine, and TailwindCSS.",
      tracking: "",
      imageKey: "",
      brandColor: "#ffffff",
      descColor: "#ffffff",
    },
  });

  // Watch for live preview
  const brand = watch("brand");
  const desc = watch("desc");
  const tracking = watch("tracking");
  const brandColor = watch("brandColor");
  const descColor = watch("descColor");
  const imageKey = watch("imageKey");

  async function handleImageUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setValue("imageKey", data.key);
      setUploadStatus("success");
      setUploadMessage("Đã upload thành công!");
    } else {
      setValue("imageKey", "");
      setUploadStatus("error");
      setUploadMessage("Upload thất bại. Vui lòng thử lại.");
    }
    setUploading(false);
  }

  const handleDeleteImage = () => {
    setValue("imageKey", "");
    setUploadStatus("idle");
    setUploadMessage("");
  };

  async function onSubmit(data: LandingFormValues) {
    setSaving(true);
    try {
      const res = await fetch("/api/landingpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: data.brand,
          desc: data.desc,
          trackingLink: data.tracking,
          imageKey: data.imageKey,
          brandColor: data.brandColor,
          descColor: data.descColor,
        }),
      });
      setSaving(false);
      if (res.ok) {
        showNotification({
          title: "Lưu thành công",
          message: "Cấu hình landing page đã được lưu!",
          color: "green",
          icon: <IconCheck size={18} />,
        });
      } else {
        showNotification({
          title: "Lỗi",
          message: "Không lưu được cấu hình.",
          color: "red",
          icon: <IconX size={18} />,
        });
      }
    } catch (e) {
      setSaving(false);
      showNotification({
        title: "Lỗi",
        message: "Không lưu được cấu hình.",
        color: "red",
        icon: <IconX size={18} />,
      });
    }
  }

  // Helper to get preview url
  const previewUrl = imageKey
    ? `/api/image?key=${encodeURIComponent(imageKey)}`
    : "/center-image.jpg";

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-gray-50 min-h-screen">
      {/* Config Form */}
      <Paper
        className="w-full md:w-1/2 p-6 bg-white border border-gray-200 shadow-md rounded-xl"
        shadow="md"
        radius="md"
      >
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="brand"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextInput
                label="Brand"
                required
                error={errors.brand && "Brand is required"}
                {...field}
                rightSection={
                  <Popover
                    opened={brandColorOpened}
                    onChange={setBrandColorOpened}
                    position="bottom-end"
                    withArrow
                    shadow="md"
                  >
                    <Popover.Target>
                      <ColorSwatch
                        color={brandColor}
                        size={28}
                        style={{ cursor: "pointer" }}
                        onClick={() => setBrandColorOpened((o) => !o)}
                      />
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Controller
                        name="brandColor"
                        control={control}
                        render={({ field }) => (
                          <ColorPicker
                            format="hex"
                            value={field.value}
                            onChange={field.onChange}
                            swatches={[
                              "#000000",
                              "#ffffff",
                              "#ff0000",
                              "#00ff00",
                              "#0000ff",
                              "#ffff00",
                              "#ff00ff",
                              "#00ffff",
                              "#ffa500",
                              "#800080",
                              "#ffc0cb",
                              "#a52a2a",
                              "#808080",
                              "#008000",
                              "#000080",
                            ]}
                          />
                        )}
                      />
                    </Popover.Dropdown>
                  </Popover>
                }
                rightSectionWidth={40}
              />
            )}
          />

          <Controller
            name="desc"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextInput
                label="Description"
                required
                error={errors.desc && "Description is required"}
                {...field}
                rightSection={
                  <Popover
                    opened={descColorOpened}
                    onChange={setDescColorOpened}
                    position="bottom-end"
                    withArrow
                    shadow="md"
                  >
                    <Popover.Target>
                      <ColorSwatch
                        color={descColor}
                        size={28}
                        style={{ cursor: "pointer" }}
                        onClick={() => setDescColorOpened((o) => !o)}
                      />
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Controller
                        name="descColor"
                        control={control}
                        render={({ field }) => (
                          <ColorPicker
                            format="hex"
                            value={field.value}
                            onChange={field.onChange}
                            swatches={[
                              "#000000",
                              "#ffffff",
                              "#ff0000",
                              "#00ff00",
                              "#0000ff",
                              "#ffff00",
                              "#ff00ff",
                              "#00ffff",
                              "#ffa500",
                              "#800080",
                              "#ffc0cb",
                              "#a52a2a",
                              "#808080",
                              "#008000",
                              "#000080",
                            ]}
                          />
                        )}
                      />
                    </Popover.Dropdown>
                  </Popover>
                }
                rightSectionWidth={40}
              />
            )}
          />

          <Controller
            name="tracking"
            control={control}
            render={({ field }) => (
              <TextInput
                label="Tracking Link"
                placeholder="https://..."
                {...field}
              />
            )}
          />

          <Controller
            name="imageKey"
            control={control}
            render={() => (
              <div>
                <DropzoneDemo
                  onDrop={async (files: File[]) => {
                    if (!imageKey && files[0])
                      await handleImageUpload(files[0]);
                  }}
                  onReject={() => {}}
                  // disabled={!!imageKey}
                  uploadStatus={uploadStatus}
                  onDelete={handleDeleteImage}
                  loading={uploading}
                />
              </div>
            )}
          />
          <Button type="submit" loading={uploading || saving}>
            Save
          </Button>
        </form>
      </Paper>
      {/* Live Preview */}
      <div className="w-full md:w-1/2 flex items-center justify-center h-full">
        <div className="relative min-h-[520px] w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col items-center justify-center p-6">
          {/* Blurred Background */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src={previewUrl}
              width={180}
              height={180}
              alt="Background Blur"
              className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 z-0"
              style={{ filter: "blur(6px)", objectFit: "cover" }}
            />
          </div>
          {/* Content */}
          <header className="mt-4 mb-2 text-center z-10">
            <h1
              className="text-3xl font-bold drop-shadow-xl"
              style={{ color: brandColor }}
            >
              {brand}
            </h1>
          </header>
          <p
            className="text-base text-center drop-shadow max-w-sm mb-4 z-10"
            style={{ color: descColor }}
          >
            {desc}
          </p>
          <div className="flex justify-center mb-4 z-10">
            <Image
              src={previewUrl}
              alt="Center Image"
              width={180}
              height={180}
              className="rounded-xl border-4 border-white shadow-md object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
