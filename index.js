import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// Liste de messages pour simuler un vrai projet
const commitMessages = [
  "Initial commit for module", "Fix: handle null pointer exception",
  "Update: styling components", "Refactor: clean up unused variables",
  "Docs: update README.md", "Feat: add login validation",
  "Fix: responsive layout issues", "Test: add unit tests for auth",
  "Chore: update dependencies", "Feat: implement dark mode support",
  "Fix: API integration error", "Performance: optimize image loading"
];

async function startBot() {
  let startDate = moment("2025-01-10T09:00:00");
  const endDate = moment("2025-12-23T17:00:00");

  while (startDate.isBefore(endDate)) {
    const dayOfWeek = startDate.isoWeekday();

    // Jours travaillés : Lundi(1), Mardi(2), Jeudi(4), Vendredi(5)
    if (dayOfWeek !== 3 && dayOfWeek !== 6 && dayOfWeek !== 7) {
      
      // Nombre de commits aléatoire entre 5 et 30 pour ce jour
      const commitsToday = random.int(5, 30);
      console.log(`--- ${startDate.format("LL")} : ${commitsToday} commits prévus ---`);
      
      for (let i = 0; i < commitsToday; i++) {
        // Distribution aléatoire dans la journée de 9h à 17h
        const commitDate = startDate.clone()
          .hour(random.int(9, 16))
          .minute(random.int(0, 59))
          .second(random.int(0, 59))
          .format();

        const data = { 
            date: commitDate,
            task: `Task_${i}`,
            status: "completed" 
        };

        const randomMsg = commitMessages[random.int(0, commitMessages.length - 1)];

        jsonfile.writeFileSync(path, data);
        
        // On commit avec un message réaliste et la fausse date
        await simpleGit().add([path]).commit(randomMsg, { "--date": commitDate });
      }
    }
    
    startDate.add(1, "day").hour(9).minute(0);
  }

  console.log("Fini ! Envoi vers le dépôt distant...");
  await simpleGit().push();
}

startBot().catch(console.error);
