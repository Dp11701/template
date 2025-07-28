"use client";
import Image from "next/image";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import { Suspense } from "react";
import { Skeleton } from "@mantine/core";

const queryClient = new QueryClient();

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
  const { data, isLoading } = useQuery({
    queryKey: ["landing-config"],
    queryFn: async () => {
      const res = await axios.get("/api/landingpage");
      return res.data.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });

  if (isLoading) {
    return <LandingSkeleton />;
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
  const imageUrl = imageKey
    ? `/api/image?key=${encodeURIComponent(imageKey)}`
    : "/center-image.jpg";
  const bgUrl = imageKey
    ? `/api/image?key=${encodeURIComponent(imageKey)}`
    : "/background.jpg";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Blurred background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={bgUrl}
          alt="Background"
          fill
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
          className="rounded-xl shadow-lg max-w-[60vw] max-h-[60vh] w-auto h-auto object-contain"
        />
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LandingSkeleton />}>
        <LandingContent />
      </Suspense>
    </QueryClientProvider>
  );
}
