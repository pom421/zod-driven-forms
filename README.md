# Objectif

L'idée est de créer une lib, qui a besoin d'un object config,
qui contient un schéma zod et d'éventuelles modification pour l'UI.

La lib, juste en lisant les informations de type de Zod et les infos supplémentaires,
pourraient créer automatiquement les inputs des forms pour avoir instantanément un
formulaire utilisable avec de la validation.

Le schéma zod pourrait être exporté pour être utilisé dans l'app (en particulier aussi dans l'API).

Le schéma zod pourrait aussi servir de validation côté API et éviter de se répéter.

Côté front, les inputs créés automatiquement seront envoyés dans la console JS. Comme ça, on pourra aussi s'en servir comme d'un scaffold et tout customiser si besoin.

Les inputs suivants sont pris en charge :

- number avec composant UI flêche pour incrémenter ou décrémenter
- booléen
- date comme un string formaté ISO avec composant UI datepicker
- texte avec text et textArea
- select avec liste de choix fermée

À venir :

- boutons groupe pour liste de choix fermée (ce widget et le précédent pourront tous les 2 choisir dans un zod enum, donc 2 façons de rentrer les mêmes données)
- messages d'erreur
- select autocomplete asynchrone ?

# Installation

```
yarn install
yarn start
```
