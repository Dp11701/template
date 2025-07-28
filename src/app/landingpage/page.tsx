"use client";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@mantine/core";
import { useLandingPageConfig } from "@/hooks/useLandingPage";
import { getApiUrl } from "@/lib/env";

function LandingSkeleton() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Skeleton height="100vh" width="100vw" className="blur-2xl" />
      </div>
      <header className="mt-16 mb-4 w-full flex justify-center">
        <Skeleton height={48} width={320} radius="xl" className="mb-4" />
      </header>
      <div className="flex flex-col items-center w-full">
        <Skeleton height={28} width={400} radius="xl" className="mb-4" />
        <Skeleton height={28} width={320} radius="xl" className="mb-8" />
      </div>
      <div className="flex justify-center">
        <Skeleton
          height={400}
          width={400}
          radius="xl"
          className="rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
}

function LandingContent() {
  const { data, isLoading, error } = useLandingPageConfig();
  console.log("data", data);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show skeleton until mounted to prevent hydration mismatch
  if (!mounted) {
    return <LandingSkeleton />;
  }

  if (isLoading) {
    return <LandingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-600">
            Không thể tải cấu hình landing page. Vui lòng thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  const config = data;
  const brand = config?.brand || "My Brand";
  const desc =
    config?.desc ||
    "Welcome to our amazing product! This is a simple landing page built with Next.js, Mantine, and TailwindCSS.";
  const brandColor = config?.brandColor || "#fff";
  const descColor = config?.descColor || "#fff";
  const trackingLink = config?.trackingLink || "";
  const imageKey = config?.imageUrl || "";
  console.log("imageKey", imageKey);
  const apiUrl = getApiUrl();
  console.log("apiUrl", apiUrl);
  const imageUrl = imageKey
    ? `${apiUrl}/image?key=${encodeURIComponent(imageKey)}`
    : "/center-image.jpg";
  console.log("imageUrl", imageUrl);
  const bgUrl = imageKey
    ? `${apiUrl}/image?key=${encodeURIComponent(imageKey)}`
    : "/background.jpg";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Blurred background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={bgUrl}
          alt="Background"
          fill
          priority
          style={{ objectFit: "cover" }}
          className="blur-2xl brightness-75"
        />
      </div>
      <header className="mt-16 mb-4">
        <h1
          className="text-4xl font-bold drop-shadow-lg"
          style={{ color: brandColor }}
        >
          {brand}
        </h1>
      </header>
      <p
        className="text-lg mb-8 max-w-xl text-center drop-shadow"
        style={{ color: descColor }}
      >
        {desc}
      </p>
      <div className="flex justify-center">
        <Image
          src={imageUrl}
          alt="Center"
          width={800}
          height={800}
          priority
          className="rounded-xl shadow-lg max-w-[60vw] max-h-[60vh] w-auto h-auto object-contain"
        />
      </div>
      {trackingLink && (
        <div className="mt-8">
          <a
            href={trackingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-opacity-30 transition-all duration-200"
          >
            Learn More
          </a>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<LandingSkeleton />}>
      <LandingContent />
    </Suspense>
  );
}
