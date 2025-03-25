# README pour le projet de traitement de pages web

Ce projet Node.js utilise TypeScript pour scraper et traiter des pages web en utilisant divers services intégrés tels que scraping, raccourcissement d'URLs, notifications Discord et interactions avec l'API OpenAI GPT-4. Voici un guide détaillé sur la configuration, l'exécution et l'architecture du projet.

## Configuration requise

- Node.js
- TypeScript
- Package Manager (npm ou yarn)

## Installation

Clonez le dépôt et installez les dépendances.

```bash
git clone [URL_DU_REPO]
cd [NOM_DU_REPO]
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet et configurez les clés d'API nécessaires et les tokens :

```plaintext
DISCORD_TOKEN=<votre_token_discord>
DISCORD_CHANNEL_ID=<id_du_canal_discord>
OPENAI_API_KEY=<votre_clé_api_openai>
```

## Compilation TypeScript

Le projet utilise TypeScript. Assurez-vous que le fichier `tsconfig.json` est correctement configuré. Compilez le projet avec :

```bash
npm run build
```

## Utilisation

Lancez l'application en passant l'URL de la page à traiter comme argument :

```bash
npm start -- --url "https://exemple.com"
```

## Architecture du projet

### Classes et Services

- **AxiosWebScraper** : Utilise Axios et Cheerio pour extraire le contenu des pages web.
- **GithubShortUrlService** : Utilise l'API GitHub pour créer des URLs raccourcies.
- **DiscordNotificationService** : Envoie des notifications à un canal Discord spécifié.
- **OpenAIChatService** : Interagit avec l'API d'OpenAI pour envoyer et recevoir des réponses basées sur le modèle GPT-4.

### Interfaces

- `ChatService` : Pour l'envoi de messages et la réception de réponses.
- `ShortUrlService` : Pour la création d'URLs raccourcies.
- `WebScraper` : Pour le scraping de contenu web.
- `NotificationService` : Pour l'envoi de notifications asynchrones.

### Cas d'utilisation principal

- **ProcessWebPageUseCase** : Orchestre le traitement d'une page web en utilisant les services mentionnés ci-dessus. Traite l'URL fournie, scrappe le contenu, crée une URL raccourcie, utilise OpenAI pour le traitement linguistique et envoie des notifications via Discord.

## Scripts disponibles

- `npm run build` : Compile le projet.
- `npm start` : Exécute l'application.

## Dépendances

- **axios** : Pour les requêtes HTTP.
- **cheerio** : Pour l'analyse du HTML.
- **discord.js** : Pour l'intégration avec Discord.
- **dotenv** : Pour la gestion des variables d'environnement.
- **typescript** : Pour le support de TypeScript.

## Conclusion

Ce projet illustre une application Node.js qui intègre plusieurs services externes pour le traitement avancé des pages web. Il utilise des pratiques modernes de développement avec TypeScript et offre une base solide pour des extensions futures.

Pour toute question ou contribution, n'hésitez pas à ouvrir un issue ou un pull request sur le dépôt GitHub.
