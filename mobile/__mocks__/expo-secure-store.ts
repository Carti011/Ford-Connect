const store: Record<string, string> = {};

export const setItemAsync = jest.fn(async (chave: string, valor: string) => {
  store[chave] = valor;
});

export const getItemAsync = jest.fn(async (chave: string) => {
  return store[chave] ?? null;
});

export const deleteItemAsync = jest.fn(async (chave: string) => {
  delete store[chave];
});
