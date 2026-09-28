(function configureFavoritesRepository() {
  const config = window.APP_CONFIG || {};
  const hasValidUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.supabaseUrl || "");
  const hasValidKey = Boolean(config.supabaseKey)
    && !config.supabaseKey.includes("SUA_CHAVE")
    && !config.supabaseKey.includes("SEU_PROJETO");
  const libraryLoaded = Boolean(window.supabase?.createClient);

  if (!hasValidUrl || !hasValidKey || !libraryLoaded) {
    window.favoritesRepository = {
      available: false,
      async list() {
        return [];
      },
      async add() {
        throw new Error("A persist锚ncia ainda n茫o foi configurada.");
      },
      async remove() {
        throw new Error("A persist锚ncia ainda n茫o foi configurada.");
      }
    };
    return;
  }

  const client = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);

  window.favoritesRepository = {
    available: true,

    async list() {
      const { data, error } = await client
        .from("favoritos")
        .select("id,nome,estado,pais,latitude,longitude,criado_em")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async add(city) {
      const favorite = {
        nome: city.name,
        estado: city.admin1 || null,
        pais: city.country || null,
        latitude: city.latitude,
        longitude: city.longitude
      };

      const { data, error } = await client
        .from("favoritos")
        .insert(favorite)
        .select("id,nome,estado,pais,latitude,longitude,criado_em")
        .single();

      if (error) throw error;
      return data;
    },

    async remove(id) {
      const { error } = await client
        .from("favoritos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    }
  };
})();

