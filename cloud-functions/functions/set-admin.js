const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const email = "jefferywei.5765ho7@gmail.com";

async function main() {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { role: "ADMIN" });
  console.log(`Set ADMIN role for ${email} (${user.uid})`);
}

main().catch((error) => {
  console.error("Failed to set admin claim:", error);
  process.exit(1);
});
