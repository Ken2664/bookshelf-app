import React, { useRef, useState } from 'react'
import { Camera, XCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // バックカメラを優先
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setError(null)
    } catch (err) {
      setError('カメラの起動に失敗しました。カメラへのアクセスを許可してください。')
      console.error('カメラの起動に失敗しました:', err)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context) {
        // ビデオの実際のサイズでキャプチャ
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        // 画像をBase64形式で取得
        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImage(imageData)
        stopCamera() // 撮影後にカメラを停止
      }
    }
  }

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage)
      setCapturedImage(null)
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  return (
    <Card className="p-4">
      <div className="relative">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {!stream && !capturedImage && (
          <Button 
            onClick={startCamera}
            className="w-full"
          >
            <Camera className="mr-2 h-4 w-4" />
            カメラを起動
          </Button>
        )}

        {stream && !capturedImage && (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto rounded-lg"
            />
            <div className="flex justify-center space-x-4">
              <Button onClick={captureImage} variant="default">
                撮影する
              </Button>
              <Button onClick={stopCamera} variant="destructive">
                <XCircle className="mr-2 h-4 w-4" />
                キャンセル
              </Button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="space-y-4">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-auto rounded-lg"
            />
            <div className="flex justify-center space-x-4">
              <Button onClick={confirmCapture} variant="default">
                この写真を使用
              </Button>
              <Button onClick={retakePhoto} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                撮り直す
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </Card>
  )
}

export default CameraCapture