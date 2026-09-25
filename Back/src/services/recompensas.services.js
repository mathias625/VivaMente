const prisma=require("../data/prisma");
const cadastrar=async(d,u)=> {
    if (u.tipo!=="psicologo")throw Error("Apenas psicólogos podem cadastrar recompensas");
    return prisma.recompensas.create( {
        data: {
            nome:d.nome,descricao:d.descricao||"",preco:Number(d.preco)
        }
    }
    )
}
;
const listar=()=>prisma.recompensas.findMany();
const buscar=async id=> {
    const r=await prisma.recompensas.findUnique( {
        where: {
            id:Number(id)
        }
    }
    );
    if (!r)throw Error("Recompensa não encontrada");
    return r
}
;
const atualizar=(id,d,u)=> {
    if (u.tipo!=="psicologo")throw Error("Apenas psicólogos podem atualizar recompensas");
    return prisma.recompensas.update( {
        where: {
            id:Number(id)
        }
        ,data:d
    }
    )
}
;
const excluir=(id,u)=> {
    if (u.tipo!=="psicologo")throw Error("Apenas psicólogos podem excluir recompensas");
    return prisma.recompensas.delete( {
        where: {
            id:Number(id)
        }
    }
    )
}
;
const comprar=async(id,u)=> {
    if (u.tipo!=="paciente")throw Error("Apenas pacientes podem comprar recompensas");
    const r=await buscar(id),p=await prisma.paciente.findUnique( {
        where: {
            id:u.id
        }
    }
    );
    if (p.pontos<r.preco)throw Error("Pontos insuficientes");
    const x=await prisma.paciente.update( {
        where: {
            id:p.id
        }
        ,data: {
            pontos: {
                decrement:r.preco
            }
        }
        ,select: {
            id:true,pontos:true
        }
    }
    );
    return {
        mensagem:"Recompensa comprada com sucesso",recompensa:r,pontosRestantes:x.pontos
    }
}
;
module.exports= {
    cadastrar,listar,buscar,atualizar,excluir,comprar
}
;
