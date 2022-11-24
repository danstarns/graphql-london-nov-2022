import { createYoga } from "graphql-yoga";
import { Neo4jGraphQL } from "@neo4j/graphql";
import * as neo4j from "neo4j-driver";
import gql from "gql-tag";
import { createServer } from "node:http";

const typeDefs = gql`
  type User {
    name: String
    age: Int
    posts: [Post!]! @relationship(type: "HAS_POST", direction: OUT)
  }

  type Post {
    content: String
  }
`;

const driver = neo4j.driver(
  "bolt://127.0.0.1:7687",
  neo4j.auth.basic("neo4j", "password")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

async function main() {
  const schema = await neoSchema.getSchema();

  const yoga = createYoga({
    schema,
  });

  const server = createServer(yoga);

  server.listen(4000, () => {
    console.info("Server is running on http://localhost:4000/graphql");
  });
}

main();
