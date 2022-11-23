# GQ_GraphQLByExample
example codes for practice

## WebStorm Plugins
- GraphQL(VSCode도 동일하게 GraphQL extension을 깔아주면 된다)
   + gql을 사용하였을 때에 syntex hilighting 해준다

## GraphQL 특징
- query할 때에 POST만 사용한다
- application/json타입만 사용한다
- 


## 초기 생성
1. 먼저 폴더를 생성한다
```
% mkdir server
```
2. 패키지 파일을 만든다
```
% touch package.json
```
3. package.json 파일 안에 내용을 적는다
```
{
  "name": "hello-world-server",
  "private": true,
  "type": "module"
}
```
4. npm으로 인스톨 한다. apollo-server 및 graphql을 인스톨 한다
```
% npm install apollo-server graphql
```

### 쿼리 하나 테스트
1. IDE로 열어서 server.js파일을 만들어 준다
   - 기본적인 그래프ql쿼리이다. 
   - gql이라는 것이 텍스트를 graphql 스키마로 바꿔준다
   - 이렇게 스키마를 실행하면서 문법에 맞게 제작 되었는지 알 수 있다.
```
import { gql } from "apollo-server";

const typeDefs = gql`
    type Query {
        greeting: String
    }
`;

console.log(typeDefs);
```

2. 터미널로 가서 실행히본다
   - 스키마가 어떻게 나와있는지, 오류가 있는지 표시한다
```
% node server.js
```

### 기본적인 서버 구동
- greeting이라는 변수를 설정한다
- 스키마와 리줄버로 graphql을 구성되어 있다.
- ApolloServer(port: 9000)를 통하여 구현한다
- 아폴로 서버는 리슨하면 서버가 시작되고 비동기 방식으로 serverInfo를 반환한다
1. 소스를 작성한다.
```
import { ApolloServer, gql } from "apollo-server";

// 스키마
const typeDefs = gql`
    type Query {
        greeting: String
    }
`;

// 실제 데이터 가져오는 부분
const resolvers = {
    Query: {
        greeting: () => 'Hello world!', // 스키마와 리졸버에서 변수명은 같아야 한다
    }
};

const server = new ApolloServer({typeDefs, resolvers});
const serverInfo = await server.listen({port:9000});
console.log(`Server running at ${serverInfo.url}`);
```

2. 서버를 구동한다
```
% node server.js
```
3. 브라우저로 접속하면 랜딩 페이지를 볼 수 있다
   - http://localhost:9000/
<img width="1423" alt="image" src="https://user-images.githubusercontent.com/22423285/203448648-96ee92cc-44ec-4f98-8f31-2d8befb559dc.png">
   - 화면 가운데 쿼리 테스트 페이지 클릭한다(Query your server)

### 클라이언트 페이지 만들기
- 클라이언트에서 어떻게 서버를 호출하고 결과값을 표시하는지 예시이다
1. client폴더를 만들고 IDE로 연다
```
% mkdir client
```
2. 코드를 작성한다
   - index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>GraphQL Client</title>
</head>
<body>
    <h1>GraphQL Client</h1>
    <p>
        The server says:
        <strong id="greeting">
            <!-- dynamically inserted content -->
        </strong>
    </p>
    <script src="app.js"></script>
</body>
</html>
```
   - app.js
```
const GRAPHQL_URL = 'http://localhost:9000';

async function fetchGreeting() {
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                  greeting
                }
            `
        }),
    });

    const { data } = await response.json();
    return data;
}

const element = document.getElementById('greeting');
element.textContent = 'Loading....';
fetchGreeting().then((data) => {
    element.textContent = data.greeting;
});
```

3. 페이지 리프레시 해서 확인



## Query Language(QL) 구성
1. query
   - select같은 개념이다
   - send query
```
query {
  greeting
}
```
   - response(정상), 에러일 경우는 에러json 반환한다
```
{
  "data": {
    "greeting": "Hello world!"
  }
}
```
   - 기본 동작이기 때문에 query를 빼고 {}만 해도 똑같이 동작한다
```
{
  greeting
}
```

## Query 예제 테스트
### Job Board Project
- 예제 가져와서 제작
- 로그인만 http로 구현이 되어 있고 만들어 간다

#### 서버
- Express 프레임워크
1. 서버 시작(포트: 9000)
```
% npm install
% npm start
```
2. graphql 패키지랑 아폴로 서버 설치
```
% npm install apollo-server-express graphql
```
3. 스키마 파일을 생성한다
   - schema.graphql
```
type Query {
    greeting: String
}
```
4. 리졸버 파일을 생성한다
   - resolver.js
```
export const resolvers = {
    Query: {
        greeting: () => 'Hello world!',
    },
};
```
5. server.js에서 express가 동작하고 아폴로가 미들웨어로써 동작한다
   - readFile을 통하여 schema.graphql을 읽어온다
   - 먼저 apollo서버를 등록
   - applyMiddleware를 통하여 /graphql uri에 대한것만 프록시로 해결한다
```

import {ApolloServer} from "apollo-server-express";
import {readFile} from 'fs';
import {resolvers} from "./resolvers.js";

...

const typeDefs = await readFile('./schema.graphql', 'utf8');
const apolloServer = new ApolloServer({typeDefs, resolvers});
await apolloServer.start();
// graphql이 express 서버의 미들웨어로 동작하게 해준다. 이를 통해 /graphql uri로 오는것들만 처리
apolloServer.applyMiddleware({app, path: '/graphql'});

...

```
4. 서버 시작
```
% npm start
```

#### 클라이언트
- 리액트
1. 서버 시작(포트: 3000)
```
% npm install
% npm start
```



























