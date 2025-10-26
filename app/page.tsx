import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Entry } from "@/types/entry";
import data from "./firstEntries.json";

// Helper function to render cell content, handling undefined values
const renderCell = (value: any) => {
  if (value === undefined || value === null) return "-";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  return String(value);
};

// Get all possible keys from all entries
const getAllKeys = (entries: Entry[]): (keyof Entry)[] => {
  const keys = new Set<keyof Entry>();
  entries.forEach((entry) => {
    (Object.keys(entry) as (keyof Entry)[]).forEach((key) => keys.add(key));
  });
  return Array.from(keys);
};

// Format key for display
const formatKey = (key: string): string => {
  // Dictionnaire de traduction pour les clés connues
  const keyTranslations: { [key: string]: string } = {
    // Identifiants et informations de base
    id: "ID",
    option: "Option choisie",
    isStepThreeChecked: "Étape 3 validée",

    // Informations client
    clientFirstName: "Prénom",
    clientLastName: "Nom",
    clientPhone: "Téléphone",
    clientEmail: "Email",

    // Besoin d'architecte
    isArchitectNeeded: "Architecte nécessaire",

    // Permis de construire
    hasMultipleRealizationsOnSameConstructionPermit:
      "Plusieurs réalisations (même permis)",
    realizationsOnSameConstructionPermitNumber: "Nombre réalisations (permis)",

    // Déclaration préalable
    hasMultipleRealizationsOnSameDeclaration:
      "Plusieurs réalisations (même déclaration)",
    realizationsOnSameDeclarationNumber: "Nombre réalisations (déclaration)",

    // Certificat d'urbanisme
    hasMultipleRealizationsOnSameUrbanismCertificate:
      "Plusieurs réalisations (même certificat)",
    realizationsOnSameUrbanismCertificateNumber:
      "Nombre réalisations (certificat)",

    // Plan unité
    hasMultipleRealizationsOnSamePlanRequest:
      "Plusieurs réalisations (même demande plan)",
    realizationsOnSamePlanRequestNumber: "Nombre réalisations (demande plan)",

    // Services administratifs
    cerfaFilling: "Remplissage CERFA",
    pluVerification: "Vérification PLU",
    displayPanel: "Panneau d'affichage",
    expressDelivery: "Livraison express",

    // Plans RDC
    rdcPlanVerification: "Vérification plan RDC",
    rdcPlanNumber: "Numéro plan RDC",
    shouldMakeRDCPlan: "Créer plan RDC",
    rdcPlanCount: "Nombre de plans RDC",

    // Études techniques
    bbioStudy: "Étude BBIO",
    seismicStudy: "Étude sismique",

    // Plans et rendus
    doesNeedPlan: "Besoin de plans",
    neededPlans: "Plans nécessaires",
    shouldMake3dRender: "Créer rendu 3D",
    render3D: "Rendu 3D",
    renderCount3d: "Nombre de rendus 3D",
  };

  // Si la clé est dans notre dictionnaire, retourner la traduction
  if (keyTranslations[key]) {
    return keyTranslations[key];
  }

  // Sinon, appliquer le formatage par défaut
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([a-z])([0-9])/g, "$1 $2")
    .replace(/([0-9])([a-z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim();
};

export default function Home() {
  const typedData = data as Entry[];
  const allKeys = getAllKeys(typedData);

  return (
    <div className="container m-10 border border-gray-300 rounded-lg shadow-lg overflow-x-auto">
      <Table>
        <TableCaption>Liste des 24 entrées de données</TableCaption>
        <TableHeader>
          <TableRow>
            {allKeys.map((key) => (
              <TableHead
                key={String(key)}
                className="whitespace-nowrap font-semibold"
              >
                {formatKey(String(key))}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {typedData.map((entry, index) => (
            <TableRow key={entry.id || index}>
              {allKeys.map((key) => (
                <TableCell key={String(key)} className="whitespace-nowrap">
                  {renderCell(entry[key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
