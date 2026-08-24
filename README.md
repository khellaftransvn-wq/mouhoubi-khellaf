# Application de classification tarifaire

Cette application web aide à obtenir une première proposition de position tarifaire à partir d'une désignation commerciale ou d'une référence produit.

## Fonctionnalités

- Recherche par désignation ou référence.
- Proposition de position tarifaire indicative.
- Affichage du niveau de confiance.
- Liste des contrôles et documents à vérifier avant validation douanière.
- Exemples rapides pour tester l'application.

## Utilisation

Ouvrez `index.html` dans un navigateur ou servez le dossier avec un serveur statique :

```bash
python3 -m http.server 8000
```

Puis allez sur <http://localhost:8000>.

## Important

La classification proposée est une aide à la décision. Elle ne remplace pas l'analyse officielle des règles générales d'interprétation, des notes de sections/chapitres et de la nomenclature applicable dans le pays concerné.
