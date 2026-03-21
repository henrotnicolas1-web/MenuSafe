import React from "react";
import { notFound } from "next/navigation";

const ARTICLES = {
  "obligation-allergenes-restaurant-france": {
    title: "Allergènes en restaurant : ce que la loi vous oblige vraiment à faire",
    description: "Le règlement INCO oblige tous les restaurants à déclarer 14 allergènes par écrit. Obligations, sanctions et mise en conformité expliqués.",
    date: "2026-03-01", readTime: "8 min", category: "Réglementation",
    content: `
## Ce que dit exactement la loi

Le règlement européen n°1169/2011 — dit règlement INCO (Information des Consommateurs sur les denrées alimentaires) — est entré en vigueur en France le 13 décembre 2014. Il s'applique à **tous les établissements de restauration commerciale** sans exception : restaurants gastronomiques, brasseries, snacks, food trucks, boulangeries, hôtels, traiteurs, cantines d'entreprise.

L'obligation est simple dans son principe : vous devez informer vos clients, **par écrit**, de la présence des 14 allergènes majeurs dans chacun de vos plats.

## Les 14 allergènes obligatoires

La liste est fixée par l'annexe II du règlement INCO :

1. **Gluten** — blé, seigle, orge, avoine, épeautre
2. **Crustacés** — crevettes, homard, crabe, langoustine
3. **Œufs** — sous toutes leurs formes et dérivés
4. **Poissons** — tous les poissons et produits dérivés
5. **Arachides** — cacahuètes et produits à base d'arachides
6. **Soja** — tofu, lait de soja, édamame, miso
7. **Lait** — lait, beurre, fromage, crème, yaourt
8. **Fruits à coque** — noix, noisette, amande, cajou, pistache, noix de coco
9. **Céleri** — céleri-rave, graines, céleri branche
10. **Moutarde** — graines, farine, huile de moutarde
11. **Graines de sésame** — tahini, huile de sésame, pain au sésame
12. **Sulfites/SO₂** — vins, fruits secs, vinaigre, conserves
13. **Lupin** — farine de lupin, graines de lupin
14. **Mollusques** — moules, huîtres, coquilles Saint-Jacques, palourdes

## Ce que "par écrit" signifie concrètement

C'est ici que beaucoup de restaurateurs commettent l'erreur. La déclaration verbale — "demandez à votre serveur" — **n'est pas conforme** à la réglementation. Le document doit être :

- **Écrit** : sur papier, sur un support numérique (tablette, QR code), ou affiché
- **Accessible** : le client doit pouvoir le consulter sans demander
- **À jour** : reflétant exactement la composition réelle des plats servis ce jour-là

Un classeur papier peut être conforme si il est systématiquement mis à jour. Un PDF sur une tablette peut être conforme. Un QR code menant vers une fiche détaillée est conforme.

## Les sanctions en cas de non-conformité

La Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes (DGCCRF) et la Direction Départementale de l'Emploi, du Travail, des Solidarités et de la Protection des Populations (DDETSPP) effectuent des contrôles.

En cas d'infraction :
- **Amende administrative** : jusqu'à 1 500€ par infraction constatée
- **Publication sur Alim'Confiance** : visible sur le site gouvernemental, indexé par Google, visible dans les résultats de recherche de votre restaurant
- **Mise en demeure** : délai pour se conformer, avec contrôle de suivi
- **Fermeture temporaire** : en cas de récidive ou d'infraction grave

Une infraction n'est pas un avertissement — c'est une amende directe. Et une publication sur Alim'Confiance avec une mauvaise note peut avoir des conséquences durables sur votre réputation.

## Les erreurs les plus fréquentes

**1. Se fier à la mémoire du personnel**
Le serveur pense connaître les ingrédients. Mais si la recette a changé, si un fournisseur a changé de formule, ou si le serveur confond deux plats, vous êtes responsable.

**2. Mettre à jour les plats sans mettre à jour la déclaration**
Nouveau plat du jour, changement de fournisseur, ingrédient en rupture remplacé par un autre — si votre déclaration allergènes n'est pas synchronisée avec votre cuisine en temps réel, vous êtes en infraction.

**3. Considérer que certains établissements ne sont pas concernés**
Boulangeries, cafés, food trucks, restauration rapide — tous sont concernés, sans exception.

**4. Confondre "sans" et "peut contenir des traces de"**
La mention "peut contenir des traces de" n'est pas obligatoire (elle relève du volontariat) mais si vous la mentionnez, elle doit être exacte.

## Comment se conformer rapidement

La mise en conformité n'est pas aussi complexe qu'elle y paraît. Les étapes sont :

1. **Listez tous vos plats** avec leurs ingrédients exacts
2. **Identifiez les allergènes** dans chaque ingrédient
3. **Documentez par écrit** — classeur, PDF ou solution numérique
4. **Formez votre équipe** à maintenir cette documentation à jour
5. **Rendez l'information accessible** à vos clients sans qu'ils aient à la demander

MenuSafe automatise les étapes 2 à 5 : vous entrez vos ingrédients, les allergènes sont détectés automatiquement, et une carte interactive avec QR code est générée instantanément.
    `,
  },
  "amende-dgccrf-allergenes-restauration": {
    title: "Amende DGCCRF allergènes : combien risquez-vous vraiment ?",
    description: "1 500€ par infraction, Alim'Confiance, fermeture. Comment se déroulent les contrôles DGCCRF et comment vous protéger.",
    date: "2026-03-05", readTime: "6 min", category: "Réglementation",
    content: `
## Comment se déroule un contrôle DGCCRF

Les inspecteurs de la DGCCRF et de la DDETSPP effectuent des contrôles de manière inopinée — sans prévenir. Ils peuvent se présenter à n'importe quelle heure d'ouverture de votre établissement.

Lors d'un contrôle allergènes, l'inspecteur vérifie :
- L'existence d'une déclaration écrite des allergènes pour chaque plat
- La conformité de cette déclaration avec les plats réellement servis
- L'accessibilité de l'information pour les clients
- La cohérence entre la carte, les fiches allergènes et la réalité en cuisine

## Les sanctions réelles

**L'amende de 1 500€** est la sanction de première instance pour une infraction constatée. Mais ce n'est pas la seule conséquence :

### Publication sur Alim'Confiance
Alim'Confiance est le site officiel du ministère de l'Agriculture qui publie les résultats des contrôles sanitaires. Une note défavorable apparaît dans les résultats Google quand un client cherche votre restaurant. C'est une conséquence souvent plus grave que l'amende elle-même.

### La mise en demeure
Avant l'amende, vous pouvez recevoir une mise en demeure — un délai pour corriger la situation. Mais ce n'est pas systématique, et certaines infractions sont sanctionnées directement.

### La fermeture administrative
En cas de récidive ou d'infraction jugée grave (allergie avérée d'un client), une fermeture temporaire peut être prononcée.

## Qui contrôle quoi ?

- **DGCCRF** : contrôles sur l'information consommateur, l'étiquetage, la publicité alimentaire
- **DDETSPP** (ex-DDPP) : contrôles sanitaires, hygiène, sécurité alimentaire
- **DIRECCTE** (dans certaines régions) : fraudes alimentaires

Ces organismes peuvent se coordonner. Un contrôle hygiène peut déboucher sur une vérification allergènes.

## Les secteurs les plus contrôlés

D'après les rapports annuels de la DGCCRF, les secteurs prioritaires sont :
- La restauration rapide (McDonald's, kebabs, sushis)
- Les food trucks et marchés alimentaires
- Les cantines scolaires et d'entreprise
- Les traiteurs et buffets

Cela ne signifie pas que les restaurants traditionnels sont exemptés — simplement que les contrôles sont proportionnels au volume de clients servis et au risque perçu.

## Comment se protéger concrètement

La protection passe par une documentation irréprochable :

**1. La traçabilité des modifications** : chaque changement de recette doit être daté et documenté. Si un inspecteur vous demande "depuis quand ce plat ne contient plus de gluten ?", vous devez pouvoir répondre.

**2. La cohérence cuisine/salle** : votre chef de cuisine et votre équipe en salle doivent travailler avec le même référentiel. Un plat modifié en cuisine doit être modifié dans la fiche allergènes le jour même.

**3. L'accessibilité client** : l'information doit être disponible sans que le client ait à demander. Un QR code sur la table, un classeur visible, une tablette dédiée — peu importe le format, du moment que le client peut y accéder seul.

**4. La formation du personnel** : un inspecteur peut poser des questions à vos serveurs. S'ils ne savent pas où trouver l'information allergènes ou s'ils répondent "demandez en cuisine", c'est une infraction.
    `,
  },
  "carte-allergenes-qr-code-restaurant": {
    title: "QR code allergènes : la solution moderne pour votre restaurant",
    description: "Un QR code sur chaque table remplace le classeur papier. Mode d'emploi complet pour la mise en place d'une carte allergènes numérique.",
    date: "2026-03-08", readTime: "5 min", category: "Solutions",
    content: `
## Pourquoi le QR code est la meilleure solution

Le classeur papier a un défaut majeur : il se périme. À chaque modification de carte, il faut imprimer, plastifier, mettre à jour. Entre la modification en cuisine et la mise à jour du classeur, il peut s'écouler des jours — pendant lesquels vous êtes en infraction.

Le QR code résout ce problème à sa racine. Le code ne change jamais — c'est lui que vous imprimez une seule fois et collez sur vos tables. Ce qui change, c'est la page vers laquelle il pointe. Modifiez votre carte dans l'application, la page se met à jour immédiatement. Votre QR code sur table affiche toujours l'information actuelle.

## Comment fonctionne un QR code allergènes

1. **Votre client scanne le QR code** avec son téléphone — pas d'application à télécharger, ça fonctionne directement dans le navigateur
2. **Il voit la liste de vos plats** avec leurs ingrédients et allergènes
3. **Il peut filtrer** en cochant ses propres allergies — les plats incompatibles s'affichent en grisé avec une alerte
4. **Il peut choisir sa langue** si c'est un client étranger — jusqu'à 8 langues disponibles

Pour vous, aucune manipulation au moment du service. La conformité est continue, automatique, et vérifiable.

## Ce que dit la loi sur le QR code

La réglementation INCO exige une information "disponible et aisément accessible". Un QR code sur table satisfait pleinement cette exigence, à condition que :
- L'information à laquelle il donne accès soit complète et à jour
- Le client puisse y accéder facilement (téléphone, pas d'application requise)
- L'information couvre bien les 14 allergènes obligatoires

Les contrôleurs DGCCRF acceptent les solutions numériques. Ce qui compte, c'est la conformité et l'accessibilité de l'information.

## Mise en place pratique

### Étape 1 : Saisir vos recettes
Pour chaque plat, entrez les ingrédients. La détection des allergènes est automatique — "mozzarella" → lait, "beurre" → lait, "farine" → gluten. Vous vérifiez et corrigez si nécessaire.

### Étape 2 : Générer votre QR code
Votre QR code est généré automatiquement. Il est permanent — il ne changera jamais, quelle que soit l'évolution de votre carte.

### Étape 3 : Imprimer et placer
Imprimez votre QR code (idéalement en format carte postale ou sous-verre). Plastifiez-le et posez-le sur vos tables. C'est terminé.

### Étape 4 : Maintenance en continu
À chaque modification de carte — nouveau plat, ingrédient changé, plat retiré — mettez à jour dans l'application. La carte QR code se met à jour en temps réel. Aucune réimpression.

## Pour aller plus loin

Combinez le QR code allergènes avec la fonction multilingue : vos clients britanniques, espagnols, allemands ou japonais voient automatiquement la carte dans leur langue. Un seul QR code, 8 langues.
    `,
  },
  "menu-multilingue-restaurant-touristes": {
    title: "Carte de restaurant multilingue : comment accueillir les touristes étrangers",
    description: "8 langues, traduction automatique, filtrage allergènes. Comment équiper votre restaurant pour les clientèles britanniques, espagnoles, allemandes et asiatiques.",
    date: "2026-03-12", readTime: "7 min", category: "Solutions",
    content: `
## L'enjeu du tourisme en restauration française

La France accueille chaque année plus de 90 millions de touristes étrangers, dont une part significative fréquente des restaurants. Ces clients ont deux attentes majeures : comprendre ce qu'ils commandent, et pouvoir vérifier les allergènes dans leur langue.

Un client britannique allergique aux crustacés qui ne comprend pas votre carte en français est un client qui commande "au hasard" — avec tous les risques que cela implique pour lui et pour vous.

## Les 8 langues les plus demandées

Les langues prioritaires pour la restauration française sont, dans l'ordre de fréquentation touristique :

1. **Anglais** — première langue étrangère, couvre les touristes britanniques, américains, australiens, canadiens anglophone
2. **Espagnol** — touristes espagnols, mais aussi sud-américains
3. **Allemand** — forte présence touristique allemande et autrichienne
4. **Italien** — en particulier dans les régions frontalières
5. **Néerlandais** — touristes néerlandais et belges flamands
6. **Japonais** — clientèle touristique japonaise importante dans les grandes villes
7. **Mandarin** — touristes chinois, en forte croissance
8. **Français** — la langue de base, toujours disponible

## Comment fonctionne la traduction automatique par IA

La traduction manuelle d'une carte de 30 plats dans 8 langues représente des dizaines d'heures de travail et un coût significatif si vous faites appel à un traducteur professionnel.

L'IA change la donne. En photographiant votre carte existante, un modèle de langage analyse les plats, comprend les ingrédients dans leur contexte culinaire, et génère des traductions naturelles dans 8 langues simultanément.

"Magret de canard confit aux cerises et jus de truffe" n'est pas traduit mot à mot — l'IA comprend que c'est un plat culinaire français et produit une traduction appropriée en anglais, japonais ou mandarin.

Ces traductions sont générées une seule fois, stockées, et affichées instantanément quand le client change de langue. Aucun coût additionnel, aucune latence.

## L'impact sur l'expérience client

Un client qui peut lire la carte dans sa langue commande différemment :
- Il fait des choix plus éclairés, adapté à ses préférences réelles
- Il identifie les plats qui contiennent ses allergènes avant de commander
- Il perçoit l'établissement comme professionnel et attentionné
- Il est plus susceptible de laisser un avis positif

La carte multilingue n'est pas qu'un outil de conformité — c'est un outil de conversion et de fidélisation.

## Mise en place sans friction

La solution idéale est celle que vous n'avez à configurer qu'une seule fois :

1. Vous importez votre carte (photo ou saisie manuelle)
2. L'IA génère les traductions dans les 8 langues
3. Un QR code permanent est créé
4. Vos clients choisissent leur langue en scannant le code
5. Quand vous modifiez un plat, la mise à jour est instantanée dans toutes les langues

L'ensemble du système fonctionne sans application à télécharger pour vos clients, depuis n'importe quel smartphone.
    `,
  },
  "14-allergenes-liste-complete-restauration": {
    title: "Les 14 allergènes obligatoires : guide complet pour les restaurateurs",
    description: "Guide complet sur les 14 allergènes à déclarer obligatoirement : présence dans les aliments, risques et exemples pratiques pour les restaurateurs.",
    date: "2026-03-15", readTime: "10 min", category: "Guides",
    content: `
## Pourquoi 14 allergènes ?

La liste des 14 allergènes a été établie par l'Autorité Européenne de Sécurité des Aliments (EFSA) sur la base de leur prévalence dans la population européenne et de la gravité des réactions allergiques qu'ils peuvent provoquer. Ce sont les allergènes qui causent le plus de réactions cliniquement significatives.

Voici chacun d'eux avec les informations essentielles pour les restaurateurs.

## 1. Gluten (céréales contenant du gluten)

**Ce que c'est** : protéine présente dans le blé, le seigle, l'orge, l'avoine, l'épeautre et le kamut.

**Où on le trouve en cuisine** : farine de blé (pain, pâtes, pizza, sauce béchamel, panures), bière, sauce soja (souvent à base de blé), certains bouillons industriels.

**Point d'attention** : la contamination croisée est fréquente. Si vous cuisinez des plats sans gluten dans une cuisine où la farine est utilisée, le risque de contamination est réel et doit être mentionné.

## 2. Crustacés

**Ce que c'est** : crevettes, homard, crabe, langoustine, écrevisse, bernard l'hermite.

**Où on le trouve en cuisine** : bisques, soupes de poisson (souvent), fruits de mer, certaines sauces asiatiques, fumet de crustacés.

**Point d'attention** : le fumet de crustacés utilisé dans des sauces peut ne pas être visible dans le plat final mais doit être déclaré.

## 3. Œufs

**Ce que c'est** : tous les œufs et produits dérivés.

**Où on le trouve en cuisine** : mayonnaise, hollandaise, béarnaise, meringue, pâtes fraîches, gnocchi, certains pains, crème pâtissière, île flottante, nombreux desserts.

## 4. Poissons

**Ce que c'est** : tous les poissons de mer et d'eau douce.

**Où on le trouve en cuisine** : évident dans les plats de poisson, mais aussi dans la sauce worcestershire, la sauce nuoc-mâm, certains bouillons, le surimi.

## 5. Arachides

**Ce que c'est** : la cacahuète et ses dérivés. Attention : bien qu'on les appelle "noix", les arachides sont des légumineuses — distinctes des fruits à coque.

**Où on le trouve en cuisine** : huile d'arachide, beurre de cacahuète, cuisine asiatique (satay, pad thaï), certaines confiseries.

## 6. Soja

**Ce que c'est** : la graine de soja et tous ses dérivés.

**Où on le trouve en cuisine** : tofu, tempeh, edamame, miso, sauce soja, lait de soja, nombreux produits transformés (lécithine de soja dans les chocolats).

## 7. Lait

**Ce que c'est** : le lait de tous les mammifères et ses dérivés.

**Où on le trouve en cuisine** : beurre, crème, fromage (parmesan, mozzarella, feta, chèvre, brie), yaourt, crème glacée, chocolat au lait, sauce béchamel, gratin.

**Point d'attention** : le lactose et la caséine sont des dérivés du lait et doivent être déclarés.

## 8. Fruits à coque

**Ce que c'est** : noix, noisette, amande, noix de cajou, pistache, noix du Brésil, noix de Pécan, noix de Macadamia, noix de coco (selon les pays).

**Où on le trouve en cuisine** : pralines, gianduja, pesto (pignons), financiers (amandes), dacquoise, nombreux desserts, muesli.

## 9. Céleri

**Ce que c'est** : céleri-rave, céleri branche, graines de céleri.

**Où on le trouve en cuisine** : bouillon cube (presque toujours), mirepoix, salade waldorf, rémoulade, sel de céleri.

**Point d'attention** : le céleri est souvent présent dans les bouillons industriels et les assaisonnements sans être évident.

## 10. Moutarde

**Ce que c'est** : graines, farine et huile de moutarde.

**Où on le trouve en cuisine** : vinaigrettes, sauces, marinades, certains pains et charcuteries.

## 11. Graines de sésame

**Ce que c'est** : les graines et leurs dérivés (tahini, huile de sésame).

**Où on le trouve en cuisine** : pain au sésame, humus, cuisine asiatique, halva, gomasio.

## 12. Sulfites et dioxyde de soufre (SO₂)

**Ce que c'est** : conservateurs utilisés dans de nombreux aliments transformés.

**Où on le trouve en cuisine** : vins (quasi-systématiquement), cidre, vinaigre, fruits secs (abricots, raisins), crevettes séchées, certains condiments.

**Point d'attention** : uniquement à déclarer si la concentration est supérieure à 10 mg/kg ou 10 mg/litre.

## 13. Lupin

**Ce que c'est** : plante légumineuse dont la farine est utilisée comme substitut à la farine de blé.

**Où on le trouve en cuisine** : certains pains sans gluten, pâtes au lupin, graines de lupin en apéritif.

## 14. Mollusques

**Ce que c'est** : moules, palourdes, coquilles Saint-Jacques, huîtres, calmars, pieuvre, escargots.

**Où on le trouve en cuisine** : fruits de mer, paella, certaines soupes.
    `,
  },
  "import-ia-menu-restaurant-allergenes": {
    title: "Importer sa carte de restaurant avec l'IA : gain de temps et conformité immédiate",
    description: "Photographier sa carte, laisser l'IA extraire les plats et détecter les allergènes en 60 secondes. Comment cette technologie révolutionne la mise en conformité.",
    date: "2026-03-18", readTime: "6 min", category: "Technologie",
    content: `
## Le problème de la saisie manuelle

Pour un restaurant avec 30 plats à la carte, la saisie manuelle des ingrédients représente plusieurs heures de travail. Et si chaque ingrédient doit être vérifié contre la liste des 14 allergènes, la charge devient significative.

C'est le problème que l'import par IA résout directement.

## Comment fonctionne l'analyse par intelligence artificielle

L'import IA utilise des modèles de vision par ordinateur et de traitement du langage pour analyser une photo ou un scan de votre carte existante.

### Étape 1 : Analyse de l'image
Le modèle lit votre carte comme le ferait un être humain — il identifie les noms de plats, les descriptions, les ingrédients listés. Il est capable de lire des cartes imprimées, manuscrites, ou même des photos prises en conditions imparfaites.

### Étape 2 : Extraction structurée
Pour chaque plat identifié, le modèle extrait :
- Le nom du plat
- La liste des ingrédients (si mentionnés sur la carte)
- La catégorie probable (entrée, plat, dessert, boisson)

Si les ingrédients ne sont pas listés sur votre carte, le modèle propose la recette traditionnelle française correspondante — que vous validez ou corrigez.

### Étape 3 : Détection des allergènes
Sur la base des ingrédients identifiés, les 14 allergènes sont détectés automatiquement. "Mozzarella" → lait. "Farine de blé" → gluten. "Beurre clarifié" → lait. La base de données couvre plus de 900 ingrédients courants.

### Étape 4 : Traductions en 8 langues
En une seule analyse, les noms de plats et les ingrédients sont traduits dans les 8 langues supportées. Ces traductions sont stockées et utilisées instantanément lors des changements de langue.

## La validation plat par plat

L'IA ne remplace pas votre jugement — elle accélère votre travail. Après l'analyse, vous validez chaque plat :

- Vous confirmez les ingrédients (ou les corrigez si l'IA s'est trompée)
- Vous ajustez les allergènes détectés (en retirant les faux positifs ou en ajoutant des manquants)
- Vous choisissez la catégorie de chaque plat
- Vous importez en masse ou plat par plat

Ce système de validation garantit que vous restez responsable de l'information allergènes — comme l'exige la réglementation.

## Quel gain de temps réel ?

Pour une carte de 20 plats :
- **Sans IA** : 3 à 5 heures de saisie et vérification
- **Avec IA** : 15 à 20 minutes de validation après une analyse de 60 à 90 secondes

Le gain est encore plus significatif si votre carte change souvent — chaque modification est répercutée en quelques secondes.

## Les limites à connaître

L'IA est efficace mais pas infaillible :
- Une photo très floue ou mal éclairée peut réduire la précision de l'analyse
- Les recettes très complexes ou les ingrédients très spécifiques peuvent nécessiter une correction manuelle
- La détection des allergènes est conservatrice : en cas de doute, l'IA ne sur-détecte pas pour éviter les faux positifs

C'est pourquoi la validation humaine reste indispensable avant toute publication.
    `,
  },
  "alim-confiance-restaurant-mauvaise-note": {
    title: "Alim'Confiance : comment une mauvaise note peut tuer votre restaurant",
    description: "Une note défavorable sur Alim'Confiance apparaît dans les premiers résultats Google. Ce que ça signifie pour votre réputation et comment l'éviter.",
    date: "2026-03-20", readTime: "7 min", category: "Réputation",
    content: `
## Qu'est-ce qu'Alim'Confiance ?

Alim'Confiance est le site officiel du gouvernement français qui publie les résultats de tous les contrôles sanitaires effectués dans les établissements alimentaires — restaurants, boulangeries, traiteurs, cantines. Il est géré par le ministère de l'Agriculture et de la Souveraineté Alimentaire.

Depuis son lancement, ce site est devenu une référence que Google indexe naturellement. Quand un client cherche le nom de votre restaurant, la fiche Alim'Confiance peut apparaître en première page des résultats.

## Comment les notes fonctionnent

Il existe quatre niveaux de résultats après un contrôle :

- **Très satisfaisant** (smiley vert) : conformité totale
- **Satisfaisant** (smiley vert clair) : conformité globale avec points mineurs
- **À améliorer** (smiley orange) : non-conformités identifiées, mise en demeure
- **À corriger de toute urgence** (smiley rouge) : non-conformités graves, risque sanitaire

## L'impact réel sur votre activité

### Visibilité Google
Google indexe Alim'Confiance. Un client qui cherche "Restaurant Le Bistrot + Paris" peut voir votre note Alim'Confiance avant même d'arriver sur votre site. Une note "à corriger de toute urgence" est immédiatement visible.

### Les sites d'avis
TripAdvisor, Google Maps et TheFork intègrent ou mentionnent parfois les données Alim'Confiance. Des blogueurs culinaires et des journalistes gastronomiques vérifient régulièrement ces données avant de rédiger leurs articles.

### L'effet sur les réservations
Des études menées dans d'autres pays ayant des systèmes similaires (le système "scores on doors" au Royaume-Uni) montrent qu'une mauvaise note peut réduire le chiffre d'affaires de 20 à 30% dans les semaines suivant la publication.

## Ce que les contrôleurs vérifient

Un contrôle Alim'Confiance couvre :
- L'hygiène des locaux et des équipements
- La chaîne du froid et la conservation des aliments
- Les pratiques d'hygiène du personnel
- **La déclaration des allergènes** — c'est ici que la conformité INCO est vérifiée

Un manquement sur la déclaration allergènes peut suffire à faire basculer votre note de "satisfaisant" à "à améliorer".

## Comment maintenir une note satisfaisante

La conformité allergènes n'est qu'une partie de l'équation. Pour maintenir une bonne note Alim'Confiance :

**Sur les allergènes** :
- Déclaration écrite de tous les allergènes, accessible aux clients
- Information à jour, cohérente avec la réalité en cuisine
- Personnel formé et capable de répondre aux questions

**Sur l'hygiène générale** :
- Relevés de températures réguliers
- Plan de nettoyage et désinfection documenté
- Traçabilité des denrées alimentaires

**La documentation** est la clé. Un inspecteur qui voit des documents bien tenus, à jour et accessibles partira avec une impression favorable — même si quelques points mineurs sont à corriger.

## Que faire si vous avez déjà une mauvaise note ?

1. **Corrigez immédiatement** les non-conformités identifiées dans le rapport de contrôle
2. **Demandez un contrôle de suivi** une fois les corrections effectuées — la note peut être mise à jour
3. **Ne contestez pas publiquement** la note sur les réseaux sociaux — ça amplifie la visibilité négative
4. **Communiquez positivement** auprès de vos clients réguliers sur les améliorations apportées

La note Alim'Confiance peut être mise à jour après un nouveau contrôle favorable. Les restaurants qui agissent rapidement récupèrent souvent leur réputation en quelques semaines.
    `,
  },
};

