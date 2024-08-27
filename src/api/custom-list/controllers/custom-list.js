const axios = require("axios");
require("dotenv").config();
const { parse } = require('json2csv');
const deviceSession = require("../../device-session/controllers/device-session");

module.exports = {
  async theatreList(ctx, next) {
    try {
      let { location, search } = ctx.query;
      if (location == '13.0478078,80.0442001,1000000.0') {
        location = null;
      }
      let strapiEndpoint = null;
      if (location) {
        strapiEndpoint = `${process.env.STRAPI_API_URL}/api/theatres?pagination[pageSize]=100&populate=*&$location[theatre_location]=${location}`;
      } else if (search) {
        strapiEndpoint = `${process.env.STRAPI_API_URL}/api/theatres?pagination[pageSize]=100&populate=*&filters[theatre_name][$containsi]=${search}`;
      } else {
        strapiEndpoint = `${process.env.STRAPI_API_URL}/api/theatres?pagination[pageSize]=100&populate=*`;
      }
      const response = await axios.get(strapiEndpoint, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      });
      const composedData = [];
      const responseData = response.data.data;
      if (location) {
        const lat = location.split(",")[0];
        const long = location.split(",")[1];
        await responseData.forEach(async (item) => {
          const theatreLocation = item.attributes.theatre_location;
          const validScreens = await strapi
            .service("api::custom-list.custom-list")
            .findValidScreens(item.attributes.Screens);
          if (validScreens && validScreens.length > 0) {
            const distance = await strapi
              .service("api::custom-list.custom-list")
              .calculateDistance(
                lat,
                long,
                parseFloat(theatreLocation.lat),
                parseFloat(theatreLocation.lng)
              );
            item.distance = distance;
            item.attributes.Screens = validScreens;
            composedData.push(item);
          } else {
            console.log("audio not avialble for", item.attributes.theatre_name);
          }
          composedData.sort((a, b) => a.distance - b.distance)
        });
        ctx.body = { data: composedData, meta: response.data.meta };
      } else {
        await responseData.forEach(async (item) => {
          const validScreens = await strapi
            .service("api::custom-list.custom-list")
            .findValidScreens(item.attributes.Screens);
          if (validScreens && validScreens.length > 0) {
            item.attributes.Screens = validScreens;
            composedData.push(item);
          } else {
            console.log("audio not avialble for", item.attributes.theatre_name);
          }
        });
        ctx.body = { data: composedData.sort((a, b) => a.attributes.theatre_name.localeCompare(b.attributes.theatre_name)), meta: response.data.meta };
      }
    } catch (err) {
      ctx.badRequest("Post report controller error", {
        moreDetails: err.message,
      });
    }
  },
  async alltheatreList(ctx, next) {
    const strapiEndpoint = `${process.env.STRAPI_API_URL}/api/theatres?pagination[pageSize]=1000&populate=*`;
    const response = await axios.get(strapiEndpoint, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });
    const composedData = [];
    const responseData = response.data.data;
    await responseData.forEach(async (item) => {
        const x = {};
        x['Theatre ID'] = item.attributes.theatre_id;
        x['Theatre Name'] = item.attributes.theatre_name;
        x['Description'] = item.attributes.description;
        x['WiFi Network ID'] = item.attributes.wifi_network_id;
        x['WiFi Password'] = item.attributes.wifi_password;
        x['Theatre Location Coordinates'] = item.attributes.theatre_location.lat ? `${item.attributes.theatre_location.lat}, ${item.attributes.theatre_location.lng}` : '';
        x['City'] = item.attributes.city;
        x['Province'] = item.attributes.province;
        x['Country'] = item.attributes.country;
        const active = [];
        const inactive = [];
        for (let i = 0; i < item.attributes.Screens.length; i++) {
          const screen = item.attributes.Screens[i];
          if (screen.audio_device_active_status) {
            active.push(screen);
          } else {
            inactive.push(screen);
          }
        }
        if (active && active.length > 0) {
          x['Active Screens'] = active.map(item => `${item.name}`).join(', ');
        } else {
          x['Active Screens'] = '';
        }
        if (inactive && inactive.length > 0) {
          x['Inactive Screens'] = inactive.map(item => `${item.name}`).join(', ');
        } else {
          x['Inactive Screens'] = '';
        }
        composedData.push(x);
    });
    const fields = ['Theatre ID', 'Theatre Name', 'Description', 'Theatre Location Coordinates', 'City', 'Province', 'Country', 'WiFi Network ID', 'WiFi Password', 'Active Screens', 'Inactive Screens'];
    const opts = { fields };
    const csv = parse(composedData, opts);

    const formattedDate = new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '').replace(/\//g, '-').replace(/:/g, '-').replace(' ', '_');
    const filename = `Theatre-Export-${formattedDate}.csv`
    ctx.set('Content-Type', 'text/csv');
    ctx.set('Content-Disposition', `attachment; filename=${filename}`);
    ctx.send(csv);
  },
  async deviceSessionlist(ctx, next) {
    const responseData = await strapi.db.query('api::device-session.device-session').findMany({ where: {
      device_id: { $ne: null }
    } });
    const composedData = [];
    // ctx.body = { data: response };
    // const responseData = response.data.data;
    await responseData.forEach(async (item) => {
        const x = {};
        x['Device ID'] = item.device_id;
        x['App Version'] = item.version;
        x['Session Start DateTime'] = item.session_start? new Date(item.session_start).toLocaleString('en-GB', { hour12: true }).replace(',', '') : '';
        x['Session End DateTime'] = item.session_end? new Date(item.session_end).toLocaleString('en-GB', { hour12: true }).replace(',', '') : '';
        x['OS'] = item.os;
        x['Theatre Name'] = item.theatre_name;
        x['Theatre ID'] = item.theatre_id;
        x['Screen Name'] = item.screen_name;
        x['Screen ID'] = item.screen_id;
        composedData.push(x);
    });
    const fields = ['Device ID', 'App Version', 'Session Start DateTime', 'Session End DateTime', 'OS', 'Theatre Name', 'Theatre ID', 'Screen Name', 'Screen ID'];
    const opts = { fields };
    const csv = parse(composedData, opts);
    const formattedDate = new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '').replace(/\//g, '-').replace(/:/g, '-').replace(' ', '_');
    const filename = `Device-Session-${formattedDate}.csv`
    ctx.set('Content-Type', 'text/csv');
    ctx.set('Content-Disposition', `attachment; filename=${filename}`);
    ctx.send(csv);
  },
};
