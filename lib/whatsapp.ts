import { site } from "@/content";

export const whatsappLink = (text: string) => `${site.phone.whatsapp}?text=${encodeURIComponent(text)}`;

export const mapsEmbedUrl = () => `https://www.google.com/maps?q=${site.map.lat},${site.map.lng}&z=16&output=embed`;
