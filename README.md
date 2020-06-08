# Initialisation

L'API fonctionne exclusivement sous *Docker*. Il faut donc avoir *Docker* installé sur votre machine. Il y a un *docker-compose.yml* qui contient tous les services utilisés par l'api. 

Effectuez un **docker-compose up** pour lancer les services et faites un **docker-compose ps** afin de visualiser s'ils sont bien présent.

Réalisez ensuite un **docker-compose exec api.contaminate npm install** afin d'installer tous les modules dans le conteneur dont a besoin l'api. Ces modules sont présents dans le fichier **package.json**.

Fermez l'ancien terminal du **docker-compose up** et re-faites le dans un nouveau terminal. (Pas obligatoire)

Si tout fonctionne l'api en local sera disponible à l'adresse suivante : [localhost:4000](http:/localhost:4000).

Pour avoir accès à MongoDB ce sera à l'adresse suivante : [localhost:8081](http:/localhost:8081).

# Problèmes liés à node_modules

Durant l'installation de dépendances (modules npm), certaines opérations de build peuvent prendre en compte la structure des répertoires. Afin d'éviter tout problème de ce genre, il est fortement conseillé d'installer les dépendances directement dans le conteneur (**docker-compose exec api.contaminate npm install**) et non de transférer celles du local vers le conteneur.

Ainsi, si en local il existe un dossier node_modules, il ne doit pas être copié dans le conteneur. Pour ce faire, on créé un volume (*docker-compose.yml ligne 15*) qui écraserait un potentiel dossier node_modules copié automatiquement.

# Connexion à la BDD

Pour vous connecter à la base de données, vous devez créer un dossier *config* contenant un fichier **settings.js**. Dans celui-ci, vous devez exporter un module avec plusieurs variables comme le nom de la bdd et le nom de l'hôte. Etant donné qu'ici on utilise **Docker**, l'hôte correspondra au lien entre le service api.contaminate et le service mongo.

# Déploiement sur Heroku

Dans un premier temps, installez [Heroku CLI](https://dashboard.heroku.com/apps/contaminateapi/deploy/heroku-git). A la suite de cela, vous pouvez suivre ce qui est marqué en dessous de l'installation : 
  - Se connecter sur Heroku **heroku login**
  - Initialiser un repository git **git init** ( ATTENTION : Il faut que le fichier *package.json* soit à la racine du projet sinon au déploiement de l'application, cela ne va pas fonctionner.)
  - Lier le git à l'application Heroku : **heroku git:remote -a contaminateapi**
  - Avant de push, il faut modifier quelques valeurs dans le code afin qu'il fonctionne sur le serveur d'héroku. Il faut modifier le port et le lien de connexion de la bdd. Pour cela, créez un constante port et ajoutez process.env.PORT || votreportenlocal. Concernant la bdd ce sera la même chose process.env.MONGODB_URI || votreurienlocal. Pour avoir une bdd liée au projet, il faut ajouter mlab en add-ons sur Heroku.
  - Faire les commandes basiques de git afin de push votre api sur le repository d'Heroku. **git add .** **git commit -m "init"** **git push heroku master**
  - Lorsque ces étapes ce sont déroulées sans problème, votre application fonctionne et vous pouvez la lancer soit sur le site d'Héroku dans vos applications soit par commande **heroku open**

## Liens utiles

  - Lien de l'api : [https://contaminateapi.herokuapp.com/](https://contaminateapi.herokuapp.com/ )
  - Lien de la documentation de l'api : [documentation](https://documenter.getpostman.com/view/10220752/SzzdBLUy?version=latest)
