import "./style.css";
import { MESS } from "./mess.js";

const billable = ""; // Define billable entity, eg. MDTN / PBLS / STCM / YOUR OWN COMPANY SHORTCODE

const elementClasses = {
  video: "absolute inset-0 object-cover w-full h-full",
  image: "absolute inset-0 object-cover w-full h-full",
};

const elementAttributes = {
  video: {
    autoplay: true,
    muted: true,
    playsinline: true,
    loop: true,
  },
};
const elementCache = {}; // Element cache to store elements for later use

(async () => {
  const url = new URL(window.location.href); // Get URL
  const params = url.searchParams; // Get URL parameters
  const clickTag = params.get("clickTag"); // Get clickTag parameter

  /** Initialize dynamicData and define editable properties with optional default/fallback values
   * window.dynamicContent is provided by the ad server (when served live) and contains the dynamic data for the creative
   * If window.dynamicContent is not available (e.g. in editor), use a fallback object with default values.
   * These properties can be edited and configured in MESS.
   */
  const dynamicData = window.dynamicContent ?? {
    headline: "My Creative",
    cta: "Click Here",
    ctaRounding: "1em",
    contentColor: "#000000",
    backgroundColor: "#ffffff",
    useCta: true,
    videoStream: "",
    video: "",
    image: "",
    exitUrl: "https://madington.com",
    lang: "en",
  };

  /** Create a Proxy object to handle data changes, and set runtime properties that can be used in the creative, but not editable in MESS
   */
  const data = new Proxy(
    Object.assign(
      {
        state: "loading",
      },
      { ...dynamicData }
    ),
    {
      set: (target, property, value) => {
        const result = Reflect.set(target, property, value);
        // This is a perfect place to add logic to handle data changes
        reflectUpdate(property, value); // Call reflectUpdate function to handle data changes
        return result;
      },
      get: (target, property) => {
        return target[property];
      },
    }
  );

  let resolveReady; // Placeholder for resolve function

  // Create a promise to handle readiness of the creative
  const ready = new Promise((resolve) => {
    resolveReady = resolve;
  });

  /**
   * Create MESS instance, get creative mode, exit handler and trackingDetails for Streamedby.
   */
  const { mode, exit, streamedbyTrackingDetails } = await MESS(
    dynamicData,
    data,
    onChange,
    billable
  );

  resolveReady(); // Resolve the ready promise, since MESS is ready

  // Here's how you can handle the creative for different viewing scenarios
  // if (mode === "editor") {
  //   // If your creative is in editor mode you can add special logic here
  // } else if (mode === "props") {
  //   // Properties handler, you can add special logic here for handling properties (probably not needed in most cases)
  // } else {
  //   // Not in MESS environment, add separate logic for when the creative is served outside of editor (e.g. live environment)
  // }

  // Wait for the document to be fully loaded before starting the creative
  if (document.readyState !== "loading") {
    startCreative();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      startCreative();
    });
  }

  /* Sample Click-listener to handle creative exit */
  window.addEventListener("click", () => {
    exit((data.exitUrl || "") + (clickTag || "")); // Exit function to handle clickTag
  });

  /**
   * Function to start your creative logic
   * @returns {void}
   */
  function startCreative() {
    data.state = "ready"; // Set state to ready

    // Start your creative logic here

    if (!mode) {
      // Since we're in live mode (mode == false), we can assume the data is final, so let's reflect it in the creative
      Object.entries(data).forEach(([key, value]) => {
        reflectUpdate(key, value);
      });
    }
  }

  /**
   * Function to track changes to data, useful if you need to run separate logic when data changes
   * @param {string} key - The key of the data that has changed
   * @param {string} value - The new value of the data
   * @returns {void}
   */
  function onChange(key, value) {
    // console.log(key, value);
  }

  /**
   * Sample function to handle data changes and reflect them in the creative
   * @param {string} property - The property that has changed
   * @param {any} value - The new value of the property
   * @returns {void}
   * @example reflectUpdate('text', 'Hello World!')
   */
  async function reflectUpdate(property, value) {
    await ready;
    if (property == "backgroundColor") {
      element(":root").style.setProperty("--bgColor", value);
    } else if (property == "contentColor") {
      element(":root").style.setProperty("--contentColor", value);
    } else if (property == "headline") {
      element(".headline").innerText = value;
    } else if (property == "cta") {
      element("button span").innerText = value;
    } else if (property == "ctaRounding") {
      element("button").style.borderRadius = value;
    } else if (property == "useCta") {
      const buttonWrap = element(".button-wrap");
      const button = element("button");

      if (value) {
        buttonWrap.appendChild(button);
      } else {
        elementCache["button"] = buttonWrap.removeChild(button);
      }
    } else if (["videoStream", "video", "image"].includes(property)) {
      const videoWrap = element(".video-wrap");
      const imageWrap = element(".image-wrap");

      if (value) {
        if (["videoStream", "video"].includes(property)) {
          videoWrap.innerHTML = "";
          const video = elementFactory(
            "video",
            elementClasses.video.split(" "),
            elementAttributes.video
          );
          video.autoplay = true;
          video.muted = true;
          video.playsinline = true;
          video.loop = true;

          if (data.videoStream) {
            Streamedby({
              videoElem: video, // Target your video element
              stream: data.videoStream, // Get the video stream id from the data object
              trackImpression: false, // Keep false, as MESS will handle this
              trackingDetails: streamedbyTrackingDetails, // Supply tracking details for Streamedby
            });
          } else {
            video.src = value;
          }
          videoWrap.appendChild(video);
        } else {
          imageWrap.innerHTML = "";
          const image = elementFactory("img", elementClasses.image.split(" "));
          image.src = value;
          imageWrap.appendChild(image);
        }
      } else {
        if (
          ["videoStream", "video"].includes(property) &&
          !data.videoStream &&
          !data.video
        ) {
          videoWrap.innerHTML = "";
        } else if (property == "image") {
          imageWrap.innerHTML = "";
        }
      }
    }
  }

  /**
   * Function to create an element with classes
   * @param {string} tag - The tag of the element
   * @param {string[]} classes - An array of classes to add to the element
   */
  function elementFactory(tag, classes = []) {
    const element = document.createElement(tag);
    classes.forEach((className) => element.classList.add(className));
    return element;
  }

  /**
   * Function to get an element from the DOM, and cache it for later use
   * @param {string} selector - The selector to query the DOM
   * @returns {HTMLElement} The element from the DOM
   * @example element('.selector')
   */
  function element(selector) {
    if (elementCache[selector]) {
      return elementCache[selector];
    } else {
      return (elementCache[selector] = document.querySelector(selector));
    }
  }
})();
