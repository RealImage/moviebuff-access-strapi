import type { Schema, Attribute } from '@strapi/strapi';

export interface ArrayComponentScreen extends Schema.Component {
  collectionName: 'components_array_component_screens';
  info: {
    displayName: 'Screen';
    icon: 'slideshow';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    audio_device_id: Attribute.String;
    audio_device_active_status: Attribute.Boolean & Attribute.DefaultTo<false>;
    installed_date: Attribute.Date;
    Installed_by: Attribute.String;
    screen_id: Attribute.String;
    closed_caption: Attribute.Boolean & Attribute.DefaultTo<false>;
    ip_address: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'array-component.screen': ArrayComponentScreen;
    }
  }
}
