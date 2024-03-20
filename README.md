# VM / CT Management

## Description

Cette application permet de gérer les machines virtuelles et les conteneurs d'une infrastructure proxmox. Le but étant de rendre la gestion de ces ressources plus simple et plus rapide. Grace à cette application, il est possible de créer (en clonant un modèle), modifier, supprimer des machines virtuelles et des conteneurs. 

## Installation

Ce projet nécessite PHP, JavaScript, npm et Composer. Assurez-vous de les avoir installés sur votre système avant de continuer.

1. Clonez le dépôt :
    ```
    git clone https://github.com/BapJu/vmManagement
    ```

2. Installez les dépendances PHP avec Composer :
    ```
    composer install
    ```

3. Installez les dépendances JavaScript avec npm :
    ```
    npm install
    ```

## Utilisation

Pour utiliser cette application, vous devez d'abord la configurer. Pour cela, vous devez créer un fichier `.env` à la racine du projet. Vous pouvez vous inspirer du fichier `.env.example` pour le remplir.

La gestion des utilisateurs se fait via Laravel. Par défault un utilisateur est visiteur, il ne peut donc pas intéragir avec les CT/VM. Pour le rendre administrateur, il faut modifier la colonne `id_role` de la table `users` dans la base de données et le passé à 1 (4 pour visiteur, 1 pour administrateur).


## Contribution

Si vous souhaitez contribuer à ce projet, veuillez suivre ces étapes :

1. Forkez le dépôt
2. Créez votre branche de fonctionnalités (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Pour plus d'informations, veuillez consulter le fichier `LICENSE`.

## Contact

Baptiste JULIENNE - Alexis OLLIVIER

## Remerciements

Merci à l'ISEN pour nous avoir permis de réaliser ce projet.
```

