import type { Schema, Attribute } from '@strapi/strapi';

export interface AboutUsPersonAboutUsPerson extends Schema.Component {
  collectionName: 'components_about_us_person_about_us_people';
  info: {
    displayName: 'About Us Person';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    body: Attribute.Text & Attribute.Required;
    profilePicture: Attribute.Media & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'about-us-person.about-us-person': AboutUsPersonAboutUsPerson;
    }
  }
}
