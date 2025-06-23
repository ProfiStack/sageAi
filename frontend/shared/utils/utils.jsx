import Cookies from 'js-cookie';

// https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value--expires-timestamp-
export const THIRTY_DAYS = 24 * 60 * 60 * 1000 * 90;
export const inOneWeekServer = () => Date.now() + THIRTY_DAYS;

// https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day
export const inOneWeekClient = () => new Date(new Date().getTime() + THIRTY_DAYS);

export const triggerDataLayerError = ({ type, category, message, extraParams }) => {
  if (window?.dataLayer) {
    window.dataLayer.push({
      event: 'errorTracking',
      errorType: type,
      errorCategory: category,
      errorMessage: message,
      ...extraParams,
    });
  }
};

export const triggerGTM = (data) => {
  const authToken = Cookies.get('authToken');
  if (window?.dataLayer) {
    // eslint-disable-next-line no-param-reassign
    data.version_id = '1.0.0';
    // eslint-disable-next-line no-param-reassign
    data.is_logged_in = !!authToken;
    window.dataLayer.push(data);
  }
};

export const formatToArray = (commaSeparated) => commaSeparated.split(',');

export const getDevice = {
  isAndroid: () => {
    if (typeof window === 'undefined') return false;
    const agent = window.navigator.userAgent;
    if (agent.toLowerCase().match(/android/)) {
      return true;
    }
    return false;
  },
  isNewApp: () => {
    const agent = window.navigator.userAgent;
    if (agent.includes('FEATURE_SOCIALLOGIN')) {
      return true;
    }
    return false;
  },
  isApp: () => {
    if (typeof window === 'undefined') return false;
    const agent = window.navigator.userAgent;
    if (
      typeof window.ReactNativeWebView !== 'undefined' ||
      typeof window.gonative !== 'undefined'
    ) {
      return true;
    }
    const isApp = AppUserAgentRegx.test(agent);
    return isApp;
  },
  isIOSApp: () => {
    if (typeof window === 'undefined') return false;
    const agent = window.navigator.userAgent;
    if (
      typeof window.ReactNativeWebView !== 'undefined' ||
      typeof window.gonative !== 'undefined'
    ) {
      return true;
    }
    if (agent.toLowerCase().includes('eyewaappios')) {
      return true;
    }
    return false;
  },
  isIOS: () => {
    if (typeof window === 'undefined') return false;
    const agent = window.navigator.userAgent;

    if (agent.toLowerCase().match(/(ipad|iphone)/)) {
      return true;
    }
    return false;
  },
};

export const getSelectedGender = async () => 'MEN';
export const getSelectedGenderId = async () => '354';

/**
 * Determines whether the code is running in a client-side (browser) context.
 *
 * @returns {boolean} - True if running in a client-side context, false otherwise.
 */
export function isClientContext() {
  if (typeof window === 'undefined') {
    return false;
  }

  return true;
}

export const storeCodeToObj = (storeCode) => {
  if (!storeCode || typeof storeCode !== 'string') {
    return {};
  }
  const countryCode = storeCode?.split('-')[0];
  const languageCode = storeCode?.split('-')[1];

  return {
    storeCode,
    countryCode,
    languageCode,
  };
};

export const getStoreCodeClient = () => {
  const { pathname } = window.location;
  const storeCode = pathname.split('/')[1];
  if (!storeCode) {
    // eslint-disable-next-line
    console.warn('!storeCode');
    return 'ae-en';
  }
  return storeCode;
};
export const getStoreCodeServer = () => {
  // eslint-disable-next-line
  const headerModule = require('next/headers');
  return headerModule.headers().get('x-store');
};

export const getStoreCode = () => {
  if (isClientContext()) {
    return getStoreCodeClient();
  }
  return getStoreCodeServer();
};

export async function setAuthToken(authToken) {
  if (isClientContext()) {
    Cookies.set('authToken', authToken, { expires: inOneWeekClient() });
  } else {
    const { cookies } = await import('next/headers');
    cookies().set('authToken', authToken, { expires: inOneWeekServer() });
  }

  return authToken;
}

export async function setRefreshToken(refreshToken) {
  if (isClientContext()) {
    Cookies.set('refreshToken', refreshToken, { expires: inOneWeekClient() });
  } else {
    const { cookies } = await import('next/headers');
    cookies().set('refreshToken', refreshToken, { expires: inOneWeekServer() });
  }

  return refreshToken;
}

