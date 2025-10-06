# Spotter 🏋️‍♂️🤝

**Spotter** is a social network dedicated to the world of gyms and fitness.  
Not just workouts: it’s a way to turn the gym from a simple place of exercise into a real community.

## 🚀 Vision
Connecting people who already share the same space (gym, weight room, fitness area) and giving them tools to meet, motivate each other, and grow together.

## ✨ Key Features
- **GymBro Feature** → send a request to a buddy to train together.  
- **Local Community** → join your gym or nearby fitness centers.  
- **Chat & Social** → direct chat with members to organize workouts.  
- **Leaderboard & Ranking** → internal gym leaderboards for each exercise (e.g., bench press record 190 kg by Mario Rossi 🏆). --> palestre verificate creano degli exercises e utenti selezionano il loro record. Inizialmente esso è inserito come "non verificato" e dunque un record "poco affidabile", ognuno però con un numero di "validazioni" da parte di altri utenti (solo se della stessa palestra), così si può filtrare per palestra, per numero di validazioni ecc..

Gli unici record "verificati" sono quelli inseriti manualmente dal gym_admin (top 5 su esercizi a scelta)

Un utente si registra in una palestra, dichiarando di appartenere ad essa, senza verifiche (non ha vantaggi a mentire).
- **Discovery** → find new buddies in nearby gyms and expand your fitness network.  
- **WorkoutPlan** → cerca utenti sulla piattaforma e accedi alle loro schede pubbliche
- **WorkoutTracking** → inserisci la tua scheda e associala alla palestra che frequenti, tieni traccia degli allenamenti e degli esercizi

## 🎯 Why Spotter?
Today, many people at the gym just exchange a nod. Spotter wants to close this gap, making socialization easier and turning the gym into an active, motivating, and fun community.

//registrazione classica con mail e password alla route /register, poi ci sarà una route dedicata per Oauth, con rispetivo controller. Ci sarà anche una route apposita per completare il profilo (/profile) con corrispondente controller. Ci sarà anche una route per la registrazione di una palestra, con controller dedicato (role:GYM_ADMIN) 
//! facciamo che per il mio MVP verifico a mano le palestre che mi inviano i documenti, più avanti metto sistemi di verifica automatizzati con API specifiche. Quindi ora aggiungo a gym un relazione con più admin (ownerIds Int[]) e un campo verified (finchè è false di fatto non può fare nulla, così come l'admin/gli admin), mentre in user aggiungo gymsOwned Gym[], dove ci sono le gym di cui è admin.