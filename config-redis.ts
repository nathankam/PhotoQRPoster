// Configuration temporaire pour Redis
// En production, utilisez la variable d'environnement REDIS_URL
export const redisConfig = {
  // Votre URL Redis Cloud
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Configuration de développement
  dev: {
    redisUrl: 'redis://localhost:6379'
  }
}; 