const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { parse } = require('json2csv');
const deviceSession = require("../../device-session/controllers/device-session");

module.exports = {
  async theatreList(ctx, next) {
    try {
      let { location, search, screen_support } = ctx.query;
      // if (location == '13.0478078,80.0442001,1000000.0') {
      //   location = null;
      // }
      if (!screen_support) {
        screen_support = 'ad';
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
            .findValidScreens(item.attributes.Screens, screen_support);
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
        x['Theatre Location Coordinates'] = (item?.attributes?.theatre_location && 
            typeof item.attributes.theatre_location === 'object' && 
            item.attributes.theatre_location !== null) 
            ? `${item.attributes.theatre_location.lat}, ${item.attributes.theatre_location.lng}` 
            : '';
        x['City'] = item?.attributes?.city || '';
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
        x['Accessibility Mode'] = item.accessibility_mode;
        
        // Format other_timestamps
        x['Audio Timestamps'] = Array.isArray(item.other_timestamps) ? 
            item.other_timestamps.map(ts => 
                `Action: ${ts.action || 'N/A'}, Timestamp: ${ts.timestamp || 'N/A'}`
            ).join(' - ') : '';

        // Format language_details
        x['Language Timestamps'] = Array.isArray(item.language_details) ? 
            item.language_details.map(lang => 
                `Language: ${lang.language_code || 'N/A'}, Timestamp: ${lang.timestamp || 'N/A'}`
            ).join(' - ') : '';

        composedData.push(x);
    });
    const fields = [
        'Device ID', 'App Version', 'Session Start DateTime', 'Session End DateTime', 
        'OS', 'Theatre Name', 'Theatre ID', 'Screen Name', 'Screen ID',
        'Accessibility Mode', 'Audio Timestamps', 'Language Timestamps'
    ];
    const opts = { fields };
    const csv = parse(composedData, opts);
    const formattedDate = new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', '').replace(/\//g, '-').replace(/:/g, '-').replace(' ', '_');
    const filename = `Device-Session-${formattedDate}.csv`
    ctx.set('Content-Type', 'text/csv');
    ctx.set('Content-Disposition', `attachment; filename=${filename}`);
    ctx.send(csv);
  },
  async postLogs(ctx, next) {
    const { logs, subject, message } = ctx.request.body;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "mbaccessapp@moviebuff.com",
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    const htmlTemplate = `<html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error Report</title>
        <style>
          body{font-family:Arial,sans-serif;margin:0;padding:0;background-color:#f4f4f4;}
          .container{max-width:600px;margin:20px auto;padding:20px;background-color:#ffffff;border-radius:5px;box-shadow:0 2px 5px rgba(0,0,0,0.1);}
          h1{color:#333333;text-align:center;}
          p{margin-bottom:20px;}
          .json-data{background-color:#f8f9fa;padding:15px;border-radius:4px;margin:15px 0;font-family:monospace;}
          .json-key{color:#881391;}
          .json-string{color:#1a1aa6;}
          .json-brace{color:#000000;}
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Error Report</h1>
          <p>Hello,</p>
          <p>An error report has been submitted by a user with the following details:</p>
          <div class="json-data">
            <pre>${JSON.stringify(logs, null, 2)}</pre>
          </div>
        </div>
      </body>
    </html>`;
    const info = transporter.sendMail({
      from: '"Moviebuff Access: Error Report" <mbaccessapp@moviebuff.com>',
      to: "Manikandan.A@qubecinema.com, suvindh.ms@qubecinema.com, sowmithri@nfnlabs.in, gajalakshme@nfnlabs.in, mbaccessapp@moviebuff.com",
      subject: subject,
      text: message,
      html: htmlTemplate,
    });
    console.log(logs);
    ctx.body = { logs, info };
  }
};
