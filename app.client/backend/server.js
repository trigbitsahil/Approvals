// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();
// const PORT = 3001;

// // --- Middleware ---
// app.use(cors({
//   origin: "http://localhost:5173", // Frontend URL (Vite)
//   methods: ["GET", "POST"],
// }));
// app.use(bodyParser.json());

// // --- WhatsApp Credentials ---
// const WHATSAPP_ACCESS_TOKEN = 'EAAecAjDNyVQBPGr6vz1PQ6lYBAZBDwZC5XDZAjZBr0PLgpZBjQBhi6WiooS63JggRvAKyLuIAnZC82al50ORGwxIFPkLzqlDhQsBVZCAZA528se5aXwL4BtqGjI8p7qCJEcxOqvLgrbHW69eIHZBS5cgFypc3EfFKtQXWiEVQE2zzHbqcXYOJsLiphK1QpvRXkL8h3rjW30mXveGxV0Oxn8IjUWE0CliZCf6SMjNg228yZCXGqHhyY3';
// const PHONE_NUMBER_ID = '705049146032161';

// // --- View PDF API ---
// app.get("/api/view-pdf", async (req, res) => {
//   const fileUrl = req.query.url;

//   if (!fileUrl) {
//     return res.status(400).send("Missing 'url' query parameter");
//   }

//   try {
//     const response = await fetch(fileUrl);

//     if (!response.ok) {
//       return res.status(response.status).send("Failed to fetch file");
//     }

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "inline; filename=preview.pdf");

//     response.body.pipe(res); // Stream PDF to client
//   } catch (error) {
//     console.error("Proxy error:", error);
//     res.status(500).send("Server error while fetching file");
//   }
// });

// // --- Send WhatsApp Message API ---
// app.post("/api/send-whatsapp", async (req, res) => {
//   const { phone, name } = req.body;

//   if (!phone || !name) {
//     return res.status(400).json({ error: "Phone and Name are required" });
//   }

//   const formattedPhone = phone.replace(/\D/g, ""); // Remove non-digits

//   const payload = {
//     messaging_product: "whatsapp",
//     to: formattedPhone,
//     type: "template",
//     template: {
//       name: "trigbit",
//       language: { code: "en" },
//       components: [
//         {
//           type: "body",
//           parameters: [
//             { type: "text", text: "Sir/Madam" },
//             { type: "text", text: name },
//           ],
//         },
//       ],
//     },
//   };

//   try {
//     const response = await fetch(`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await response.json();
//     console.log("WhatsApp API Response:", result);

//     if (response.ok) {
//       res.status(200).json({ message: "WhatsApp message sent successfully", result });
//     } else {
//       res.status(response.status).json({ error: "Failed to send WhatsApp message", details: result });
//     }
//   } catch (error) {
//     console.error("Error sending WhatsApp message:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // --- Start Server ---
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch"); // Ensure you have node-fetch installed

const app = express();
const PORT = 3001;

// --- WhatsApp Credentials ---
const WHATSAPP_ACCESS_TOKEN =
  "EAAecAjDNyVQBPLfrXIeEuz0MUeIESdAmvHwf9qzPQqcoaWauutojbDCfznUZCBvjEIQchrzJznK9AF6uJfBh6QKnDyHYDALSc4CIUFeZCbSJJSr6xBumqZBUHbkkwC2N1ZAFnRDbkrBrC0ir1bOwnmmOeEho6f1SgSDZAZAyHMPcAmqATDCnUr5E9F7AnAz6xiQTZCBoGaZCcZBgI1qmgGsf3TsxZAlZAIS8rHjQV6wc948nAZDZD";
const PHONE_NUMBER_ID = "705049146032161";

// --- Middleware ---
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL (Vite)
    methods: ["GET", "POST"],
  })
);
app.use(bodyParser.json());

// --- Webhook Verification (GET) ---
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "myverifytoken";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// --- Webhook to Receive Messages (POST) ---
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;

    if (messages) {
      const from = messages[0].from; // User's phone number (wa_id)
      const userMessage = messages[0].text?.body.toLowerCase(); // User's message text

      console.log(`Received message from ${from}: ${userMessage}`);

      // --- Keyword Based Bot Logic ---
      let reply = "Sorry, I didn't understand that. Please type 'help'.";

      if (userMessage.includes("hello") || userMessage.includes("hi")) {
        reply = "Hello! 👋 How can I assist you today?";
      } else if (userMessage.includes("help")) {
        reply =
          "Here are some things you can ask me:\n1. Company Info\n2. Product List\n3. Contact Support";
      } else if (userMessage.includes("company info")) {
        reply = "We are XYZ Corp, a leader in innovative solutions.";
      } else if (userMessage.includes("product list")) {
        reply = "Our products:\n- Product A\n- Product B\n- Product C";
      } else if (userMessage.includes("support")) {
        reply = "You can contact our support team at support@xyz.com.";
      }

      // --- Send WhatsApp Reply ---
      await sendWhatsAppMessage(from, reply);
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// --- Function to Send WhatsApp Message ---
async function sendWhatsAppMessage(to, message) {
  const payload = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: message,
    },
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log("WhatsApp API Send Response:", result);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
}

// --- View PDF API (Your Existing Code) ---
app.get("/api/view-pdf", async (req, res) => {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).send("Missing 'url' query parameter");
  }

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch file");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=preview.pdf");

    response.body.pipe(res); // Stream PDF to client
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Server error while fetching file");
  }
});

// --- Send WhatsApp Template Message API (Your Existing Code) ---
app.post("/api/send-whatsapp", async (req, res) => {
  const { phone, name } = req.body;

  if (!phone || !name) {
    return res.status(400).json({ error: "Phone and Name are required" });
  }

  const formattedPhone = phone.replace(/\D/g, ""); // Remove non-digits

  const payload = {
    messaging_product: "whatsapp",
    to: formattedPhone,
    type: "template",
    template: {
      name: "hello_world", // <-- Use your actual template name
      language: { code: "en_US" },
    },
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log("WhatsApp API Template Response:", result);

    if (response.ok) {
      res
        .status(200)
        .json({ message: "WhatsApp message sent successfully", result });
    } else {
      res
        .status(response.status)
        .json({ error: "Failed to send WhatsApp message", details: result });
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
