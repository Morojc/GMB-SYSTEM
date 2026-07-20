# Guide de l'utilisateur — GMB (Grande Minoterie)

Ce guide décrit l'ensemble des fonctionnalités de la plateforme de gestion GMB,
destinée à l'**administration** de la minoterie. Il couvre l'authentification et
chaque écran de l'espace de gestion, en suivant le cycle métier :
**Approvisionnement → Production → Stock → Ventes**.

> Langue de l'interface : français. Devise : MAD (dirham marocain). Les stocks de
> matières premières sont exprimés en **kg**, les produits finis en **unités (u.)**.

---

## 1. Authentification

L'accès à la plateforme est **réservé à l'administration**. La page d'accueil du
site (`/`) est un simple écran de connexion.

### Se connecter

1. Ouvrez la page d'accueil.
2. Saisissez votre **email** et votre **mot de passe**.
3. Cliquez sur **Se connecter**.

- Si les identifiants sont corrects **et** que le compte possède le rôle
  **Administrateur**, vous êtes redirigé vers le **tableau de bord**
  (`/dashboard`).
- Si le compte n'est pas administrateur, l'accès est refusé avec le message
  *« Accès réservé à l'administration. »*
- En cas d'identifiants erronés : *« Identifiants incorrects. »*

### Compte administrateur par défaut (après initialisation des données)

| Champ | Valeur |
|-------|--------|
| Email | `admin@gmb.local` |
| Mot de passe | `Admin123!` |

> Le mot de passe est stocké de façon chiffrée (bcrypt). La session est
> maintenue par un cookie sécurisé (`token`, valable 7 jours). Pour recréer le
> compte de démonstration, exécutez `npm run seed` (opération sans risque,
> ré-exécutable : elle ne supprime jamais de données existantes).

### Rôles

| Rôle | Accès |
|------|-------|
| **Administrateur** (`Admin`) | Accès complet à toutes les fonctionnalités et écrans, y compris RH et Système. |
| **Employé** (`Meunier`, etc.) | Accès aux opérations et aux fiches non réservées à l'administration. Les écrans marqués *admin uniquement* sont masqués. |

> La page d'accueil actuelle n'autorise que les administrateurs. Les autres
> rôles n'ouvrent pas de session depuis cet écran.

---

## 2. Vue d'ensemble (tableau de bord)

Écran d'accueil après connexion — synthèse du cycle complet de la minoterie.

### Indicateurs clés (KPIs)

**🚜 Approvisionnement & Production**
- **Fournisseurs** — nombre total de fournisseurs.
- **Achats en cours** — achats au statut « Commandé » non encore réceptionnés.
- **Stock matière (kg)** — total des matières premières disponibles.
- **Fabrications** — nombre total de productions enregistrées.

**📦 Stock & Ventes**
- **Produits finis (u.)** — total en stock de produits finis.
- **Commandes** — nombre total de commandes clients.
- **Clients** — nombre total de clients.
- **Marge brute** — ventes facturées − achats facturés.

### Bilan financier

- **Ventes facturées (clients)** — somme des factures de vente.
- **Achats facturés (fournisseurs)** — somme des factures d'achat.
- **Marge brute** — différence entre les deux (verte si positive, rouge si négative).
- **Commandes par statut** — répartition graphique des commandes (En attente, Validée, Livrée…).

### Opérations rapides

Raccourcis directs vers **Réceptionner un achat** et **Lancer une production**.

### Produits en stock faible

Liste des produits dont le stock est **inférieur à 10 unités**, triés du plus
critique au moins critique. Un stock à **0** est signalé en rouge, un stock bas
en orange.

---

## 3. Opérations (workflows guidés)

Ces trois écrans guident les opérations métier de bout en bout et mettent à jour
le stock et la facturation **automatiquement, dans une transaction sécurisée**.

### 3.1 📥 Réception des achats (`/dashboard/reception`)

Valide l'arrivée physique du blé ou des matières premières commandées.

Pour chaque achat en attente sont affichés : le fournisseur, la date, le statut,
le détail des lignes (matière, quantité, prix unitaire) et le montant total.

**Action « Réceptionner »** — en un clic :
1. Le statut de l'achat passe à **« Reçu »**.
2. Les quantités achetées sont **ajoutées au stock de matières premières**.
3. Une **facture d'achat** est générée automatiquement (montant = somme des lignes).

> L'opération est **idempotente** : un achat déjà réceptionné ne peut pas l'être
> deux fois. Les achats « Annulé » ne proposent pas le bouton.

### 3.2 🏭 Atelier de production (`/dashboard/production`)

Transforme le blé (matière première) en produits finis.

