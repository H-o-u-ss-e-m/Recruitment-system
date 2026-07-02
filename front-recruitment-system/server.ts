import express from "express";
import path from "path";
import cors from "cors";
import multer from "multer";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// On garde cette petite chaîne pour éviter que le visualiseur PDF ne plante si un fichier est mal chargé
const DEFAULT_PDF_BASE64 = "JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKENTKSAvQXV0aG9yIChDYW5kaWRhdGUpCi9DcmVhdG9yIChSSUYpCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZXMKL0tpZHMgWzQgMCBSXQovQ291bnQgMQo+PgplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA2IDAgUgo+Pgo+Pgo+PgplbmRvYmoKNSAwIG9iago8PAovTGVuZ3RoIDQzCj4+CnN0cmVhbQpCVEYxIDEyIFRmIDUwIDgwMCBUZCAoQ1YgLSBHcm91cGUgUklGKSBUaiBFVEQKZW5kc3RyZWFtCmVuZG9iago2IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwODUgMDAwMDAgbiAKMDAwMDAwMDEzNCAwMDAwMCBuIAowMDAwMDAwMTkxIDAwMDAwIG4gCjAwMDAwMDAzMTggMDAwMDAgbiAKMDAwMDAwMDQxMCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDcKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjQ5NwolJUVPRg==";

// ============================================================================
// STRUCTURES DE DONNÉES (VIDES)
// ============================================================================

interface User {
  id: number; email: string; name: string; role: "CANDIDATE" | "RECRUITER";
  password?: string; phone?: string; birthDate?: string; gender?: string;
  nationality?: string; address?: string; postalCode?: string;
  educationLevel?: string; university?: string; specialite?: string;
  linkedinUrl?: string; githubUrl?: string; profileDescription?: string;
}

interface JobOffer {
  id: number; titrePoste: string; descriptionPoste: string;
  competencesRequises: string; datePublication: string;
  dateLimite: string; status: "OPEN" | "CLOSED"; recruiterName: string;
}

interface Application {
  id: number; candidateId: number; candidateFullName: string;
  candidateEmail: string; jobOfferId: number; jobTitle: string;
  cvUrl: string; cvFilename: string; lettreMotivation: string;
  expectedSalary: number; status: "EN_ATTENTE" | "EN_COURS" | "ACCEPTE" | "REFUSE";
  datePostulation: string;
}

// Listes vides au démarrage
const users: User[] = [
  {
    id: 100,
    email: "rh@grouperif.com",
    name: "Responsable RH",
    role: "RECRUITER",
    password: "admin",
  }
];
const jobOffers: JobOffer[] = [];
const applications: Application[] = [];
const cvFiles = new Map<number, Buffer>();

// ============================================================================
// API ROUTES
// ============================================================================

app.post("/api/auth/login", (req, res) => {
  const { login, password } = req.body;
  const user = users.find(u => (u.email === login || (u.role === "RECRUITER" && login === "rhadmin")) && u.password === password);
  if (!user) return res.status(401).json({ message: "Identifiants incorrects." });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

app.post("/api/candidates/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (users.some(u => u.email === email)) return res.status(400).json({ message: "Email déjà utilisé." });
  
  const newUser: User = { 
    id: users.length + 1, 
    email, 
    name: `${firstName} ${lastName}`, 
    role: "CANDIDATE", 
    password,
    ...req.body 
  };
  users.push(newUser);
  res.json({ id: newUser.id, firstName, lastName, email });
});

app.post("/api/job-offers", (req, res) => {
  const recruiterId = Number(req.header("user-id"));
  const recruiter = users.find(u => u.id === recruiterId);
  const newOffer: JobOffer = {
    id: jobOffers.length + 1,
    ...req.body,
    datePublication: new Date().toISOString().split("T")[0],
    status: "OPEN",
    recruiterName: recruiter?.name || "RH RIF"
  };
  jobOffers.push(newOffer);
  res.json(newOffer);
});

app.get("/api/job-offers/open", (req, res) => res.json(jobOffers.filter(o => o.status === "OPEN")));

app.post("/api/applications", upload.single("cv"), (req, res) => {
  const candidateId = Number(req.header("user-id"));
  const candidate = users.find(u => u.id === candidateId);
  const offer = jobOffers.find(o => o.id === Number(req.body.jobOfferId));
  
  if (!candidate || !offer || !req.file) return res.status(400).json({ message: "Données manquantes." });

  const newId = applications.length + 1;
  const newApp: Application = {
    id: newId,
    candidateId,
    candidateFullName: candidate.name,
    candidateEmail: candidate.email,
    jobOfferId: offer.id,
    jobTitle: offer.titrePoste,
    cvUrl: `/api/applications/cv/${newId}`,
    cvFilename: req.file.originalname,
    lettreMotivation: req.body.lettreMotivation || "",
    expectedSalary: Number(req.body.expectedSalary) || 0,
    status: "EN_ATTENTE",
    datePostulation: new Date().toISOString(),
  };
  applications.push(newApp);
  cvFiles.set(newId, req.file.buffer);
  res.json(newApp);
});

app.get("/api/applications/my", (req, res) => {
  const candidateId = Number(req.header("user-id"));
  res.json(applications.filter(a => a.candidateId === candidateId));
});

app.get("/api/applications/all", (req, res) => res.json(applications));

app.put("/api/applications/:id/status", (req, res) => {
  const appToUpdate = applications.find(a => a.id === Number(req.params.id));
  if (appToUpdate) appToUpdate.status = req.body.status;
  res.json(appToUpdate);
});

app.get("/api/applications/cv/:id", (req, res) => {
  const buffer = cvFiles.get(Number(req.params.id)) || Buffer.from(DEFAULT_PDF_BASE64, "base64");
  res.setHeader("Content-Type", "application/pdf");
  res.send(buffer);
});

app.get("/api/candidates/:id/full-profile", (req, res) => {
  const candidate = users.find(u => u.id === Number(req.params.id));
  candidate ? res.json(candidate) : res.status(404).send();
});

// ============================================================================
// SERVEUR VITE
// ============================================================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}
startServer();