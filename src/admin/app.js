const customMenu = {
  plugins: {
    "content-manager": {
      links: [
        {
          name: "Theatre",
          icon: "content",
          destination: `/admin/content-manager/collection-types/api::theatre.theatre?page=1&pageSize=10&sort=description:ASC&plugins[i18n][locale]=en`,
        },
        {
          name: "Device Session",
          icon: "content",
          destination: `/admin/content-manager/collection-types/api::device-session.device-session?page=1&pageSize=10&sort=device_id:ASC`,
        },
        {
          name: "User",
          icon: "content",
          destination: `/admin/content-manager/collection-types/plugin::users-permissions.user?page=1&pageSize=10&sort=username:ASC`,
        },
        // Add more collection types as needed
      ],
    },
  },
};

export default {
  config: {
    admin: {
      menu: customMenu,
    },
  },
};
