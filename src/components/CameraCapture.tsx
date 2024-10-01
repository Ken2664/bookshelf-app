import React, { useRef, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('カメラの起動に失敗しました:', err);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        onCapture(imageData);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="camera-capture">
      {!stream ? (
        <button onClick={startCamera} className="btn btn-primary">
          カメラを起動
        </button>
      ) : (
        <>
          <video ref={videoRef} className="w-full h-auto" />
          <div className="mt-2">
            <button onClick={captureImage} className="btn btn-success mr-2">
              キャプチャ
            </button>
            <button onClick={stopCamera} className="btn btn-danger">
              カメラを停止
            </button>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
      )}
    </div>
  );
};

export default CameraCapture;