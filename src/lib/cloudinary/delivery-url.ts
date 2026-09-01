const cloudinaryUploadMarker = "/image/upload/";
const logoTrimTransformation = "e_trim:10";

export function getLogoDeliveryUrl(url: string) {
  if (
    !url.includes("res.cloudinary.com") ||
    !url.includes(cloudinaryUploadMarker)
  ) {
    return url;
  }

  const [prefix, deliveryPath] = url.split(cloudinaryUploadMarker, 2);

  if (
    !prefix ||
    !deliveryPath ||
    deliveryPath.includes(logoTrimTransformation)
  ) {
    return url;
  }

  return `${prefix}${cloudinaryUploadMarker}${logoTrimTransformation}/${deliveryPath}`;
}
