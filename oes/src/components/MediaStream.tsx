import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { useRafLoop } from "react-use";
import { getMediaStream, mediaStreamErrorType } from "../utils/mediaStream";
import { useCamera } from "../hooks/useCamera";

type Props = {
  onFrame?: (imageData: ImageData) => void;
  onMediaStream?: (stream: MediaStream) => void;
  suppressError?: boolean;
};

export const MediaStream = ({
  onFrame,
  onMediaStream,
  suppressError = false,
}: Props) => {
  const { preferredCameraId } = useCamera();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loopStop, loopStart] = useRafLoop(() => {
    const canvasElement = canvasRef.current;
    const videoElement = videoRef.current;

    if (
      canvasElement &&
      videoElement &&
      videoElement.readyState === videoElement.HAVE_ENOUGH_DATA
    ) {
      const canvas = canvasElement.getContext("2d");
      if (!canvas) return;

      canvasElement.height = videoElement.videoHeight;
      canvasElement.width = videoElement.videoWidth;
      canvas.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      const imageData = canvas.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      onFrame && onFrame(imageData);
    }
  }, false);

  const initMediaStream = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    console.log("preferredCameraId", preferredCameraId);

    try {
      const stream = await getMediaStream(
        preferredCameraId === "AUTO" ? undefined : preferredCameraId
      );

      if (!stream) return;
      onMediaStream && onMediaStream(stream);

      videoElement.srcObject = stream;
      videoElement.play();
      loopStart();
    } catch (e) {
      switch (e.message) {
        case mediaStreamErrorType.GET_USER_MEDIA_NOT_FOUND:
          break;
        case mediaStreamErrorType.CAMERA_ACTIVATE_ERROR:
          if (suppressError) return;
          break;
        default:
          console.log(e);
      }
    }
  }, [loopStart, preferredCameraId, suppressError]);

  useEffect(() => {
    const videoElement = videoRef.current;
    initMediaStream();

    return () => {
      loopStop();
      if (videoElement) {
        const stream = videoElement.srcObject as MediaStream | null;
        if (!stream) return;
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
          track.stop();
        });

        videoElement.srcObject = null;
      }
    };
  }, [loopStart, loopStop, videoRef, initMediaStream, preferredCameraId]);

  return (
    <>
      <Video ref={videoRef} playsInline />
      <Canvas ref={canvasRef} />
    </>
  );
};

const Video = styled.video`
  /* Make video to at least 100% wide and tall */
  min-width: 100%;
  min-height: 100%;

  /* Setting width & height to auto prevents the browser from stretching or squishing the video */
  width: auto;
  height: auto;

  /* Center the video */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Canvas = styled.canvas`
  display: none;
`;
