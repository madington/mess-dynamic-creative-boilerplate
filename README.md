> 🌱 This repository contains a sample project to get started with building dynamic creatives for Madington MESS. It is not intended to be used as-is, but rather as a starting point for your own project.

# What is Madington MESS?
Madington MESS is a platform that allows you to create dynamic creatives for digital advertising. It is a powerful tool that enables you to create engaging and interactive ads that can be easily customized to suit your needs.


![Project Image](https://delivered-by-madington.com/internal/MESS/mess-sample.webp)


#### Want to learn more?
If you want to learn more about Madington MESS and how you can use it to create dynamic creatives, check out the [official website](https://madington.com/). You can also reach out to the Madington team for more information and support.

#### Also as a Managed Service
Madington MESS is also available as a managed service, where the Madington team can help you create and manage your dynamic creatives. If you are looking for a hands-off solution to create engaging ads for your campaigns, the managed service is a great option.

# Getting Started

To get started with building dynamic creatives for Madington MESS, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies by running your package manager of choice (e.g. `pnpm install`).
3. Start the development server by running `pnpm start`.
4. Set up a new `Template` in Madington MESS and point the `DEV Url` to `http://localhost:5173`.
5. Start building your dynamic creatives!

# Concepts
To make your journey easier, here are some key concepts to keep in mind when building dynamic creatives for Madington MESS:

## Templates
The largest building block in Madington MESS is the template. A template is a boilerplate for your dynamic creative that defines the structure and layout of your ad. Whenever you need to have a creative with a new layout or structure, you will need to create a new template.

## Styles
Styles are used to define the appearance of your dynamic creatives. You can define styles for various elements in your creative, such as text, images, and buttons. Styles are saved to the template and can be reused across multiple creatives. You can look at styles as a way to define the look and feel of your creatives for different brands or campaigns.

## Media Library
Each template has its own media library where you can upload and manage images, videos, and other media assets. You can use the media library to store assets that are used across multiple styles and creatives.

## Videos vs Streamed Videos (using Streamedby™)
Videos are a great way to add motion and interactivity to your dynamic creatives. You can upload videos to the media library and use them in your creatives. MESS automatically generates Streamedby™ versions of your videos, which are optimized for streaming and playback on different devices. Streamedby™ videos are automatically generated when you upload a video to the media library. Using streamed videos in your creatives ensures that your videos load quickly and play smoothly on all devices, and it also helps reduce the file size of your creatives which can improve performance.

This project showcases how you can use videos in your dynamic creatives and how you can take advantage of the Streamedby™ feature.


## Data Binding (Properties)
Data binding is a powerful feature in Madington MESS that allows you to create dynamic creatives that can be customized based on user input or external data sources. You can bind data to various elements in your creative, such as text, images, and videos, and update them dynamically based on user interactions or external data sources. This project showcases how you can use data binding to create dynamic creatives that can be customized based on user input.

## Formats
Formats are predefined sizes and aspect ratios that define the dimensions of your dynamic creatives. Madington MESS supports any format, and you can create custom formats to suit your needs.

## Building and deploying new versions
Once you have built your dynamic creative, you can deploy it to Madington MESS by following these steps:

1. Build your creative by running `pnpm build`.
2. Go to your template in Madington MESS and click on the `Settings` tab.
3. Click on the `Upload new version` button in the `Source files` section.
4. Select the `dist` folder in your project directory and upload the entire contents of the folder. *You might need to allow the browser to upload multiple files.*
5. Click on the `Upload` button to upload the new version of your creative.

## Exporting (Tags)
Once you have built your dynamic creative and defined a style, you can export it to Madington MESS by following these steps:

1. Go to your template in Madington MESS and click on the `Creative Editor` tab.
2. Click on the `Export tag` button in the top right corner of the editor.
3. Select the style that you want to export on the left side.
4. Choose export mode `Iframe` or `Script` at the top based on your needs.
5. Choose the DSP you want to export the tag for.
6. Copy tags you need or download the entire list of tags as a file.

## Exporting (Feeds)
MESS also supports export of feeds in two ways: `Dynamic URL` or `Static` as a `.csv` or `.xslx` file. These feeds are useful if you need to host your creatives in other systems, and want to integrate your dynamic data externally. You can export feeds by following these steps:

1. Go to your template in Madington MESS and click on the `Creative Editor` tab.
2. Click on the `Export feed` button in the top right corner of the editor.

### Dynamic URL
At the top of the modal that appears, you can see the `Dynamic URL` that you can use to fetch the dynamic data from MESS. This is useful if you want to integrate it with other systems that support dynamic data through feed URLs.

### Static File
You can also export the feed as a static file by selecting the rows you want to export and clicking on the `Export` button. You can then choose to export the feed as a `.csv` or `.xslx` file. This is useful if your external platform does not support dynamic feeds, or if you want to host the feed on your own server. Keep in mind that the feed will not be updated automatically if you choose this option, so you will need to re-export the feed whenever the data changes.


# Conclusion
This project is a great starting point for building dynamic creatives for Madington MESS. It showcases how you can use videos, data binding, and other features to create engaging and interactive ads. By following the steps outlined in this readme, you can get started with building your own dynamic creatives and take advantage of the powerful features that Madington MESS has to offer.

If you have any questions or need help with building dynamic creatives for Madington MESS, feel free to reach out to the Madington team. We are here to help you succeed and create amazing ads that drive results.


##### Keywords
- Madington
- MESS
- Dynamic Creatives
- Digital Advertising
- Interactive Ads
- Managed Service
- Streamedby™