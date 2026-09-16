const REGLES = {
	salut: {
		mots: ["salut", "bonjour", "coucou", "hello"],
		fr: "Bonjour ! Je peux t'aider a reviser TCP/IP, DNS et HTTP simplement.",
		en: "Hello! I can help you review TCP/IP, DNS and HTTP in simple words.",
	},
	aide: {
		mots: ["aide", "help"],
		fr: "Commandes : /aide, /effacer, /compte, /lang en. Mots connus : salut, aide, test, tcp, ip, dns, http, paquet, port, url, get, post, 200, 404, https, cache, client, serveur, quiz.",
		en: "Commands: /aide, /effacer, /compte, /lang en. Known words: salut, aide, test, tcp, ip, dns, http, packet, port, url, get, post, 200, 404, https, cache, client, server, quiz.",
	},
	test: {
		mots: ["test", "essai"],
		fr: "Test OK : le chatbot reseaux repond.",
		en: "Test OK: the network review chatbot answers.",
	},
	tcp: {
		mots: ["tcp", "tcp/ip"],
		fr: "TCP decoupe les donnees, verifie leur arrivee et les remet dans l'ordre.",
		en: "TCP splits data, checks delivery and puts packets back in order.",
	},
	ip: {
		mots: ["ip", "tcp/ip"],
		fr: "IP sert a adresser les machines et a faire voyager les paquets jusqu'a la bonne destination.",
		en: "IP addresses machines and routes packets to the right destination.",
	},
	dns: {
		mots: ["dns", "nom"],
		fr: "DNS traduit un nom comme example.com en adresse IP utilisable par les machines.",
		en: "DNS translates a name like example.com into an IP address machines can use.",
	},
	http: {
		mots: ["http", "web"],
		fr: "HTTP organise les demandes et les reponses entre un navigateur et un serveur web.",
		en: "HTTP organizes requests and responses between a browser and a web server.",
	},
	paquet: {
		mots: ["paquet", "paquets", "packet", "packets"],
		fr: "Un paquet est un petit morceau de donnees qui circule sur le reseau avec des informations pour arriver au bon endroit.",
		en: "A packet is a small piece of data that travels across the network with information to reach the right place.",
	},
	port: {
		mots: ["port", "ports"],
		fr: "Un port sert a viser le bon service sur une machine : par exemple 80 pour HTTP et 443 pour HTTPS.",
		en: "A port targets the right service on a machine: for example 80 for HTTP and 443 for HTTPS.",
	},
	url: {
		mots: ["url"],
		fr: "Une URL indique comment joindre une ressource : protocole, nom de domaine, chemin et parfois des parametres.",
		en: "A URL tells how to reach a resource: protocol, domain name, path and sometimes parameters.",
	},
	client: {
		mots: ["client", "serveur", "server"],
		fr: "Le client envoie une requete, le serveur traite la demande et renvoie une reponse.",
		en: "The client sends a request, the server handles it and sends back a response.",
	},
	get: {
		mots: ["get", "post"],
		fr: "GET sert surtout a demander une ressource. POST sert surtout a envoyer des donnees au serveur.",
		en: "GET mainly asks for a resource. POST mainly sends data to the server.",
	},
	statut: {
		mots: ["statut", "status", "code", "200", "404"],
		fr: "Un code HTTP resume le resultat : 200 veut dire OK, 404 veut dire ressource introuvable.",
		en: "An HTTP status code summarizes the result: 200 means OK, 404 means resource not found.",
	},
	https: {
		mots: ["https", "tls", "chiffrement"],
		fr: "HTTPS, c'est HTTP protege par TLS : la connexion est chiffree et l'identite du site est verifiee par certificat.",
		en: "HTTPS is HTTP protected by TLS: the connection is encrypted and the site's identity is checked with a certificate.",
	},
	cache: {
		mots: ["cache"],
		fr: "Le cache garde une copie temporaire d'une ressource pour repondre plus vite et eviter des requetes inutiles.",
		en: "A cache keeps a temporary copy of a resource to answer faster and avoid unnecessary requests.",
	},
};

function validerMessageStrict(raw) {
	if (typeof raw !== "string") {
		return { ok: false, error: "Le message doit être du texte" };
	}

	const value = raw.trim();
	if (value === "") {
		return { ok: false, error: "Le message ne doit pas être vide" };
	}

	if (value.length > 280) {
		return {
			ok: false,
			error: "Le message ne doit pas dépasser 280 caractères",
		};
	}

	return { ok: true, value };
}

export function replyTo(message, count = 0, lang = "fr") {
	const texte = message.trim().toLowerCase();
	const langue = lang === "en" ? "en" : "fr";

	if (texte === "/aide") {
		return REGLES.aide[langue];
	}

	if (texte === "/compte") {
		return langue === "en"
			? `There are ${count} messages in the conversation.`
			: `Il y a ${count} messages dans la conversation.`;
	}

	if (texte === "/lang en") {
		return REGLES.salut.en;
	}

	const mots = motsConnus(texte);
	for (const regle of Object.values(REGLES)) {
		if (contient(mots, regle.mots)) {
			return regle[langue];
		}
	}

	return langue === "en"
		? "I do not have an answer for this network review yet."
		: "Je n'ai pas encore de réponse pour cette révision réseau.";
}

function motsConnus(texte) {
	return texte.match(/[\p{L}\p{N}/]+/gu) ?? [];
}

function contient(mots, choix) {
	return mots.some((mot) => choix.includes(mot));
}

// Tolérance : un message à peine trop long (jusqu'à 300 caractères) reste accepté.
export function validateMessage(raw) {
  const resultat = validerMessageStrict(raw);
  if (resultat.ok || typeof raw !== 'string') {
    return resultat;
  }
  const value = raw.trim();
  if (value !== '' && value.length <= 300) {
    return { ok: true, value };
  }
  return resultat;
}
