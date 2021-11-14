# Quick_Recipe_API


Esta API foi criada com o propósito de uma pesquisa mais rápida de receitas de diversos sites. Tendo neste momento criadas 4 Funcionalidades.
O Url da API se for inicializada na própria máquina será: localhost:8000 onde aparecerá uma mensagem Default: "Welcome to my Quick Recipes API"

# Pre-requisitos
- Install [Node.js](https://nodejs.org/en/)

# Como começar
- clonar o repositório

- Instalar dependências
```
npm install
```
- Correr o Projeto
```
npm run start
```


# Sugestão

Para melhor visualizar o resultado do API, aconselho a instalar uma extensão no seu browser para conseguir visualizar melhor os dados em json. Por exemplo, a que eu utilizo no Microsoft EDGE é: PrettyJSON.


# Funcionalidades

 - Todas as Receitas

    Irá receber todas as receitas de todos os sites através de um ficheiro json.

    Url: localhost:8000/recipes


 - Todas as Receitas de 1 site

    Irá receber todas as receitas do site passado como parâmetro através de um ficheiro json.
        Nomes dos sites disponíveis: Pingo Doce, teleculinaria, 24Kitchen, petiscos

    ```
    Url: localhost:8000/recipes/(nome do site)
    ```

 - Receitas com 1 Ingrediente Específico
        
        Irá receber todas as receitas com o ingrediente passado como parâmetro de todos os sites através de um ficheiro json.

        ```
        Url: localhost:8000/recipes/key/(nome do ingrediente)
        ```

 - Receitas com 2 Ingredientes Específicos
        
        Irá receber todas as receitas com os 2 ingredientes passados como parâmetro de todos os sites através de um ficheiro json.

        ```
        Url: localhost:8000/recipes/key/(nome do ingrediente)/key2/(nome do ingrediente2)
        ```
