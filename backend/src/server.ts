import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";

const server = Fastify({ logger: true });

/* Test if server working, delete when actually start dev
server.register(fastifyStatic, {
	root: path.join(process.cwd(), "public"),
});

server.get("/test", async () => {
	return { running: true };
});

server.listen({ port: 3000, host: "0.0.0.0" }).catch((err) => {
	server.log.error(err);
	process.exit(1);
});
*/
