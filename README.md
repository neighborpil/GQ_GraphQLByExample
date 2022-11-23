# GQ_GraphQLByExample
example codes for practice

## WebStorm Plugins
- GraphQL(VSCode도 동일하게 GraphQL extension을 깔아주면 된다)
  + gql을 사용하였을 때에 syntex hilighting 해준다

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





























