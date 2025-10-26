"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import dynamic from "next/dynamic";
import { useState } from "react";
import data from "./firstEntries.json";

// Import react-pdf components dynamically to avoid SSR issues
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

// Configure PDF.js worker only on client side
if (typeof window !== "undefined") {
  import("react-pdf").then((mod) => {
    mod.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  });
}

// Helper function to render cell content, handling undefined values
const renderCell = (value: any) => {
  if (value === undefined || value === null) return "-";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (JSON.stringify(value).includes("devis-001"))
    return "Cliquer pour voir le devis";
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

    // PDF
    pdfUrl: "Devis PDF",
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
  const [numPages, setNumPages] = useState<number>();

  return (
    <div className="container m-10 border border-gray-300 rounded-lg shadow-lg overflow-x-auto">
      <Table>
        <TableCaption>Liste des entrées de données</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              key={"numero"}
              className="whitespace-nowrap font-semibold"
            >
              №
            </TableHead>
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
            <Dialog key={entry.id || index}>
              <DialogTrigger asChild>
                <TableRow>
                  <TableCell className="whitespace-nowrap">
                    {index + 1}
                  </TableCell>
                  {allKeys.map((key) => (
                    <TableCell key={String(key)} className="whitespace-nowrap">
                      {renderCell(entry[key])}
                    </TableCell>
                  ))}
                </TableRow>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
                {typeof window !== "undefined" && (
                  <Document
                    file={entry.pdfUrl}
                    onLoadSuccess={({ numPages }) => {
                      setNumPages(numPages);
                      console.log("PDF chargé avec succès");
                    }}
                    onLoadError={(error) => {
                      console.error("Erreur de chargement du PDF:", error);
                    }}
                  >
                    <Page pageNumber={1} width={750} />
                  </Document>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