**Formulaire de fabrication** — vous déclarez :
- une **date** (par défaut : aujourd'hui) et une **note** optionnelle ;
- un ou plusieurs **intrants** (matière première + quantité consommée) ;
- un ou plusieurs **produits fabriqués** (produit + quantité obtenue).

À la validation :
1. Le **stock de matières premières est décrémenté** des quantités consommées.
2. Le **stock de produits finis est incrémenté** des quantités produites.
3. La fabrication est enregistrée au statut **« Terminée »**.
4. Le **rendement** (production ÷ consommation, en %) est calculé.

**Contrôles de sécurité :**
- Au moins un intrant **et** un produit sont obligatoires.
- Le **stock disponible est vérifié avant tout mouvement** : si une matière est
  insuffisante, l'opération est refusée avec le détail (disponible / demandé).

Le panneau **Dernières fabrications** affiche les 6 productions récentes avec
kg consommés, produits obtenus et rendement.

### 3.3 🧾 Traitement des commandes (`/dashboard/ventes`)

Gère le cycle de vente client : validation → facturation → livraison.

Un tableau liste toutes les commandes (numéro, client, date, montant, statut)
avec des **actions contextuelles selon le statut** :

**Valider une commande** (statut « En attente » → « Validée ») :
1. Vérifie la disponibilité du **stock de produits finis** (refus détaillé si insuffisant).
2. **Décrémente le stock** des produits commandés.
3. Émet la **facture de vente**.

**Livrer une commande** (statut « Validée » → « Livrée ») :
- Nécessite une commande déjà **validée** (facturée).
- Crée une **livraison** et un **bon de livraison**, puis marque la commande « Livrée ».

> Une commande déjà validée ou livrée ne peut pas être re-traitée.

---

## 4. Gestion des données (fiches CRUD)

Chaque type d'enregistrement dispose d'écrans standardisés, accessibles depuis
la barre latérale et regroupés par domaine. Sur chaque écran vous pouvez :

- **Consulter** la liste (avec recherche sur les champs pertinents) ;
- **➕ Ajouter** un enregistrement (`+ Ajouter`) ;
- **✏️ Modifier** un enregistrement existant ;
- **🗑️ Supprimer** un enregistrement.

> Les fiches marquées **🔒 admin uniquement** ne sont visibles et modifiables que
> par les administrateurs. Les autres fiches sont accessibles aux employés.

### 4.1 Approvisionnement

| Fiche | Description |
|-------|-------------|
| **Fournisseurs** | Coordonnées des fournisseurs de blé / matières. |
| **Achats** | Bons d'achat (blé / matière) et leur statut. |
| **Lignes d'achat** | Détail des matières, quantités et prix par achat. |
| **Factures d'achat** | Factures fournisseurs générées à la réception. |

### 4.2 Production

| Fiche | Description |
|-------|-------------|
| **Fabrications** | Productions enregistrées et leur statut. |
| **Intrants (matières consommées)** | Matières consommées par fabrication. |
| **Produits fabriqués** | Produits obtenus par fabrication. |
| **Produits** | Catalogue des produits finis (prix, stock, type). |
| **Types de produit** | Catégories de produits (Farine, Semoule…). |
| **Matières premières** | Blé et autres matières, avec quantité et silo. |
| **Silos** | Silos de stockage des matières, avec capacité. |
| **Catalogues** | Catalogues commerciaux de produits. |
| **Produits par catalogue** | Association produits ↔ catalogues. |

### 4.3 Stock

| Fiche | Description |
|-------|-------------|
| **Stock** | Entrées de stock de produits finis. |
| **Zones de stockage** | Entrepôts / zones et leur capacité. |

### 4.4 Ventes

| Fiche | Description |
|-------|-------------|
| **Clients** | Fiches clients. |
| **Commandes** | Commandes clients et leur statut. |
| **Lignes de commande** | Détail des produits, quantités et prix par commande. |
| **Factures de vente** | Factures clients émises à la validation. |
| **Bons de commande** | Bons de commande associés. |
| **Livraisons** | Livraisons et leur statut. |
| **Bons de livraison** | Bons de livraison générés à l'expédition. |
| **Livreurs** | Fiches des livreurs. |

### 4.5 RH 🔒

| Fiche | Description |
|-------|-------------|
| **Employés** 🔒 | Fiches employés (personne + rôle + date d'embauche). |
| **Rôles** 🔒 | Rôles employés et leurs tâches. |
| **Salaires** 🔒 | Salaires des employés. |

### 4.6 Système 🔒

| Fiche | Description |
|-------|-------------|
| **Personnes** 🔒 | Personnes de base (identité, contact, mot de passe) — socle des clients et employés. |

---

## 5. Bon à savoir

- **Cohérence garantie** — les opérations qui touchent au stock et à la
  facturation (réception, production, validation/livraison de commande)
  s'exécutent en **transaction** : soit tout réussit, soit rien n'est modifié.
- **Vérification des stocks** — la production et la validation de commande
  refusent l'opération si le stock disponible est insuffisant, avec un message
  détaillé (disponible / demandé).
- **Sécurité des accès** — les écrans et actions réservés à l'administration
  sont protégés côté serveur : un employé ne peut pas y accéder même via une URL
  directe (redirection vers le tableau de bord).
- **Se déconnecter** — la session expire automatiquement après 7 jours. Pour
  fermer la session, videz le cookie du navigateur (une action de déconnexion
  dédiée peut être ajoutée à l'interface si nécessaire).

---

*Document de référence — plateforme GMB. Cycle métier : Approvisionnement →
Production → Stock → Ventes.*
