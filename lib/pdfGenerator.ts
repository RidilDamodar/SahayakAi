import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { UserProfile } from "./auth-context";
import { Scheme, getTopMatchedSchemes, MOCK_SCHEMES } from "./api";

export const generateActionPlanPDF = (userProfile: UserProfile | any, currentScheme: Scheme) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(159, 60, 0); // Primary color
  doc.text("Sahayak AI - Business Action Plan", 14, 20);

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.text("A comprehensive financial overview and scheme recommendation report.", 14, 28);

  // Business Profile Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("1. Business Profile Details", 14, 40);
  
  const profileData = [
    ["Entity/Owner Name", userProfile?.name || "N/A"],
    ["Business Sector", userProfile?.category || "N/A"],
    ["Enterprise Type", userProfile?.businessType || "N/A"],
    ["Location (State)", userProfile?.state || "N/A"],
    ["City / District", userProfile?.city || userProfile?.district || "N/A"],
    ["Funding Required", userProfile?.loanAmountNeeded || "N/A"],
    ["Social Category", userProfile?.socialCategory || "N/A"],
    ["Gender", userProfile?.gender || "N/A"],
  ];
  
  autoTable(doc, {
    startY: 45,
    head: [["Detail", "Value"]],
    body: profileData,
    theme: "grid",
    headStyles: { fillColor: [159, 60, 0], textColor: [255, 255, 255] },
    styles: { fontSize: 10, cellPadding: 3 },
  });

  // Top 3 Schemes
  const topSchemes = getTopMatchedSchemes(MOCK_SCHEMES, userProfile || {}).slice(0, 3);
  doc.setFontSize(14);
  const startYSchemes = (doc as any).lastAutoTable.finalY + 15;
  doc.text("2. Top 3 Matched Govt. Schemes", 14, startYSchemes);
  
  const schemeData = topSchemes.map((s, i) => [
    `#${i + 1} ${s.name}`,
    `${s.matchScore}%`,
    s.maxLoan,
    s.maxSubsidy
  ]);

  autoTable(doc, {
    startY: startYSchemes + 5,
    head: [["Scheme Name", "Match Score", "Max Loan", "Max Subsidy"]],
    body: schemeData,
    theme: "striped",
    headStyles: { fillColor: [140, 75, 0], textColor: [255, 255, 255] },
    styles: { fontSize: 10, cellPadding: 3 },
  });

  // Checklist for Current Scheme
  doc.setFontSize(14);
  const startYDocs = (doc as any).lastAutoTable.finalY + 15;
  doc.text(`3. Documents Required for: ${currentScheme.name}`, 14, startYDocs);
  
  const docData = currentScheme.requiredDocuments.map((docItem, idx) => [
    `[  ]`, docItem
  ]);

  autoTable(doc, {
    startY: startYDocs + 5,
    head: [["Check", "Document Name"]],
    body: docData,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 0: { cellWidth: 20 } }
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated securely by Sahayak AI on ${new Date().toLocaleDateString()}`, 14, doc.internal.pageSize.getHeight() - 10);

  // Save the PDF
  doc.save(`Sahayak_Action_Plan_${userProfile?.name?.replace(/\s/g, "_") || "User"}.pdf`);
};
