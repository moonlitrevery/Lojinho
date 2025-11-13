const PokemonSyncService = require("../services/PokemonSyncService");

class SyncController {
  async syncPokemonById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: "ID do Pokémon é obrigatório e deve ser um número"
        });
      }

      const pokemon = await PokemonSyncService.syncPokemonById(parseInt(id));
      
      res.json({
        success: true,
        data: pokemon,
        message: "Pokémon sincronizado com sucesso"
      });
    } catch (error) {
      console.error("Error in SyncController.syncPokemonById:", error);
      
      if (error.message.includes("Falha na sincronização")) {
        return res.status(404).json({
          success: false,
          error: `Pokémon ${req.params.id} não encontrado na PokeAPI`
        });
      }

      res.status(500).json({
        success: false,
        error: "Erro interno ao sincronizar Pokémon"
      });
    }
  }

  async syncPokemonByIds(req, res) {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({
          success: false,
          error: "Lista de IDs é obrigatória"
        });
      }

      const results = await PokemonSyncService.syncPokemonByIds(ids);
      
      res.json({
        success: true,
        data: results,
        message: `Sincronização concluída: ${results.successful.length} sucessos, ${results.failed.length} falhas`
      });
    } catch (error) {
      console.error("Error in SyncController.syncPokemonByIds:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno ao sincronizar Pokémon"
      });
    }
  }

  async syncPokemonByRange(req, res) {
    try {
      const { start = 1, end = 151 } = req.body;
      
      if (start > end) {
        return res.status(400).json({
          success: false,
          error: "Start deve ser menor ou igual a end"
        });
      }

      if (end - start > 100) {
        return res.status(400).json({
          success: false,
          error: "Intervalo muito grande (máximo 100 Pokémon por vez)"
        });
      }

      const results = await PokemonSyncService.syncPokemonByRange(
        parseInt(start), 
        parseInt(end)
      );
      
      res.json({
        success: true,
        data: results,
        message: `Sincronização por intervalo ${start}-${end} concluída: ${results.successful.length} sucessos, ${results.failed.length} falhas`
      });
    } catch (error) {
      console.error("Error in SyncController.syncPokemonByRange:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno ao sincronizar Pokémon"
      });
    }
  }

  async syncPokemonFromList(req, res) {
    try {
      const { limit = 20, offset = 0 } = req.query;
      
      const results = await PokemonSyncService.syncPokemonFromList(
        parseInt(limit),
        parseInt(offset)
      );
      
      res.json({
        success: true,
        data: results,
        message: `Sincronização da lista concluída: ${results.successful.length} sucessos, ${results.failed.length} falhas`
      });
    } catch (error) {
      console.error("Error in SyncController.syncPokemonFromList:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno ao sincronizar lista de Pokémon"
      });
    }
  }
}

module.exports = new SyncController();