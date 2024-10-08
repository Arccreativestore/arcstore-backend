import {
  ADOBE_API_KEY,
  BEHANCE_API_KEY,
  BEHANCE_BASE_URL,
  DRIBBLE_API_KEY,
  DRIBBLE_BASE_URL,
  ENVATO_API_KEY,
  ENVATO_BASE_URL,
  FREEPIK_API_KEY,
  FREEPIK_BASE_URL,
  INSTAGRAM_API_KEY,
  INSTAGRAM_BASE_URL,
  MOBBIN_API_KEY,
  MOBBIN_BASE_URL,
  PINTEREST_API_KEY,
  PINTEREST_BASE_URL,
  TIKTOK_API_KEY,
  TIKTOK_BASE_URL,
  YANDEX_API_KEY,
  YANDEX_BASE_URL,
} from "../../../config/config";

export const apiAuthHeader = {
  adobeStock: {
    baseUrl: process.env.ADOBE_BASE_URL || "",
    authHeader: `Bearer ${ADOBE_API_KEY || ""}`,
  },
  pinterest: {
    baseUrl: PINTEREST_BASE_URL || "",
    authHeader: `Bearer ${PINTEREST_API_KEY || ""}`,
  },
  behance: {
    baseUrl: BEHANCE_BASE_URL || "",
    authHeader: `Client-ID ${BEHANCE_API_KEY || ""}`,
  },
  dribble: {
    baseUrl: DRIBBLE_BASE_URL || "",
    authHeader: `Bearer ${DRIBBLE_API_KEY || ""}`,
  },
  freepik: {
    baseUrl: FREEPIK_BASE_URL || "",
    authHeader: `Bearer ${FREEPIK_API_KEY || ""}`,
  },
  instagram: {
    baseUrl: INSTAGRAM_BASE_URL || "",
    authHeader: `Bearer ${INSTAGRAM_API_KEY || ""}`,
  },
  tiktok: {
    baseUrl: TIKTOK_BASE_URL || "",
    authHeader: `Bearer ${TIKTOK_API_KEY || ""}`,
  },
  mobbin: {
    baseUrl: MOBBIN_BASE_URL || "",
    authHeader: `Bearer ${MOBBIN_API_KEY || ""}`,
  },
  envato: {
    baseUrl: ENVATO_BASE_URL || "",
    authHeader: `Bearer ${ENVATO_API_KEY || ""}`,
  },
  yandex: {
    baseUrl: YANDEX_BASE_URL || "",
    authHeader: `Bearer ${YANDEX_API_KEY || ""}`,
  },
};


export enum PlatformEnum {
  AdobeStock = "adobeStock",
  Pinterest = "pinterest",
  Behance = "behance",
  Dribble = "dribble",
  Freepik = "freepik",
  Instagram = "instagram",
  TikTok = "tiktok",
  Mobbin = "mobbin",
  Envato = "envato",
  Yandex = "yandex",
}
