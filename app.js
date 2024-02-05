class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
    }
    validarDados(){        
        for(let i in this){            
            if( this[i] == null ||  this[i] == 'undefined' ||  this[i] == ''){
            return false
            }             
        }
        return true
    }
}

class Bd {
    constructor(){
        let id = localStorage.getItem('id')
        if(id === null || id === '' || id === NaN){
            localStorage.setItem('id', 0)
        }
    }
    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return (parseInt(proximoId) + 1)
    }
    gravar(d){        
        let id = this.getProximoId()
        //converte um objeto literal em notação JSON 
        localStorage.setItem(id, JSON.stringify(d))
        
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros(){
        // array de despesas
        let despesas = Array()
        let id = localStorage.getItem('id')        
        // recuperar todas despesas cadastradas em localstorage
        for(let i = 1; i <= id; i++){
            // recuperar a despesa e transformar de string em objeto
            let despesa = JSON.parse(localStorage.getItem(i))
            //verificar se existe a possibilidade de haver índices que foram pulados/removidos
            //nestes casos, vamos pular os índices
            if (despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    } 
    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        
        console.log(despesa)
        console.log(despesasFiltradas)

        //ano
        if(despesa.ano !== ''){
        console.log('filtro de ano')
        despesasFiltradas = despesasFiltradas.filter(d=> d.ano == despesa.ano)}
        //mês
        if(despesa.mes !== ''){
        console.log('filtro de mês')    
        despesasFiltradas = despesasFiltradas.filter(d=> d.mes == despesa.mes)}
        //dia 
        if(despesa.dia !== ''){
        console.log('filtro de dia')
        despesasFiltradas = despesasFiltradas.filter(d=> d.dia == despesa.dia)}
        //tipo
        if(despesa.tipo !== ''){
        console.log('filtro de tipo')
        despesasFiltradas = despesasFiltradas.filter(d=> d.tipo == despesa.tipo)}
        //descrição
        if(despesa.descricao !== '')
        {console.log('filtro de descrição')
        despesasFiltradas = despesasFiltradas.filter(d=> d.descricao == despesa.descricao)}
        //valor 
        if(despesa.valor !== ''){
        console.log('filtro de valor')
        despesasFiltradas = despesasFiltradas.filter(d=> d.valor == despesa.valor)}

        return despesasFiltradas
    }
    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if(despesa.validarDados()){
        bd.gravar(despesa)        
        //dados cadastrados com sucesso
        document.getElementById('exampleModalLabel').innerText = 'Registro inserido com sucesso.'
        document.getElementById('fonteTituloModal').className = ('modal-header text-success')
        document.getElementById('mensagemModal').innerText = 'Despesa foi cadastrada com sucesso.'
        document.getElementById('fonteRodapeModal').innerText = 'Voltar'
        document.getElementById('fonteRodapeModal').className = ('btn-success')

        $('#modalRegistraDespesa').modal('show') 
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
        } 
        // dados inválidos
        else{ 
        document.getElementById('exampleModalLabel').innerText = 'Erro na inclusão do registro.'
        document.getElementById('fonteTituloModal').classList.add('text-danger')
        document.getElementById('mensagemModal').innerText = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente.'
        document.getElementById('fonteRodapeModal').innerText = 'Voltar e corrigir'
        document.getElementById('fonteRodapeModal').className = ('btn btn-danger')       
        
        $('#modalRegistraDespesa').modal('show')
    }
   
}

function carregaListaDespesas(despesas = Array(), filtro = false){
    //só irá carregar todos os registros se a chamada da função for no carregamento da página. Se for chamada pela função 'pesquisarDespesa', o argumento do filtro será true, não carregando todos os registros.
    if(despesas.length == 0 && filtro == false){
    despesas = bd.recuperarTodosRegistros()
    }
    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    /*<tr>
    0 = <td>15/03/2018</td>
    1 = <td>Alimentação</td>
    2 = <td>Compras do mês</td>
    3 = <td>444.75</td>
    </tr>*/

    //percorrer o array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function(d){
        //console.log(d)
        // criando a linha(tr)
        let linha = listaDespesas.insertRow()

        // criando as colunas(td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 
        
        //ajustar o tipo
        switch(parseInt(d.tipo)){
            case 1: d.tipo = 'Alimentação'
                break
            case 2: d.tipo = 'Educação'
                break
            case 3: d.tipo = 'Lazer'
                break
            case 4: d.tipo = 'Saúde'
                break
            case 5: d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor 

        // criar o botão de exclusão
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<span class="fas fa-times"></span>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            //remover a despesa
            
            let id = this.id.replace('id_despesa_', '')
            //alert(id)
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d)
    })
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, filtro = true)
}

