// pb_hooks/main.pb.js
onRecordAfterCreateRequest((e) => {
    // Vérifie que c'est bien la collection "contact_messages"
    if (e.record.collection().name !== "contact_messages") {
        return
    }

    const record = e.record

    // Prépare l'email
    const message = new MailerMessage({
        from: {
            address: $app.settings().meta.senderAddress,
            name: $app.settings().meta.senderName,
        },
        to: [{address: "restaurant@lemoulinwindsor.c"}],
        subject: "🍽️ Nouveau message de contact - Le Moulin",
        html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>Nom:</strong> ${record.get("name")}</p>
            <p><strong>Email:</strong> ${record.get("email")}</p>
            <p><strong>Téléphone:</strong> ${record.get("phone")}</p>
            <p><strong>Message:</strong></p>
            <p>${record.get("message")}</p>
        `,
    })

    // Envoie l'email
    $app.newMailClient().send(message)
}, "contact_messages")