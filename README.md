# Livre-Testez-votre-application-web-avec-Cypress

Pour lancer le projet, exécutez `docker-compose up` cette commande démarre les services définis dans le fichier `docker-compose.yml`. Si les conteneurs n'existent pas, ils seront crées. Si les conteneurs existent déjà, ils seront démarrés. 

Vous pouvez y ajouter `--build`, cette option force la reconstruction des images pour les services avant de les démarrer. Cela garantit que toutes les modifications récentes apportées aux Dockerfiles seront prises en compte.

Si vous avez besoin de debugguer, vous pouvez utiliser : docker-compose up --build > build_output.log 2>&1 qui vous donnera la sortie dans le fichier build_output.log et vous pourrez ainsi voir les erreurs