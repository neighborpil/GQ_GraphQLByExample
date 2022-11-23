import { ApolloServer, gql } from "apollo-server";

// 스키마
const typeDefs = gql`
    # schema 부분은 query가 default이기 때문에 빼도 된다
    schema { 
        query: Query
    }
    
    type Query {
        greeting: String
    }
`;

// console.log(typeDefs);

// 실제 데이터 가져오는 부분
const resolvers = {
    Query: {
        greeting: () => 'Hello world!', // 스키마와 리졸버에서 변수명은 같아야 한다
    }
};

const server = new ApolloServer({typeDefs, resolvers});
const serverInfo = await server.listen({port:9000});
console.log(`Server running at ${serverInfo.url}`);


