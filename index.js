import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";

async function startBot() {
  let startDate = moment("2025-01-10T09:00:00");
  const endDate = moment("2025-12-23T17:00:00");

  // Boucle à travers chaque jour
  while (startDate.isBefore(endDate)) {
    const dayOfWeek = startDate.isoWeekday(); // 1=Lun, 3=Mer, 6=Sam, 7=Dim

    // Vérifier si le jour est autorisé (Pas mercredi=3, samedi=6, dimanche=7)
    if (dayOfWeek !== 3 && dayOfWeek !== 6 && dayOfWeek !== 7) {
      console.log(`--- Génération pour le : ${startDate.format("LL")} ---`);
      
      // Créer 30 commits pour cette journée
      for (let i = 0; i < 30; i++) {
        // On espace les commits sur la plage 9h-17h (toutes les ~16 minutes)
        const commitDate = startDate.clone()
          .add(i * 16, "minutes") 
          .format();

        const data = { date: commitDate };

        // Écriture synchrone pour garantir l'ordre des commits
        jsonfile.writeFileSync(path, data);
        
        // Exécution de la commande Git
        await simpleGit().add([path]).commit(commitDate, { "--date": commitDate });
        console.log(`Commit ${i + 1}/30 effectué : ${commitDate}`);
      }
    }
    
    // Passer au jour suivant à 9h00
    startDate.add(1, "day").hour(9).minute(0).second(0);
  }

  // Push final une fois que tout est fini
  console.log("Terminé ! Envoi vers GitHub...");
  await simpleGit().push();
}

startBot().catch(console.error);
