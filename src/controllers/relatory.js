import moment from 'moment';

class Relatory
{
  htmlRelatorio = (infrator) => {
    let html_res = `
    <html>
      <head>
        <style>
          body{
            font-family: sans-serif;
            color:#800000;
            -webkit-print-color-adjust: exact; 
          }
          h1, h2{
            text-align: center;
          }
          table{
            flex-wrap: wrap;
            width: 100%;
          }
          tr{
            display: flex;
          }
          th {
            background: linear-gradient(338deg, rgba(128,0,0,1) 0%, rgba(220,20,60,1) 100%);
            color: white;
            width: 100%;
            display: inline;
            font-weight: bold;
            line-height: 40px;
            border-top-left-radius: 30px;
            border-top-right-radius: 30px;
          }
          img{
            position: absolute;
            width: 70px;
            height: 70px;
            top:20px;
            left: 20px;
          }
          .title{
            display: inline;
            line-height: 90px;
          }
          .date{
            position: absolute;
            top:70px;
            right: 30px;
          }
          .list td{
            border-style: solid;
            border-width: 0 1px 2px 1px;
            border-color: #800000;
            padding: 5px 0;
          }

          .dados{
            margin-bottom: 20px;
          }
          .dados td{
            border-style: solid;
            border-width: 0 1px 1px 1px;
            border-color: #800000;
          }
          .atributo{
            display:inline-flex;
            align-items: center;
            height: 40px;
            margin: 5px 10px;
          }
          .atributo label{
            background: linear-gradient(338deg, rgba(128,0,0,1) 0%, rgba(220,20,60,1) 100%);
            padding-left:20px;
            line-height: 40px;
            padding-right: 10px;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            border-top-left-radius: 30px;
            border-bottom-left-radius: 30px;
          }
          .atributo p{
            display: inline;
            line-height: 38px;
            padding: 0 10px;
            min-width: 30px;
            border-top-right-radius: 30px;
            border-bottom-right-radius: 30px;
            border-style: solid;
            border-width: 1px;
            border-left-width: 0px;
            border-color: #800000;
          }
        </style>
      </head>
      <body >
        <div class="title">
          <h1>RELATÓRIO</h1>
        </div>
        <div class="date">
          <p>${moment(new Date()).format("DD/MM/YYYY HH:mm:ss")}</p>
        </div>
      <img src="https://firebasestorage.googleapis.com/v0/b/sysgi-210bd.appspot.com/o/icon.png?alt=media&token=c89480ea-356f-406e-9033-263f9347c7ea">
        
        <table class="dados">
          <thead>
            <tr><th>DADOS</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="atributo">
                  <label>Nome</label>
                  <p>${infrator.Nome}</p>
                </div>
                <div class="atributo">
                  <label>Registrado</label>
                  <p>${moment(infrator.Data_registro).format("DD/MM/YYYY")}</p>
                </div>
                <div class="atributo">
                  <label>Sexo</label>
                  <p>${infrator.Sexo == 'M' ? "Masculino" : "Feminino"}</p>
                </div>
                <div class="atributo">
                  <label>Rg</label>
                  <p>${infrator.Rg}</p>
                </div>
                <div class="atributo">
                  <label>Cpf</label>
                  <p>${infrator.Cpf}</p>
                </div>
                <div class="atributo">
                  <label>Nascimento</label>
                  <p>${moment(infrator.Data_nascimento).format("DD/MM/YYYY")}</p>
                </div>
                <div class="atributo">
                  <label>Nome da mãe</label>
                  <p>${infrator.Mãe}</p>
                </div>
                <div class="atributo">
                  <label>Medida S.</label>
                  <p>${infrator.MedidaSE ? "SIM" : "NÃO"}</p>
                </div>
                <div class="atributo">
                  <label>Logradouro</label>
                  <p>${infrator.Logradouro}</p>
                </div>
                <div class="atributo">
                  <label>Nº</label>
                  <p>${infrator.Num_residência}</p>
                </div>
                <div class="atributo">
                  <label>Bairro</label>
                  <p>${infrator.Bairro}</p>
                </div>
                <div class="atributo">
                  <label>Cidade</label>
                  <p>${infrator.Cidade}</p>
                </div>
                <div class="atributo">
                  <label>Uf</label>
                  <p>${infrator.Uf}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="list">
          <thead>
            <tr><th>INFRAÇÕES</th></tr>
          </thead>
          <tbody>
            ${
              infrator.Infrações.map((infração) => {
                return `<tr>
                <td>
                  <div>
                    <div class="atributo">
                      <label>Descrição</label>
                      <p>${infração.Descrição}</p>
                    </div>
                    <div class="atributo">
                      <label>Reds</label>
                      <p>${infração.Reds}</p>
                    </div>
                    <div class="atributo">
                      <label>Data de ocorrência</label>
                      <p>${moment(infração.Data_ocorrência).format("DD/MM/YYYY")}</p>
                    </div>
                    <div class="atributo">
                      <label>Data de registro</label>
                      <p>${moment(infração.Data_registro).format("DD/MM/YYYY")}</p>
                    </div>
                  </div>
                </td>
              </tr>
                `
              })
            }
          </tbody>
        </table>
      </body>
    <html>`

    return html_res;
  }
}

export default new Relatory