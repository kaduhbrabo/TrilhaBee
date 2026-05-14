import HTTPClient from './client';

const baseUrl = '/Colmeia';

export const colmeiaAPI = {
    listarAsync: async () => {
        try {
            const resposta = await HTTPClient.get(baseUrl);
            return resposta.data;
        } catch (erro) {
            console.error('Erro ao listar colmeias:', erro);
            throw erro;
        }
    },

    obterAsync: async (id) => {
        try {
            const resposta = await HTTPClient.get(`${baseUrl}/${id}`);
            return resposta.data;
        } catch (erro) {
            console.error(`Erro ao obter a colmeia ${id}:`, erro);
            throw erro;
        }
    },

    criarAsync: async (colmeia) => {
        try {
            const resposta = await HTTPClient.post(baseUrl, colmeia);
            return resposta.data;
        } catch (erro) {
            console.error('Erro ao criar colmeia:', erro);
            throw erro;
        }
    },

    atualizarAsync: async (id, colmeia) => {
        try {
            const resposta = await HTTPClient.put(`${baseUrl}/${id}`, colmeia);
            return resposta.data;
        } catch (erro) {
            console.error(`Erro ao atualizar a colmeia ${id}:`, erro);
            throw erro;
        }
    },

    deletarAsync: async (id) => {
        try {
            const resposta = await HTTPClient.delete(`${baseUrl}/${id}`);
            return resposta.data;
        } catch (erro) {
            console.error(`Erro ao deletar a colmeia ${id}:`, erro);
            throw erro;
        }
    }
};
