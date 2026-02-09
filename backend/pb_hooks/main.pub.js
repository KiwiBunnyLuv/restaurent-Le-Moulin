// pb_hooks/main.pb.js
onRecordAfterCreateRequest((e) => {
    // Vérifie que c'est bien la collection "Contact_Messages"
    if (e.record.collection().name !== "Contact_Messages") {
        return
    }

    const record = e.record

    // Prépare l'email
    const message = new MailerMessage({
        from: {
            address: $app.settings().meta.senderAddress,
            name: $app.settings().meta.senderName,
        },
        to: [{address: "restaurant@lemoulinwindsor.ca"}],
        subject: "🍽️ Nouveau message de contact - Le Moulin",
        html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>Nom:</strong> ${record.get("nom")}</p>
            <p><strong>Email:</strong> ${record.get("email")}</p>
            <p><strong>Message:</strong></p>
            <p>${record.get("message")}</p>
        `,
    })

    // Envoie l'email
    try {
        $app.newMailClient().send(message)
    } catch (error) {
        $app.logger().error("Erreur envoi email contact", { error })
    }
}, "Contact_Messages")
