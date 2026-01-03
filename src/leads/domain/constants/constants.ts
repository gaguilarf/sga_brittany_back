export const PRODUCTOS = [
  "Curso de 1 año",
  "Curso de 18 meses",
  "Curso kids",
  "Curso prekids",
  "Examen internacional British council",
  "Preparación para exámenes internacionales",
  "Clases particulares",
  "Curso de inglés a distancia (edusoft)",
  "Curso TEFL",
  "Clubes de conversación",
  "Programa au pair",
  "Programa viajes 360",
];

export const SEDES = [
  "Lima - Miraflores",
  "Lima - Lince",
  "Arequipa - José Luis Bustamante R.",
  "Arequipa - San José",
  "Arequipa - Umacollo",
  "Arequipa - Cayma",
  "Arequipa - Bustamante Kids",
] as const;

export const MEDIOS_CONTACTO = [
  "TikTok",
  "Instagram",
  "Facebook",
  "Google",
  "Recomendación",
  "Volante",
  "Otro",
] as const;

export type Modalidad = "Virtual" | "Presencial";
export type Sede = typeof SEDES[number];
export type MedioContacto = typeof MEDIOS_CONTACTO[number];
