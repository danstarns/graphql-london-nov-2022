import { createSchema, createYoga } from "graphql-yoga";
import gql from "gql-tag";
import { createServer } from "node:http";

const data = {
  users: require("../users.json"),
  posts: require("../posts.json"),
};

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: Int!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    creator: User!
    content: String!
  }

  type Query {
    users: [User!]!
    posts: [Post!]!
  }
`;

const schema = createSchema({
  typeDefs,
  resolvers: {
    Query: {
      users: () => {
        return data.users;
      },
      posts: () => {
        return data.posts;
      },
    },
    Post: {
      creator: (root) => data.users.find((u) => u.id === root.userId),
    },
    User: {
      posts: (root) => data.posts.filter((p) => p.userId === root.id),
    },
  },
});

const yoga = createYoga({
  schema,
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
