# SysGI

#### Sistema de Gerenciamento de Infratores

:star2: Software desenvolvido por acadêmicos do curso de Ciências da Computação da [**UNIFENAS**](https://www.unifenas.br/)

## Configuração

Este projeto foi desenvolvido utilizando-se React Native. Para facilitar o desenvolvimento aplica-se o uso da ferramenta [Expo](https://docs.expo.io/).

#### :warning: Pré-requisitos:

- Chocolatey
  - Para instalar siga [o guia](https://chocolatey.org/install)
- Node.js
  - Baixe a ultima versão estável [aqui](https://nodejs.org/en/download/)
- Git
  - Faça o download [aqui](https://git-scm.com/downloads)
- Yarn
  - Siga o [guia](https://classic.yarnpkg.com/en/docs/install/) de instalação
- Expo-cli
  - Instale globalmente, seguindo o [passo-a-passo](https://docs.expo.io/get-started/installation/)

## Executar

Tenha instalado uma IDE para desenvolvimento React. Recomenda-se o uso do [_Visual Studio Code_](https://code.visualstudio.com/download).

Certifique-se de executar antes:

`npm install` ou `yarn install`

#### Para testar em um dispositivo móvel:

Instale o aplicativo Expo em seu dispositivo. Lembre-se de conectá-lo na mesma rede da sua máquina.

No terminal, execute:

`npm start` ou `yarn start`

Espere aparecer o código **QR**, e o escaneie dentro do app Expo que você instalou em seu dispositivo.

#### Para gerar o build:

Deixe o projeto executando em uma guia do terminal.

Em uma nova guia do terminal, execute `expo login` e informe suas credenciais Expo.

##### :robot: Para Android:

`expo build:android`

##### :apple: Para iOS:

`expo build:ios`

## Contribua

Pull requests são bem-vindos.

Para as mensagens de commit, siga o [padrão](https://gist.github.com/crissilvaeng/dfb5b14f8eb2c25df4fd8a49f4f03252), para uma melhor experiência de desenvolviento.

## License

[MIT](https://choosealicense.com/licenses/mit/)
