const PokemonSyncService = require("../src/services/PokemonSyncService");

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'first-gen':
        console.log('Sincronizando primeira geração (1-151)...');
        await PokemonSyncService.syncPokemonByRange(1, 151);
        break;
      
      case 'range':
        const start = parseInt(args[1]) || 1;
        const end = parseInt(args[2]) || 151;
        console.log(`Sincronizando intervalo ${start}-${end}...`);
        await PokemonSyncService.syncPokemonByRange(start, end);
        break;
      
      case 'list':
        const limit = parseInt(args[1]) || 50;
        const offset = parseInt(args[2]) || 0;
        console.log(`Sincronizando lista - limit: ${limit}, offset: ${offset}...`);
        await PokemonSyncService.syncPokemonFromList(limit, offset);
        break;
      
      default:
        console.log(`
Comandos disponíveis:
  npm run sync:first-gen   - Sincroniza primeira geração (1-151)
  npm run sync:range <start> <end> - Sincroniza intervalo específico
  npm run sync:list <limit> <offset> - Sincroniza da lista da API
        `);
    }
    
    console.log('Sincronização concluída!');
    process.exit(0);
  } catch (error) {
    console.error('Erro na sincronização:', error);
    process.exit(1);
  }
}

main();