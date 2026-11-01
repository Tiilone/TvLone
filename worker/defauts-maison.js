// Réglages par défaut propres à cette copie (absent du dépôt d'origine).
// Ce qu'on obtient sans rien personnaliser : /manifest.json, /collections.json, et le point de départ de la
// salle 2 (« Revenir aux réglages conseillés » y ramène). Les liens perso n'écrivent que leurs différences
// avec ces réglages.

// Affiches : code de la régie (salle 2 → Tes affiches), le même pour le portrait et le paysage.
export const AFFICHES_CODE = "seQ0HpR1D1Y1P1vcVl3b13c13h13i13m13n1";

const DEFAUTS = {
  // Rangées de l'accueil, dans l'ordre.
  r: [
    "accueil-saison", "accueil-top10", "accueil-tendances-series", "accueil-nouveautes-plateformes",
    "accueil-series-a-devorer", "accueil-mini-series", "accueil-cinema-francais", "accueil-films-cultes",
    "accueil-famille", "accueil-anime", "accueil-vod-semaine", "accueil-vod-bientot", "accueil-attendus",
    "accueil-documentaires",
  ],
  // Plateformes : Netflix, Prime Video, Disney+, Apple TV+, HBO Max, Canal+, Paramount+, Crunchyroll.
  p: ["8", "119", "337", "350", "1899", "381", "531", "283"],
  // Collections (grandes tuiles).
  c: ["plateformes-streaming", "envies", "genres", "sagas", "studios", "decennies", "documentaires"],
  // Place des collections sur l'accueil : après les 14 rangées, dans cet ordre.
  ac: [
    { id: "genres", n: 14 }, { id: "envies", n: 14 }, { id: "documentaires", n: 14 },
    { id: "decennies", n: 14 }, { id: "sagas", n: 14 }, { id: "studios", n: 14 },
  ],
};

/** Applique les réglages de cette copie aux réglages d'origine (une valeur absente garde celle d'origine). */
export function avecDefautsMaison(base) {
  const out = { ...base };
  for (const [k, v] of Object.entries(DEFAUTS)) out[k] = JSON.parse(JSON.stringify(v));
  return out;
}
