import type { Schema, Struct } from '@strapi/strapi';

export interface AboutUsPersonAboutUsPerson extends Struct.ComponentSchema {
  collectionName: 'components_about_us_person_about_us_people';
  info: {
    description: '';
    displayName: 'About Us Person';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    profilePicture: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
  };
}

export interface HomepageHomeHeroImage extends Struct.ComponentSchema {
  collectionName: 'components_homepage_home_hero_images';
  info: {
    description: '';
    displayName: 'Home hero image';
  };
  attributes: {
    hero: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about-us-person.about-us-person': AboutUsPersonAboutUsPerson;
      'homepage.home-hero-image': HomepageHomeHeroImage;
    }
  }
}
