module.exports = {
  routes: [
    {
      method: "GET",
      path: "/custom-list",
      handler: "custom-list.theatreList",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/custom-list-csv",
      handler: "custom-list.alltheatreList",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/device-session-list-csv",
      handler: "custom-list.deviceSessionlist",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/logs",
      handler: "custom-list.postLogs",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
