/** Define some state variables */
let waitingForProps = false;
let propsTimeout = null;
let styleTimeout = null;
let dataBus = null;
let trackingDetails = {};
const styleArray = [];
const events = [];

/**
 * Track an event
 * @param {'impression' | 'exit'} ev
 * @returns {void | boolean}
 * @example track('impression')
 */
const track = (ev) => {
  if (events[ev] == true) {
    return false;
  }
  events[ev] = true;
  let url = `https://track.streamedby.com/?c=${trackingDetails.creative}&po=${
    trackingDetails.billable
  }&count=${ev}&ord=${Date.now()}`;
  fetch(url);
};

/**
 * Create tracking details
 * @param {string} billable
 * @param {string} size
 * @param {string} name
 * @returns {{billable: string, creative: string}}
 * @example createTrackingDetails('billable', 'size', 'name')
 */
function createTrackingDetails(
  billable = "UNDEFINED_ENTITY",
  size = "NO_SIZE",
  name = "NO_STYLE"
) {
  return {
    billable: billable
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\ {1,}/gim, "_")
      .toUpperCase(),
    creative: `${name
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\ {1,}/gim, "_")
      .toLowerCase()}-${size}`,
  };
}

/**
 * MESS Instance. This function will return the mode of the creative (editor, props or false) and an exit function to handle creative exit. It will also return the tracking details for Streamedby. 
 * In the background it will also handle the communication between the creative and the editor.
 * @param {object} dynamicData The editable data object
 * @param {object} data Proxy object to handle data changes
 * @param {function} updatesBus Function to track changes to data
 * @param {string} billable The billable entity
 * @returns {{mode: Promise<boolean | string>, exit: (url: string) => void, streamedbyTrackingDetails: {po: string, c: string} }} Returns 'editor' or 'props' or false (if not in MESS environment)
 */
export async function MESS(dynamicData, data, updatesBus, billable) {
  dataBus = updatesBus;

  const mode = await new Promise((resolve) => {
    if (!["mess-dev", "mess-style", "props-handler"].includes(window.name)) {
      trackingDetails = createTrackingDetails(
        billable,
        dynamicData?.size,
        dynamicData?.styleName
      );

      // Resolve all smart objects
      Object.entries(dynamicData).forEach(([key, value]) => {
        data[key] = resolveSmartObject(value, dynamicData.size);
      });

      track("impression", billable);
      return resolve(false);
    }

    window.addEventListener(
      "message",
      (event) => {
        eventListener(data, event, resolve);
      },
      false
    );

    if (["mess-dev", "mess-style"].includes(window.name)) {
      waitingForProps = true;
      propsTimeout = setTimeout(() => {
        waitingForProps = false;
        resolve("editor");
      }, 300);
    }

    if (window.name == "props-handler") {
      window.top.postMessage(
        {
          messMessage: "MESS_AVAILABLE_PROPERTIES",
          data: dynamicData,
          boundProps: [],
          availableProperties: dynamicDataToAvailableProperties(dynamicData),
          windowName: window.name,
        },
        "*"
      );
      resolve("props");
    }

    window.top.postMessage(
      {
        messMessage: "MESS_CLIENT_HERE",
        windowName: window.name,
      },
      "*"
    );
  });

  return {
    mode,
    exit: (url = "") => {
      if (!["mess-dev", "mess-style", "props-handler"].includes(window.name)) {
        track("exit");
      }
      window.open(url, "_blank");
    },
    streamedbyTrackingDetails: {
      po: trackingDetails.billable,
      c: trackingDetails.creative,
    }
  };
};

/**
 * Convert dynamic data to available properties
 * @param {object} dynamicData The editable data object
 * @returns {object} The available properties object
 */
function dynamicDataToAvailableProperties(dynamicData) {
  const availableProperties = {};
  Object.entries(dynamicData).forEach((prop) => {
    availableProperties[prop[0]] = {
      dataType: "default",
      defaultValue: prop[1],
    };
  });
  return availableProperties;
}

/**
 * Event listener
 * @param {object} data The tracked data object
 * @param {{prop: string, propValue: string}} event The event object
 * @param {function} resolve The resolve function
 * @returns {void}
 */
function eventListener(data, event, resolve) {
  if (event.data?.messMessage) {
    if (["mess-dev", "mess-style"].includes(window.name)) {
      try {
        if (event.data.messMessage == "MESS_PROP_UPDATE") {
          if (waitingForProps) {
            clearTimeout(propsTimeout);

            styleArray.push([event.data?.prop, event.data?.propValue]);
            clearTimeout(styleTimeout);
            styleTimeout = setTimeout(() => {
              waitingForProps = false;
              styleArray.forEach((keyValue) => {
                data[keyValue[0]] = keyValue[1];
              });
              resolve("editor");
            }, 100);
          } else {
            const value = fixBooleans(resolveSmartObject(event.data.propValue, data.size));
            data[event.data.prop] = value;
            dataBus(event.data.prop, value);
          }
        }
      } catch (e) {
        // Fail silently
      }
    }
  }
}

/**
 * Booleans in MESS can sometimes be strings, this helper function converts them to booleans if we find a string-like boolean
 * @param {any} value
 * @returns {any}
 */
function fixBooleans(value) {
  if (typeof value == "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return value;
}


/**
 * This function will resolve the smart object based on the size of the creative, if no size is provided it will default to the default value
 * If the object is not an object it will return the object as is (e.g. a string)
 * @param {object} obj The object to resolve
 * @param {string} size The size of the creative
 * @returns {string} The resolved value
 */
function resolveSmartObject(obj, size){
  if(typeof obj !== 'object') return obj;
  const sizeKey = size ? `__${size}__` : 'default';
  return obj?.[sizeKey] ?? obj.default ?? '';
}
