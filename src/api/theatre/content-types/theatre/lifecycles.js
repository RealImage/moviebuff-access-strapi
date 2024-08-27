module.exports = {
  async afterCreate(event) {
    const { result } = event;
    if (result.Screens && Array.isArray(result.Screens)) {
      const activeAudioDevicesCount = result.Screens.filter(
        (screen) => screen.audio_device_active_status === true
      ).length;
      if (activeAudioDevicesCount == 0) {
        await strapi.entityService.update("api::theatre.theatre", result.id, {
          data: {
            active_screens: null,
          },
        });
      } else {
        await strapi.entityService.update("api::theatre.theatre", result.id, {
          data: {
            active_screens: activeAudioDevicesCount,
          },
        });
      }
    }
  },
  async afterUpdate(event) {
    const { result } = event;
    if (result.Screens && Array.isArray(result.Screens)) {
      const activeAudioDevicesCount = result.Screens.filter(
        (screen) => screen.audio_device_active_status === true
      ).length;
      if (activeAudioDevicesCount !== result.active_screens) {
        if (activeAudioDevicesCount == 0) {
          await strapi.entityService.update("api::theatre.theatre", result.id, {
            data: {
              active_screens: null,
            },
          });
        } else {
          await strapi.entityService.update("api::theatre.theatre", result.id, {
            data: {
              active_screens: activeAudioDevicesCount,
            },
          });
        }
      }
    }
  },
};
