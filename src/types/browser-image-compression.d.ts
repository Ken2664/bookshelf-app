declare module 'browser-image-compression' {
  export default function imageCompression(
    file: File,
    options: {
      maxSizeMB?: number;
      maxWidthOrHeight?: number;
      useWebWorker?: boolean;
    }
  ): Promise<File>;
}
