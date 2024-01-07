# DIET Daily API :stew:

Clique aqui para ver o design proposto em [Figma do Projeto](https://www.figma.com/community/file/1218573349379609244)

Este estudo de caso foi proposto seguindo a trilha de node e backend da RocketSeat, e desenvolvida com as propostas sugeridas e melhorias autorais.

Neste estudo de caso desenvolvi uma api que implementa diversas ferramentas com _fastify_, _jsonwebtoken(JWT)_, _typescript_, _vitest_, _knex_, _postgree e sqlite_, _zod_ e _bcrypt_.

Nesta Restful API é possível se cadastrar como usuário para reaizar um registro de suas refeições diárias, sendo possível acompanhar todas as suas refeições e regisstrar quis refeições estão dentro da dieta ou não

## SOBRE a aplicação

### Serviços/Casos de Uso da Aplicação

- É possível cadastrar um usuário.
- O Usuŕio é identificado entre as requisições.
- O usuŕio pode marcar uma refeição feita, com as seguintes informações:

  _As refeições sempre são relacionadas a um usuário._

  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta

- É possível permitir que o usuário edite uma refeição, podendo alterar todos os dados acima, mas somente a própria refeição cadastrada por ele
- É possível permitir que o usuário apague uma refeição, mas somente a própria refeição cadastrada por ele
- O usuŕio pode listar todas as suas refeições.
- É possível visualizar uma única refeição do usuŕio
- É possível recuperar as métricas do usuário, que compreende:
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência(streak) de refeições dentro da dieta
- **O usuário só pode visualizar, editar e apagar as refeições o qual ele criou**

## Rotas da aplicação

### Rotas de autenticação(AUTH)

- [POST] _/auth/signIn_: Esta rota é responsável de autenticar o usuário na aplicação a partir de um `email` e `password` recebidos através do body d requisição:

```
//Request
{
  email: email@example.com,
  password: validPassword@123456
}
```

Esta rota retorna uma mensagem de sucesso com um token JWT para a sessão do usuário:

```
//Response
{
  message: "User Logged in",
  access_token: stringJwtToken
}
```

:construction: _doc under construction_ :construction:

### Rotas de usuário(users)

- [POST] _/users/_ : Cadastro de usuário

- [GET] _/users/_ : Listagem de usuários

- [GET] _/users/:id_ : Lista usuŕios pelo id específico

- [POST] _/users/summary/_ : Acessa o sumário de informações do usuário

### Rotas de refeições(meals) <sub>This Doc is under construction</sub>

- [POST] _/meals/_ : Registra uma refeição

- [PUT] _/meals/:id_ : Edita uma refeição pelo id específico

- [DELETE] _/meals/:id_ : Deleta uma refeição pelo id específico

- [GET] _/meals/_ : Lista todas as refeições do usuário

- [GET] _/meals/:id_ : Lista as refeições do usuário pelo id específico
