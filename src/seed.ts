import * as neo4j from "neo4j-driver";

const data = {
  users: require("../users.json"),
  posts: require("../posts.json"),
};

async function seedNeo4j() {
  const neo4jDriver = neo4j.driver(
    "bolt://127.0.0.1:7687",
    neo4j.auth.basic("neo4j", "password")
  );

  const neo4jSession = neo4jDriver.session();

  try {
    await neo4jSession.run(`
          MATCH (a)
          DETACH DELETE a
    `);

    await neo4jSession.run(`
        ${data.users
          .map((user) => {
            const post = data.posts.find((p) => p.userId === user.id);
            return `
                    CREATE (:User { id: ${user.id}, name: "${user.name}", age: ${user.age} })
                        -[:HAS_POST]->(:Post { id: ${post.id}, content: "${post.content}" })
            `;
          })
          .join("\n")}
    `);
  } finally {
    await neo4jSession.close();
    await neo4jDriver.close();
  }

  console.log("done");
}

seedNeo4j();
