module.exports = {
  calculateDistance: async (lat1, lon1, lat2, lon2) => {
    try {
      //   console.log("location", lat1, lon1, lat2, lon2);
      const R = 6371; // Earth radius in kilometers
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c * 1000; // Convert to meters
      //   console.log("distance", distance);
      return Math.round(distance);
    } catch (err) {
      return err;
    }
  },
  findValidScreens: async (screens, screen_support) => {
    try {
      const arr = [];
      for (let i = 0; i < screens.length; i++) {
        const screen = screens[i];
        // console.log(
        //   "screen.audio_device_active_status",
        //   screen.audio_device_active_status
        // );
        if (screen.ip_address && screen.ip_address !== '' && screen.ip_address !== null) {
          screen.ip_address = `http://${screen.ip_address}:4170`;
        }
        if (screen_support === 'ad') {
          if (screen.audio_device_active_status) {
            arr.push(screen);
          }
        } else if (screen_support === 'cc') {
          if (screen.closed_caption) {
            arr.push(screen);
          }
        } else if (screen_support === 'ad,cc') {
          if (screen.audio_device_active_status || screen.closed_caption) {
            arr.push(screen);
          }
        } else {
          arr.push(screen);
        }
      }
      return arr;
    } catch (err) {
      return null;
    }
  },
};
