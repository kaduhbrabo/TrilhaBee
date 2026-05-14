import HTTPClient from './client';

const baseUrl = '/Apiario';

export const apiarioAPI = {
    listarAsync: async () => {
        try {
            const resposta = await HTTPClient.get(baseUrl);
            return resposta.data;
        } catch (erro) {
            console.error('Erro ao listar apiários:', erro);
            throw erro;
        }
    },

    obterAsync: async (id) => {
        try {
            const resposta = await HTTPClient.get(`${baseUrl}/${id}`);
            return resposta.data;
        } catch (erro) {
            console.error(`Erro ao obter o apiário ${id}:`, erro);
            throw erro;
        }
    },

    criarAsync: async (apiario) => {
        try {
            const resposta = await HTTPClient.post(baseUrl, apiario);
            return resposta.data;
        } catch (erro) {
            console.error('Erro ao criar apiário:', erro);
            throw erro;
        }
    },

    atualizarAsync: async (id, apiario) => {
        try {
            const resposta = await HTTPClient.put(`${baseUrl}/${id}`, apiario);
            return resposta.data;
        } catch (erro) {
            console.error(`Erro ao atualizar o apiário ${id}:`, erro);
            throw erro;
        }
    },

    deletarAsync: async (id) => {
        try {
            const resposta = await HTTPClient.delete(`${baseUrl}/${id}`);
            return resposta.data;
        } catch (erro) {
            console.error(`Erro ao deletar o apiário ${id}:`, erro);
            throw erro;
        }
    }
};
