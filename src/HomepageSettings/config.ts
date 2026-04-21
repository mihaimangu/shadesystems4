import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const HomepageSettings: GlobalConfig = {
  slug: 'homepage-settings',
  label: 'Homepage',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Tag (small label above title)',
          defaultValue: 'Shade Systems',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          defaultValue: 'Quality Shade Solutions for Every Space',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Subtitle',
          defaultValue:
            'Pergolas, awnings, roller screens and more — designed and installed by specialists with over 20 years of experience.',
        },
        {
          name: 'primaryButtonLabel',
          type: 'text',
          label: 'Primary Button Label',
          defaultValue: 'View Products',
        },
        {
          name: 'primaryButtonHref',
          type: 'text',
          label: 'Primary Button Link',
          defaultValue: '/products',
        },
        {
          name: 'secondaryButtonLabel',
          type: 'text',
          label: 'Secondary Button Label',
          defaultValue: 'Get a Quote',
        },
        {
          name: 'secondaryButtonHref',
          type: 'text',
          label: 'Secondary Button Link',
          defaultValue: '/contact',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
        },
      ],
    },
    {
      name: 'products',
      type: 'group',
      label: 'Products Section',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Section Label',
          defaultValue: 'Our Products',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          defaultValue: 'Complete Range of Shade Systems',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Section Description',
          defaultValue:
            'From residential terraces to large commercial projects, we have a solution for every environment and budget.',
        },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: 'About Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          defaultValue: 'Over 20 Years of Expertise',
        },
        {
          name: 'body1',
          type: 'textarea',
          label: 'First Paragraph',
          defaultValue:
            'We are a specialist company focused on outdoor shade systems for residential and commercial clients. Our team handles everything from design and manufacturing to installation and after-sales support.',
        },
        {
          name: 'body2',
          type: 'textarea',
          label: 'Second Paragraph',
          defaultValue:
            'We work with high-quality aluminium and fabric systems that are built to last, combining functionality with clean, modern aesthetics.',
        },
        {
          name: 'stat1Value',
          type: 'text',
          label: 'Stat 1 Value',
          defaultValue: '20+',
        },
        {
          name: 'stat1Label',
          type: 'text',
          label: 'Stat 1 Label',
          defaultValue: 'Years in business',
        },
        {
          name: 'stat2Value',
          type: 'text',
          label: 'Stat 2 Value',
          defaultValue: '5000+',
        },
        {
          name: 'stat2Label',
          type: 'text',
          label: 'Stat 2 Label',
          defaultValue: 'Projects completed',
        },
        {
          name: 'stat3Value',
          type: 'text',
          label: 'Stat 3 Value',
          defaultValue: '12',
        },
        {
          name: 'stat3Label',
          type: 'text',
          label: 'Stat 3 Label',
          defaultValue: 'Countries served',
        },
        {
          name: 'stat4Value',
          type: 'text',
          label: 'Stat 4 Value',
          defaultValue: '100%',
        },
        {
          name: 'stat4Label',
          type: 'text',
          label: 'Stat 4 Label',
          defaultValue: 'Client satisfaction',
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA Strip',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text',
          defaultValue: 'Ready to get started?',
        },
        {
          name: 'highlight',
          type: 'text',
          label: 'Highlighted Text',
          defaultValue: 'Request a free consultation.',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Contact Us',
        },
        {
          name: 'buttonHref',
          type: 'text',
          label: 'Button Link',
          defaultValue: '/contact',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/')
      },
    ],
  },
}
