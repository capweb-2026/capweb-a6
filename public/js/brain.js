const REGLES = {
	salut: {
		mots: ["salut", "bonjour", "coucou", "hello"],
		fr: "Bonjour ! Je peux t'aider a reviser TCP/IP, DNS et HTTP simplement.",
		en: "Hello! I can help you review TCP/IP, DNS and HTTP in simple words."
	},
	aide: {
		mots: ["aide", "help"],
		fr: "Commandes : /aide, /effacer, /compte, /lang en. Mots connus : salut, aide, test, tcp, ip, dns, http.",
		en: "Commands: /aide, /effacer, /compte, /lang en. Known words: salut, aide, test, tcp, ip, dns, http."
	},
	test: {
		mots: ["test", "essai"],
		fr: "Test OK : le chatbot reseaux repond.",
		en: "Test OK: the network review chatbot answers."
	},
	tcp: {
		mots: ["tcp", "tcp/ip"],
		fr: "TCP decoupe les donnees, verifie leur arrivee et les remet dans l'ordre.",
		en: "TCP splits data, checks delivery and puts packets back in order."
	},
	ip: {
		mots: ["ip", "tcp/ip"],
		fr: "IP sert a adresser les machines et a faire voyager les paquets jusqu'a la bonne destination.",
		en: "IP addresses machines and routes packets to the right destination."
	},
	dns: {
		mots: ["dns", "nom"],
		fr: "DNS traduit un nom comme example.com en adresse IP utilisable par les machines.",
		en: "DNS translates a name like example.com into an IP address machines can use."
	},
	http: {
		mots: ["http", "web"],
		fr: "HTTP organise les demandes et les reponses entre un navigateur et un serveur web.",
		en: "HTTP organizes requests and responses between a browser and a web server."
	}
};

export function validateMessage(raw) {
	if (typeof raw !== "string") {
		return { ok: false, error: "Le message doit être du texte" };
	}

	const value = raw.trim();
	if (value === "") {
		return { ok: false, error: "Le message ne doit pas être vide" };
	}

	if (value.length > 280) {
		return { ok: false, error: "Le message ne doit pas dépasser 280 caractères" };
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
