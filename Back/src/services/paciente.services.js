const prisma = require("../data/prisma");
const { hashPassword } = require("../utils/password");
const { criptografar, descriptografar } = require("../utils/crypto");

const limpar = (p) => ( {
    ...p, nome: descriptografar(p.nome), email: descriptografar(p.email)
});

const cadastrar = async (data) => {
    if (!data.nome || !data.email || !data.senha || !data.psicologoId) throw new Error("nome, email, senha e psicologoId são obrigatórios");
    if (await prisma.paciente.findUnique( {
        where: {
            email: data.email
        }
    }
    )) throw new Error("Email já cadastrado");
    return limpar(await prisma.paciente.create( {
        data: {
            nome:criptografar(data.nome),email:data.email,senha:hashPassword(data.senha),psicologoId:Number(data.psicologoId),pontos:Number(data.pontos||0)
        }
    }
    ));
}
;
const listar = async (usuario) => {
    const where = usuario.tipo === "psicologo" ? { psicologoId: usuario.id } : { id: usuario.id };
    
    const lista=await prisma.paciente.findMany({
        where,select: {
            id : true,
            nome : true,
            email : true,
            pontos : true,
            psicologoId : true
        }
    });

    return lista.map(limpar);
};

const buscar = async (id, usuario) => {
    const n=Number(id);
    if (usuario.tipo==='paciente' && usuario.id!==n) throw new Error("Você só pode acessar seu próprio perfil");
    const item=await prisma.paciente.findUnique({
        where: { id:n },
        include: {
            psicologo: {
                select: {
                    id : true,
                    nome : true,
                    email : true
                }
            },
            consultas : true,
            tarefas : true
        }
    });

    if (!item) throw new Error("Paciente não encontrado");
    if (usuario.tipo==='psicologo' && item.psicologoId!==usuario.id) throw new Error("Paciente não pertence a você");
    item.nome=descriptografar(item.nome);
    item.email=descriptografar(item.email);
    item.senha=undefined;

    return item;
};

const atualizar = async (id,dados,usuario) => {
    const n=Number(id);
    if (usuario.tipo==='paciente' && usuario.id!==n) throw new Error("Você só pode alterar seu próprio perfil");
    if (usuario.tipo==='paciente') {
        const permitidos= {};

        if (dados.nome) permitidos.nome=criptografar(dados.nome);
        if (dados.email) permitidos.email=dados.email;
        if (dados.senha) permitidos.senha=hashPassword(dados.senha);
        if (Object.keys(permitidos).length===0) throw new Error("Nenhum campo permitido para atualização");
        dados=permitidos;
    }
    else {
        if (dados.nome) dados.nome=criptografar(dados.nome);
        if (dados.senha) dados.senha=hashPassword(dados.senha);
        if (dados.psicologoId) dados.psicologoId=Number(dados.psicologoId);
        delete dados.pontos;
    }

    const item=await prisma.paciente.update({
        where: { id:n },
        data:dados,select: {
            id : true,
            nome : true, 
            email : true,
            pontos : true,
            psicologoId : true
        }
    });

    return limpar(item);
};

const excluir = async(id,usuario)=> {
    if (usuario.tipo!=='psicologo') throw new Error("Apenas psicólogos podem excluir pacientes");
    const item=await buscar(id,usuario);
    return prisma.paciente.delete({
        where: { id:item.id }
    });
};

const meuPsicologo=async(usuario)=> {
    const item=await prisma.paciente.findUnique({
        where: { id:usuario.id },
        include: {
            psicologo: {
                select: {
                    id : true,
                    nome : true,
                    email : true
                }
            }
        }
    });

    if (!item) throw new Error("Paciente não encontrado");
    item.psicologo.nome=descriptografar(item.psicologo.nome);
    item.psicologo.email=descriptografar(item.psicologo.email);
    
    return item.psicologo;
};

const registrarCheckin = async (id, usuario) => {
    const n = Number(id);

    if (usuario.tipo !== "paciente") {
        throw new Error("Apenas pacientes podem realizar check-in");
    }

    if (usuario.id !== n) {
        throw new Error("Você só pode registrar check-in para seu próprio perfil");
    }

    const paciente = await prisma.paciente.findUnique({
        where: {
            id: n
        }
    });

    if (!paciente) {
        throw new Error("Paciente não encontrado");
    }

    const pontosAdicionar = 10;

    const atualizado = await prisma.paciente.update({
        where: {
            id: n
        },
        data: {
            pontos: {
                increment: pontosAdicionar
            }
        },
        select: {
            id: true,
            nome: true,
            email: true,
            pontos: true,
            psicologoId: true
        }
    });

    return limpar(atualizado);
};

module.exports= {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    meuPsicologo,
    registrarCheckin
    
};