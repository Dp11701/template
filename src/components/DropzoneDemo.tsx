import { Group, Text, Notification, Button } from "@mantine/core";
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";

interface DropzoneDemoProps extends Partial<DropzoneProps> {
  onDrop: any;
  onReject?: any;
  uploadStatus?: "idle" | "success" | "error";
  onDelete: () => void;
  loading?: boolean;
}

export function DropzoneDemo(props: DropzoneDemoProps) {
  const [isDragging, setIsDragging] = useState(false);

  const { uploadStatus, onDelete, loading, ...rest } = props;

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return (
    <Dropzone
      maxSize={5 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      loading={loading}
      {...rest}
      style={{
        borderColor:
          uploadStatus === "success"
            ? "#22c55e"
            : uploadStatus === "error"
              ? "#ef4444"
              : undefined,
      }}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size={52}
            color="var(--mantine-color-blue-6)"
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            size={52}
            color="var(--mantine-color-dimmed)"
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            {uploadStatus === "success"
              ? "Upload thành công"
              : uploadStatus === "error"
                ? "Upload thất bại"
                : "Drag images here or click to select files"}
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            {uploadStatus === "success"
              ? "Upload thành công"
              : uploadStatus === "error"
                ? "Upload thất bại"
                : "Drag images here or click to select files"}
          </Text>

          {uploadStatus === "success" && (
            <Button
              leftSection={<IconTrash size={18} />}
              color="red"
              className="mt-4 cursor-pointer"
              mt={8}
              onClick={() => {
                onDelete();
              }}
            >
              Delete file
            </Button>
          )}
        </div>
      </Group>
    </Dropzone>
  );
}
