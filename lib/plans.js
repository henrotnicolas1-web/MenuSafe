export const PLANS = {
  free: {
    name: 'Gratuit',
    price: 0,
    maxRecipes: 3,
    maxEstablishments: 1,
    maxMembers: 1,
    csvExport: false,
    apiAccess: false,
    badge: null,
  },
  solo: {
    name: 'Solo',
    price: 29,
    maxRecipes: 50,
    maxEstablishments: 1,
    maxMembers: 1,
    csvExport: false,
    apiAccess: false,
    badge: null,
  },
  pro: {
    name: 'Pro',
    price: 59,
    maxRecipes: Infinity,
    maxEstablishments: 3,
    maxMembers: 3,
    csvExport: true,
    apiAccess: false,
    badge: 'Plus populaire',
  },
  reseau: {
    name: 'Réseau',
    price: 149,
    maxRecipes: Infinity,
    maxEstablishments: Infinity,
    maxMembers: Infinity,
    csvExport: true,
    apiAccess: true,
    badge: null,
  },
}

export function getPlan(planKey) {
  return PLANS[planKey] ?? PLANS.free
}

export function canAddRecipe(plan, currentCount) {
  return currentCount < getPlan(plan).maxRecipes
}

export function canAddEstablishment(plan, currentCount) {
  return currentCount < getPlan(plan).maxEstablishments
}

export function canAddMember(plan, currentCount) {
  return currentCount < getPlan(plan).maxMembers
}

export function getLimitMessage(feature, plan) {
  const p = getPlan(plan)
  const messages = {
    recipes: `Votre formule ${p.name} est limitée à ${p.maxRecipes} recette${p.maxRecipes > 1 ? 's' : ''}. Passez à la formule supérieure pour en ajouter davantage.`,
    establishments: `Votre formule ${p.name} est limitée à ${p.maxEstablishments} établissement${p.maxEstablishments > 1 ? 's' : ''}. Passez à Pro ou Réseau pour en ajouter.`,
    members: `Votre formule ${p.name} est limitée à ${p.maxMembers} membre${p.maxMembers > 1 ? 's' : ''}. Passez à la formule supérieure pour inviter votre équipe.`,
    csvExport: `L'export CSV est disponible à partir de la formule Pro (59€/mois).`,
    apiAccess: `L'accès API est réservé à la formule Réseau (149€/mois).`,
  }
  return messages[feature] ?? 'Fonctionnalité non disponible sur votre formule actuelle.'
}