function formatContent(content) {
  const lines = content.trim().split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: "36px 0 12px", letterSpacing: "-0.01em", borderBottom: "2px solid #F0F0F0", paddingBottom: 10 }}>{line.slice(3)}</h2>;
    if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "16px 0 4px" }}>{line.slice(2, -2)}</p>;
    if (line.startsWith("- ")) {
      const text = line.slice(2);
      const parts = text.split("**");
      return <li key={i} style={{ fontSize: 15, color: "#444", lineHeight: 1.7, marginBottom: 6 }}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
      </li>;
    }
    if (line.trim() === "") return null;
    const parts = line.split("**");
    return <p key={i} style={{ fontSize: 15, color: "#444", lineHeight: 1.75, margin: "0 0 14px" }}>
      {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: "#1A1A1A" }}>{p}</strong> : p)}
    </p>;
  }).filter(Boolean);
}


export async function generateStaticParams() {
  return [
    "obligation-allergenes-restaurant-france",
    "amende-dgccrf-allergenes-restauration",
    "carte-allergenes-qr-code-restaurant",
    "menu-multilingue-restaurant-touristes",
    "14-allergenes-liste-complete-restauration",
    "import-ia-menu-restaurant-allergenes",
    "alim-confiance-restaurant-mauvaise-note",
  ].map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return { title: "Article introuvable — MenuSafe" };
  return {
    title: `${article.title} — MenuSafe`,
    description: article.description,
    openGraph: { title: article.title, description: article.description, type: "article", publishedTime: article.date },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  const CAT_COLORS = {
    "Réglementation": { bg: "#FFF0F0", color: "#CC0000" },
    "Solutions":      { bg: "#F0FFF4", color: "#155724" },
    "Guides":         { bg: "#F0F7FF", color: "#084298" },
    "Technologie":    { bg: "#F5F0FF", color: "#5A189A" },
    "Réputation":     { bg: "#FFF8E6", color: "#856404" },
  };
  const cat = CAT_COLORS[article.category] || { bg: "#F5F5F5", color: "#555" };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "white", color: "#1A1A1A", minHeight: "100vh" }}>
      <nav style={{ borderBottom: "1px solid #EBEBEB", padding: "12px 20px", position: "sticky", top: 0, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(10px)", zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="#1A1A1A"/>
              <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#2D2D2D"/>
              <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>MenuSafe</span>
          </a>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="/blog" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>← Blog</a>
            <a href="/auth" style={{ fontSize: 13, fontWeight: 700, padding: "8px 16px", background: "#1A1A1A", color: "white", borderRadius: 10, textDecoration: "none" }}>
              Essayer gratuitement →
            </a>
          </div>
        </div>
      </nav>

      <article style={{ maxWidth: 720, margin: "0 auto", padding: "56px 20px 80px" }}>
        {/* Meta */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: cat.bg, color: cat.color }}>{article.category}</span>
          <span style={{ fontSize: 12, color: "#BBB" }}>{new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span style={{ fontSize: 12, color: "#BBB" }}>· {article.readTime} de lecture</span>
        </div>

        {/* Titre */}
        <h1 style={{ fontSize: 34, fontWeight: 800, color: "#1A1A1A", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          {article.title}
        </h1>
        <p style={{ fontSize: 17, color: "#666", lineHeight: 1.7, margin: "0 0 40px", borderBottom: "1px solid #F0F0F0", paddingBottom: 32 }}>
          {article.description}
        </p>

        {/* Contenu */}
        <div>
          {formatContent(article.content)}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 48, padding: "32px", background: "#F7F7F5", borderRadius: 20, border: "1px solid #EBEBEB", textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
            Mettez votre restaurant en conformité en 5 minutes
          </p>
          <p style={{ fontSize: 14, color: "#888", margin: "0 0 20px", lineHeight: 1.6 }}>
            MenuSafe gère automatiquement vos 14 allergènes, génère vos PDF conformes et crée votre carte interactive multilingue.
          </p>
          <a href="/auth" style={{ display: "inline-block", fontSize: 14, fontWeight: 700, padding: "12px 28px", background: "#1A1A1A", color: "white", borderRadius: 12, textDecoration: "none" }}>
            Essayer gratuitement →
          </a>
          <p style={{ fontSize: 12, color: "#BBB", marginTop: 8 }}>Sans frais pendant 7 jours · Annulation en 1 clic</p>
        </div>
      </article>

      <footer style={{ background: "#080808", padding: "24px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>MenuSafe</span>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2026 MenuSafe · Règlement UE n°1169/2011</p>
        </div>
      </footer>
    </div>
  );
}