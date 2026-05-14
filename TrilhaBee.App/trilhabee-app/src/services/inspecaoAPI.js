import HTTPClient from './client';

const baseUrl = '/Inspecao';

export const inspecaoAPI = {
    listarAsync: async () => {
        try {
            const resposta = await HTTPClient.get(baseUrl);
            return resposta.data;
        } catch (erro) {
            console.error('Erro ao listar inspeções:', erro);
            throw erro;
        }
    },

    obterAsync: async (id) => {
        try {
            const resposta = await HTTPClient.get(`${baseUrl}/${id}`);
            return resposta.data;
        } catch (erro) {
            console.error(`Erro ao obter inspeção ${id}:`, erro);
            throw erro;
        }
    },

    criarAsync: async (inspecao) => {
        try {
            const resposta = await HTTPClient.post(baseUrl, inspecao);
            return resposta.data;
        } catch (erro) {
            console.error('Erro ao criar inspeção:', erro);
            throw erro;
        }
    },

    atualizarAsync: async (id, inspecao) => {
        try {
            const resposta = await HTTPClient.put(`${baseUrl}/${id}`, inspecao);
            return resposta.data;
        } catch (erro) {
            console.error(`Erro ao atualizar inspeção ${id}:`, erro);
            throw erro;
        }
    },

    deletarAsync: async (id) => {
        try {
            const resposta = await HTTPClient.delete(`${baseUrl}/${id}`);
            return resposta.data;
        } catch (erro) {
            console.error(`Erro ao deletar inspeção ${id}:`, erro);
            throw erro;
        }
    }
};
