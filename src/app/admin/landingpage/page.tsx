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
import React from "react";
import {
  useLandingPageConfig,
  useSaveLandingPageConfig,
  useUploadImage,
} from "@/hooks/useLandingPage";

interface LandingFormValues {
  brand: string;
  desc: string;
  tracking: string;
  imageKey: string; // store S3 key
  brandColor: string;
  descColor: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminLandingPage() {
  const [brandColorOpened, setBrandColorOpened] = useState(false);
  const [descColorOpened, setDescColorOpened] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [uploadMessage, setUploadMessage] = useState<string>("");

  // Custom hooks
  const { data: currentConfig, isLoading } = useLandingPageConfig();
  const saveConfigMutation = useSaveLandingPageConfig();
  const uploadImageMutation = useUploadImage();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
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

  // Load current config into form when data is available
  React.useEffect(() => {
    if (currentConfig) {
      reset({
        brand: currentConfig.brand,
        desc: currentConfig.desc,
        tracking: currentConfig.trackingLink || "",
        imageKey: currentConfig.imageUrl || "",
        brandColor: currentConfig.brandColor,
        descColor: currentConfig.descColor,
      });
    }
  }, [currentConfig, reset]);

  // Watch for live preview
  const brand = watch("brand");
  const desc = watch("desc");
  const tracking = watch("tracking");
  const brandColor = watch("brandColor");
  const descColor = watch("descColor");
  const imageKey = watch("imageKey");

  async function handleImageUpload(file: File | null) {
    console.log("file call api", file);
    if (!file) return;

    try {
      const result = await uploadImageMutation.mutateAsync(file);
      setValue("imageKey", result.key);
      setUploadStatus("success");
      setUploadMessage("Đã upload thành công!");
    } catch (error) {
      setValue("imageKey", "");
      setUploadStatus("error");
      setUploadMessage("Upload thất bại. Vui lòng thử lại.");
    }
  }

  const handleDeleteImage = () => {
    setValue("imageKey", "");
    setUploadStatus("idle");
    setUploadMessage("");
  };

  async function onSubmit(data: LandingFormValues) {
    try {
      await saveConfigMutation.mutateAsync({
        brand: data.brand,
        desc: data.desc,
        trackingLink: data.tracking,
        imageKey: data.imageKey,
        brandColor: data.brandColor,
        descColor: data.descColor,
      });

      showNotification({
        title: "Lưu thành công",
        message: "Cấu hình landing page đã được lưu!",
        color: "green",
        icon: <IconCheck size={18} />,
      });
    } catch (error) {
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
    ? `${API_BASE_URL}/image?key=${encodeURIComponent(imageKey)}`
    : "/center-image.jpg";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải cấu hình...</p>
        </div>
      </div>
    );
  }

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
                    console.log("files", files);
                    if (files[0]) {
                      await handleImageUpload(files[0]);
                    }
                  }}
                  onReject={() => {}}
                  uploadStatus={uploadStatus}
                  onDelete={handleDeleteImage}
                  loading={uploadImageMutation.isPending}
                />
              </div>
            )}
          />
          <Button
            type="submit"
            loading={
              uploadImageMutation.isPending || saveConfigMutation.isPending
            }
            disabled={saveConfigMutation.isPending}
          >
            {saveConfigMutation.isPending ? "Đang lưu..." : "Save"}
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
              priority
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
              priority
              className="rounded-xl border-4 border-white shadow-md object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
