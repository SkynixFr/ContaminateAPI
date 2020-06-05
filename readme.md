# Initialisation

L'API fonctionne exclusivement sous *Docker*. Il faut donc avoir *Docker* installer sur votre machine. Il y a un *docker-compose.yml* qui contient tous les services qu'utilise l'api. 

Faites un **docker-compose up** pour lancer les services et faites un **docker-compose ps** afin de visualiser s'ils sont bien présent.

Faites ensuite un **docker-compose exec api.contaminate npm install** afin d'installer tous les modules dans le conteneur qu'a besoin l'api. Ces modules sont présent dans le fichier **package.json**.

Fermer l'ancien terminal du **docker-compose up** et re-faites le dans un nouveau terminal. (Pas obligatoire)

Si tout fonctionne l'api en local sera disponible à l'adresse suivante : [localhost:4000](http:/localhost:4000).

Pour avoir accès à MongoDB ce sera à l'adresse suivante : [localhost:8081](http:/localhost:8081).

## Problèmes liés à node_modules

Durant l'installation de dépendances (modules npm), certainnes opérations de build peuvent prendre en compte la structure des répertoires. Afin d'éviter tout problème de ce genre il est fortement conseillé d'installer les dépendances directement dans le conteneur (**docker-compose exec api.contaminate npm install**) et non de transférer celles du local vers le conteneur.

Ainsi si en local il existe un dossier node_modules il ne doit pas être copié dans le conteneur. Pour ce faire, on créé un volume (*docker-compose.yml ligne 15*) qui écraserait un potentiel dossier node_modules copié automatiquement.

# Connexion à la BDD

Pour vous connecter à la base de données vous devez créer un dossier *config* contenant un fichier **settings.js**. Dans celui-ci vous devez exporter un module avec plusieurs variables comme le nom de la bdd et le nom de l'hôte. Etant donné qu'ici on utilise **Docker** l'hôte correspondra au lien entre le service api.contaminate et le service mongo.
