import HTTPClient from './client';

export const seedAPI = {
    inserirDadosExemplo: async (usuarioID) => {
        const resposta = await HTTPClient.post(`/Seed/dados-exemplo?usuarioID=${usuarioID}`);
        return resposta.data;
    }
};