export async function removeAuthToken() {
  if (isClientContext()) {
    Cookies.remove('authToken');
  } else {
    const { cookies } = await import('next/headers');
    cookies().delete('authToken');
  }
}

export async function getAuthToken() {
  let authToken = null;
  if (isClientContext()) {
    authToken = Cookies.get('authToken') ?? null;
  } else {
    const { cookies } = await import('next/headers');
    authToken = cookies().get('authToken')?.value ?? null;
  }

  return authToken;
}

export async function getRefreshToken() {
  let refreshToken = null;
  if (isClientContext()) {
    refreshToken = Cookies.get('refreshToken') ?? null;
  } else {
    const { cookies } = await import('next/headers');
    refreshToken = cookies().get('refreshToken')?.value ?? null;
  }

  return refreshToken;
}

export async function removeRefreshToken() {
  if (isClientContext()) {
    return Cookies.remove('refreshToken');
  }
  const { cookies } = await import('next/headers');
  return cookies().delete('refreshToken');
}

export async function getCookies(cookieKey) {
  if (isClientContext()) {
    return Cookies.get(cookieKey);
  }
  const { cookies } = await import('next/headers');
  return cookies().get(cookieKey)?.value;
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export async function persistCartId(cartId) {
  if (isClientContext()) {
    Cookies.set('cartId', cartId, { expires: inOneWeekClient() });
  } else {
    const { cookies } = await import('next/headers');
    cookies().set('cartId', cartId, { expires: inOneWeekServer() });
  }
}

export async function removePersistedCartId() {
  if (isClientContext()) {
    Cookies.remove('cartId');
  } else {
    const { cookies } = await import('next/headers');
    cookies().delete('cartId');
  }
}

export async function getCartId() {
  let cartId = null;
  if (isClientContext()) {
    const urlParams = new URLSearchParams(window.location.search);
    const instantCartId = urlParams.get('cartId');
    cartId = instantCartId || Cookies.get('cartId');
  } else {
    const { cookies } = await import('next/headers');
    cartId = cookies().get('cartId')?.value;
  }

  return cartId;
}

export async function persistOrderId(orderId) {
  if (isClientContext()) {
    Cookies.set('orderId', orderId, { expires: inOneWeekClient() });
  } else {
    const { cookies } = await import('next/headers');
    cookies().set('orderId', orderId, { expires: inOneWeekServer() });
  }
}

export async function removePersistedOrderId() {
  if (isClientContext()) {
    Cookies.remove('orderId');
  } else {
    const { cookies } = await import('next/headers');
    cookies().delete('orderId');
  }
}

export async function getOrderId() {
  let orderId = null;
  if (isClientContext()) {
    orderId = Cookies.get('orderId');
  } else {
    const { cookies } = await import('next/headers');
    orderId = cookies().get('orderId')?.value;
  }
  return orderId;
}

export async function removeGuestPhone() {
  if (isClientContext()) {
    Cookies.remove('guestPhone');
  } else {
    const { cookies } = await import('next/headers');
    cookies().delete('guestPhone');
  }
}

export async function persistGuestPhone(guestPhone) {
  if (isClientContext()) {
    Cookies.set('guestPhone', guestPhone, { expires: inOneWeekClient() });
  } else {
    const { cookies } = await import('next/headers');
    cookies().set('guestPhone', guestPhone, { expires: inOneWeekServer() });
  }
}

export async function getAddressFlag() {
  let addressFlag = null;
  if (isClientContext()) {
    addressFlag = Cookies.get('addressFlag');
  } else {
    const { cookies } = await import('next/headers');
    addressFlag = cookies().get('addressFlag')?.value;
  }
  return addressFlag;
}

export async function removeAddressFlag() {
  if (isClientContext()) {
    Cookies.remove('addressFlag');
  } else {
    const { cookies } = await import('next/headers');
    cookies().delete('addressFlag');
  }
}

export async function persistAddressFlag(addressFlag) {
  if (isClientContext()) {
    Cookies.set('addressFlag', addressFlag);
  } else {
    const { cookies } = await import('next/headers');
    cookies().set('addressFlag', addressFlag);
  }
}

export async function getUserLat() {
  let userLat = null;
  if (isClientContext()) {
    userLat = Cookies.get('userLat');
  } else {
    const { cookies } = await import('next/headers');
    userLat = cookies().get('userLat')?.value;
  }
  return userLat;
}

export async function removeUserLat() {
  if (isClientContext()) {
    Cookies.remove('userLat');
  } else {
    const { cookies } = await import('next/headers');
    cookies().delete('userLat');
  }
}

export async function persistUserLat(userLat) {
  if (isClientContext()) {
    Cookies.set('userLat', userLat, { expires: inOneWeekClient() });
  } else {
    const { cookies } = await import('next/headers');
    cookies().set('userLat', userLat, { expires: inOneWeekClient() });
  }
}

export async function getUserLng() {
  let userLng = null;
  if (isClientContext()) {
    userLng = Cookies.get('userLng');
  } else {
    const { cookies } = await import('next/headers');
    userLng = cookies().get('userLng')?.value;
  }
  return userLng;
}

export async function removeUserLng() {
  if (isClientContext()) {
    Cookies.remove('userLng');
  } else {
    const { cookies } = await import('next/headers');
    cookies().delete('userLng');
  }
}

export async function persistUserLng(userLng) {
  if (isClientContext()) {
    Cookies.set('userLng', userLng, { expires: inOneWeekClient() });
  } else {
    const { cookies } = await import('next/headers');
    cookies().set('userLng', userLng, { expires: inOneWeekClient() });
  }
}

export async function getUserLocation() {
  let userLocation = null;
  if (isClientContext()) {
    userLocation = Cookies.get('userLocation');
  } else {
    const { cookies } = await import('next/headers');
    userLocation = cookies().get('userLocation')?.value;
  }
  return userLocation;
}

export async function removeUserLocation() {
  if (isClientContext()) {
    Cookies.remove('userLocation');
  } else {
    const { cookies } = await import('next/headers');
    cookies().delete('userLocation');
  }
}

export async function persistUserLocation(userLocation) {
  if (isClientContext()) {
    Cookies.set('userLocation', userLocation, { expires: inOneWeekClient() });
  } else {
    const { cookies } = await import('next/headers');
    cookies().set('userLocation', userLocation, { expires: inOneWeekClient() });
  }
}

export async function getGuestPhone() {
  let guestPhone = null;
  if (isClientContext()) {
    guestPhone = Cookies.get('guestPhone');
  } else {
    const { cookies } = await import('next/headers');
    guestPhone = cookies().get('guestPhone')?.value;
  }
  return guestPhone;
}

export function isMobileClient() {
  if (!isClientContext()) {
    return false;
  }

  let check = false;
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      userAgent,
    ) ||
    // eslint-disable-next-line no-useless-escape
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      userAgent.substr(0, 4),
    )
  ) {
    check = true;
  }
  return check;
}

