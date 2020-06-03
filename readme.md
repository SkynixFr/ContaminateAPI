# installation

l'API Node.js se trouve dans le dossier "api"

étant donné que le projet va être exclusivement développé via Docker, il est préférable que toutes les dépendances du projet (indiquées dans package.json) soient installées depuis l'environnement d'exécution du container plutôt que copiées de l'environnement local vers le container

lors de l'installation de dépendances (modules npm), certaines opérations de build peuvent être effectuées et prendre en considération la structure du répertoire. Or, le répertoire du container Docker ne correspond pas au répertoire du container local. De plus, le système d'exploitation local peut être différent du système d'exploitation du service Docker.

Pour éviter tout problème, on s'assure que les dépendances npm soient installées directement depuis le container Docker et non synchronisées depuis le répertoire local.

## problématique liée au dossier node_modules

Si un dossier node_modules local existe, il ne doit pas être copié vers le container docker distant.

Pour ce faire, on créé un volume (docker-compose.yml ligne 15) qui écraserait un potentiel dossier node_modules copié automatiquement (si présent)

Attention : pour pouvoir installer les dépendances utiles au projet, il faut que le container fonctionne. Si le container ne fonctionne pas, on ne peut pas y accéder en live via la commande "docker-compose exec ..."

Pour simplifier l'opération, on utilise par défaut un script simple (app.js), sans dépendance, ayant pour but unique de faire fonctionner le service (pour pouvoir y accéder en live)

A la ligne 17 du fichier docker-compose.yml on indique que la commande a exécuter au lancement du service est "npm start" (soit le script de démarrage de serveur node.js minimal)

Pour que le serice soit fonctionnel, app.js ne doit pas faire appel à une dépendance indisponible ni contenir d'erreur JS.

Le script "start" doit être renseigné dans le fichier package.json dans la partie "scripts".

On lance les services via "docker-compose up". Si tout est ok, les services sont lancés et fonctionnels. On peut donc y accéder en live et installer les dépendances (modules npm) qui seront plus tard utiles au projet.

Via un second onglet du terminal, on accède au container du service "api.contaminate" (actuellement lancé et fonctionnel), en exécutant la commande "docker-compose exec api.contaminate xxxxxxxx"

"api.contaminate" fait référence au "container_name" renseigné ligne 9 du fichier docker-compose.yml

On peut exécuter n'importe quelle commande bash en remplaçant "xxxxxxxx" par la commande de notre choix (ex : ls, ls -la, mkdir...)

Pour installer les dépendances indiquées dans le fichier package.json on fera :

docker-compose exec api.contaminate npm install

Une fois les dépendances du projet installées dans le container, on peut les utiliser dans le script app.js ou dans l'un des scripts renseignés dans package.json

Dans docker-compose.yml on remplace "command: npm start" par "npm run dev"

et dans le fichier package.json on vérifie que le script dev a bien été saisi :

"dev": "nodemon app.js"

On utilise le module "nodemon" pour pouvoir effectuer du hot restarting à chaque modification du projet

Pour ce faire, "nodemon" doit faire partie des dépendances de développement renseignée dans le fichier package.json
