const { APIError } = require("../../utils/error/app-errors");
const { CreateUniqueName } = require("../../utils/functions");

const util = require("util");
const { ContainerModel } = require("../models");
const exec = util.promisify(require("child_process").exec);

const Runcommand = (COMMAND) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { stdout, stderr } = await exec(COMMAND);
			if (stdout) resolve(stdout);
			if (stderr) {
				throw new Error(stderr);
			}
		} catch (e) {
			console.log(e);
			reject(e);
		}
	});
};

class ContainerRepository {
	async CreateContainer({ machine, name: containerName, port }) {
		try {
			let BASEPORT, PROTOCOL;
			if (machine == "mongo") {
				BASEPORT = 27017;
				PROTOCOL = "tcp";
			}
			if (machine == "redis") {
				BASEPORT = 6379;
				PROTOCOL = "tcp";
			}
			if (machine == "serveride") {
				BASEPORT = 8443;
				PROTOCOL = "https";
			}
			const name = containerName || CreateUniqueName();
			let CMD = `docker run --name ${name} -p ${port}:${BASEPORT} -d ${machine}`;

			if (machine == "serveride") {
				CMD = `docker run -d \
					--name=${name} \
					-e PUID=1000 \
					-e PGID=1000 \
					-e TZ=Etc/UTC \
					-e PASSWORD=password \
					-e HASHED_PASSWORD= \
					-e SUDO_PASSWORD=password \
					-e SUDO_PASSWORD_HASH= \
					-e PROXY_DOMAIN=code-server.my.domain \
					-e DEFAULT_WORKSPACE=/config/workspace \
					-p ${port}:${BASEPORT} \
					-v /path/to/appdata/config:/${name} \
					--restart unless-stopped \
					lscr.io/linuxserver/code-server:latest`;
			}

			const data = await Runcommand(CMD);

			const container = new ContainerModel({
				name: containerName,
				machine,
				online: true,
				containerId: data,
				port,
			});

			await container.save();

			return {
				data: {
					port,
					containerName,
					containerId: data,
					name,
				},
			};
		} catch (e) {
			throw new APIError("Error while starting container");
		}
	}

	async FindNextPort({ machine, name }) {
		try {
			let BASEPORT;
			if (machine == "mongo") BASEPORT = 27018;
			if (machine == "redis") BASEPORT = 6379;
			if (machine == "serveride") BASEPORT = 8443;

			if (name) {
				const exist = await ContainerModel.find({ name });
				if (exist && exist.length > 0)
					throw new Error("Another machine running with same name");
			}

			const data = await ContainerModel.find({ machine });
			if (data.length === 10) throw new Error("No port available");
			if (data.length === 0) return BASEPORT;
			let found = false;

			data.forEach((d) => {
				if (d.name === name) found = true;
			});
			let ports = data.map((d) => d.port);

			let portSet = new Set(ports);

			for (let i = BASEPORT; i <= BASEPORT + 10; i++) {
				if (!portSet.has(i)) return i;
			}
		} catch (e) {
			throw new APIError(`Error while finding port ${e}`);
		}
	}

	async DeleteContainer({}) {}
}

module.exports = ContainerRepository;