export function navigateToAppDownload({ clickLocation = 'homepage' }) {
  triggerGTM({
    event: 'get_app_clicked',
    click_location: clickLocation,
  });
  if (navigator.userAgent.toLowerCase().indexOf('iphone') > -1) {
    window.location.href = 'https://eyewa.onelink.me/66lS/bpatc70v';
  }

  if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
    window.location.href = 'https://eyewa.onelink.me/66lS/bpatc70v';
  }

  // Update #2
  if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    // Desktop Browser
    window.location.href = 'https://eyewa.onelink.me/66lS/bpatc70v';
  }
}

export const transformToFilters = (obj) =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key] = { in: [obj[key]] };
    return acc;
  }, {});

export function hydrateMobileNumber(number, length = 9) {
  if (number) {
    return {
      watchMobileNumber: number.replace(/\s/g, ''),
      isValidMobileLength: number.replace(/\s/g, '').length === length,
    };
  }
  return {
    watchMobileNumber: null,
    isValidMobileLength: false,
  };
}

export function redirectToGoogleMaps([lat, lng]) {
  const url = `https://www.google.com/maps/@${lat},${lng},18z?entry=ttu`;
  window.open(url, '_blank'); // Open in a new tab
}

export function roundToSingleDecimal(number) {
  return Math.round(number * 10) / 10;
}

