// utils/getLocation.ts
export const getUserLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject("Geolocation is not supported by this browser");
    }

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((permissionStatus) => {
        if (permissionStatus.state === "denied") {
          return reject("Location access denied in browser settings");
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            });
          },
          (err) => reject(err.message),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      })
      .catch(() => {
        // fallback if Permissions API not supported
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            });
          },
          (err) => reject(err.message)
        );
      });
  });
};
