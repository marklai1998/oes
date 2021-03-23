import { any, hasIn } from "ramda";
import constate from "constate";
import { useCallback, useEffect, useState } from "react";
import { useLocalStorage, useMount } from "react-use";
import * as R from "ramda";

export const [UseCameraProvider, useCamera] = constate(() => {
  const [hasCameraSupport, setHasCameraSupport] = useState(false);

  const [preferredCameraId, setPreferredCameraId] = useLocalStorage(
    "preferred_camera_id",
    "AUTO"
  );
  const [cameraList, setCameraList] = useState<InputDeviceInfo[] | null>(null);

  const initCameraList = useCallback(async () => {
    try {
      if (
        !hasCameraSupport ||
        !hasIn("enumerateDevices", navigator.mediaDevices)
      ) {
        setCameraList([]);
        return;
      }

      const deviceList = await navigator.mediaDevices.enumerateDevices();

      const cameraList = deviceList.filter<InputDeviceInfo>(
        (device): device is InputDeviceInfo => device.kind === "videoinput"
      );

      setCameraList(cameraList);
    } catch (e) {
      alert("Unable to list device.\n\n" + e);
    }
  }, [hasCameraSupport]);

  useMount(() => {
    setHasCameraSupport("mediaDevices" in navigator);
  });

  useEffect(() => {
    initCameraList();
  }, [hasCameraSupport, initCameraList]);

  useEffect(() => {
    if (
      cameraList !== null &&
      preferredCameraId !== "AUTO" &&
      !any(({ deviceId }) => deviceId === preferredCameraId, cameraList)
    ) {
      setPreferredCameraId("AUTO");
    }
  }, [cameraList, setPreferredCameraId, preferredCameraId]);

  return {
    preferredCameraId: !any(
      ({ deviceId }) => deviceId === preferredCameraId,
      cameraList || []
    )
      ? "AUTO"
      : preferredCameraId,
    cameraList: cameraList || [],
    setPreferredCameraId,
    hasCameraSupport: hasCameraSupport && !R.isEmpty(cameraList || []),
  };
});