function radians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Haversine formula function
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = radians(lat2 - lat1);
  const dLng = radians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestStores(stores, origin, limit = -1) {
  // Calculate the distance for each store
  return (
    stores
      .map((store) => {
        const storeLat = store.locationInfo.lat;
        const storeLng = store.locationInfo.lng;

        // Use Haversine formula to calculate distance (in kilometers)
        const distanceFromOrigin = calculateDistance(origin.lat, origin.lng, storeLat, storeLng);

        // Return an object with store information and distance
        return {
          ...store,
          locationInfo: {
            ...store.locationInfo,
            distanceFromOrigin,
          },
        };
      })
      // Sort stores by distance from origin (ascending order)
      .sort(
        (store1, store2) =>
          store1.locationInfo.distanceFromOrigin - store2.locationInfo.distanceFromOrigin,
      )
      .slice(0, limit)
  );
}

export const getDevicePrefix = (isMobile) => (isMobileClient() || isMobile ? '' : '');

export const getPath = (path, params = {}) => {
  const devicePrefix = getDevicePrefix(params?.isMobile);
  const storePrefix = params?.store || getStoreCode();

  return `/${storePrefix}${devicePrefix}${path}`;
};

export const formatNumberForInputMask = (numberString) => {
  const match = numberString.match(/^(\d{2})(\d{3})(\d{4})$/);
  return match ? `${match[1]} ${match[2]} ${match[3]}` : numberString;
};

export function addPlusIfNeeded(str) {
  if (str?.charAt(0) !== '+') {
    return `+${str}`;
  }
  return str;
}

export const isNativeApplePaySupported = () => {
  const AppFeatureAppleNativeEnabled = 'FEATURE_NATIVE_APPLEPAY';
  const agent = window.navigator.userAgent;
  const isNewApp = agent.indexOf(AppFeatureAppleNativeEnabled) > -1 || false;
  const isApplePaySupported = window.ApplePaySession && window.ApplePaySession.canMakePayments();
  const result =
    (window.ReactNativeWebView && !getDevice.isAndroid() && isNewApp) || isApplePaySupported;
  return result;
};

export const getDataFromLocationPicker = ({ location, customerInfo }) => {
  const addressComponents = location?.details?.address_components;
  const localityAddress = addressComponents?.find(
    (component) =>
      component.types.includes('locality') ||
      component.types.includes('administrative_area_level_1') ||
      component.types.includes('country') ||
      component.types.includes('political'),
  );
  const plusCode =
    addressComponents?.find((component) => component.types.includes('plus_code')) ||
    location?.details?.plus_code;

  const area = addressComponents?.find(
    (component) =>
      component.types.includes('neighborhood') ||
      component.types.includes('sublocality_level_1') ||
      component.types.includes('sublocality') ||
      component.types.includes('premise'),
  );

  const country = addressComponents?.find((component) => component.types.includes('country'));

  return {
    fullName: `${customerInfo.firstname} ${customerInfo.lastname}`,
    telephone: addPlusIfNeeded(customerInfo.countryCode + customerInfo.mobileNumber),
    default_shipping: true,
    default_billing: true,
    area: area?.long_name || area?.short_name || location?.area,
    city: localityAddress?.short_name || location?.details?.vicinity || location?.city,
    street: location?.details?.formatted_address,
    gmap_coordinates: plusCode?.short_name || plusCode?.compound_code || location?.gmap_coordinates,
    latitude: Number(location.lat) || location?.details?.lat,
    longitude: Number(location.lng) || location?.details?.lng,
    country_id: country?.short_name || 'AE',
    apartment: location?.apartment,
  };
};

export function isNumeric(str) {
  if (typeof str !== 'string') return false; // we only process strings!
  return (
    !Number.isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !Number.isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export function handleFormatMobileNumberMask(mobile) {
  if (mobile) {
    let str = '';
    for (let i = 0; i < mobile.length; i += 1) {
      str += mobile[i];
      if (mobile[2] === ' ') {
        return mobile;
      }
      if (i === 1) {
        str += ' ';
      } else if (i === 4) {
        str += ' ';
      }
    }
    return str;
  }
  return '';
}

export const stripHtmlTags = (str) => {
  if (str === null || str === '') return str;
  return str?.replace(/<[^>]*>/g, '').replace(/(\r\n|\n|\r)/g, ' ');
};

export function calculatePercentage(profile) {
  const requiredFields = ['name', 'email', 'dob', 'phoneNumber', 'gender'];
  const fieldWeight = 100 / requiredFields.length;
  let completion = 0;
  requiredFields.forEach((field) => {
    if (profile[field]) {
      completion += fieldWeight;
    }
  });
  return completion;
}
