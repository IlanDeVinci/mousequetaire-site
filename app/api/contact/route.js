import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, category, message } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return Response.json(
        { error: "Nom, email et message sont requis." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    const categoryLabel = category || "Général";

    await resend.emails.send({
      from: "Mousequetaire Contact <onboarding@resend.dev>",
      to: "mousequetaires@gmail.com",
      replyTo: email,
      subject: `[${categoryLabel}] Nouveau message de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0E304A; border-bottom: 2px solid #7DD4FF; padding-bottom: 10px;">
            Nouveau message - ${categoryLabel}
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #0E304A;">Nom :</td>
              <td style="padding: 8px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #0E304A;">Email :</td>
              <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #0E304A;">Catégorie :</td>
              <td style="padding: 8px;">${categoryLabel}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
            <h3 style="color: #0E304A; margin-top: 0;">Message :</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi email:", error);
    return Response.json(
      { error: "Erreur lors de l'envoi du message. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
