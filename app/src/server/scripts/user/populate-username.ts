import { db } from "../../db";

async function populateUsername() {
  const users = await db.user.findMany();

  for (const user of users) {
    const baseUsername = user.email.split("@")[0];
    let username = baseUsername;
    let counter = 0;

    while (true) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: { username },
        });
        console.log(`Updated user ${user.id} with username: ${username}`);
        break;
      } catch {
        // If username is taken, append a number and try again
        username = `${baseUsername}${counter}`;
        counter++;
      }
    }
  }
}

void populateUsername();
