import { prisma } from "./prisma";
import { SYNTHETIC_PARCELS } from "./demo-data";
import { auditParcel, AuditResult, ParcelRecord } from "./detection-engine";
import { UserSession } from "./auth";

export interface Deed {
  id: string;
  deedNumber: string;
  sellerName: string;
  buyerName: string;
  transferredArea: number;
  deedDate: string | Date;
  registrationOffice: string;
  deedType: string;
  serialOrder?: number;
  isVerified?: boolean;
  dagNumber?: string;
  surveyType?: string;
}

export interface Mutation {
  id: string;
  caseNumber: string;
  applicantName: string;
  mutatedArea: number;
  khatianNumber: string;
  approvalDate: string | Date;
  officerName: string;
  status: string;
  dagNumber?: string;
}

export interface AnomalyItem {
  id?: string;
  anomalyType?: string;
  severity: string;
  title: string;
  description: string;
  evidence?: string;
}

export interface Parcel extends ParcelRecord {
  dagNumber?: string;
  surveyType?: string;
  ownershipShares?: string;
  provenance?: string;
  deeds: Deed[];
  mutations: Mutation[];
  anomalies?: AnomalyItem[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Retrieves all parcels from Neon DB if available, falling back to rich synthetic dataset
 */
export async function getAllParcels(): Promise<Parcel[]> {
  try {
    const rawParcels = await prisma.parcel.findMany({
      include: {
        deeds: {
          orderBy: { serialOrder: "asc" },
        },
        mutations: true,
        anomalies: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (rawParcels && rawParcels.length > 0) {
      return rawParcels as unknown as Parcel[];
    }
  } catch (error) {
    console.warn("Database query skipped, using deterministic synthetic dataset:", (error as Error).message);
  }

  return SYNTHETIC_PARCELS as unknown as Parcel[];
}

/**
 * Retrieves a single parcel by ID or Parcel Number
 */
export async function getParcelById(idOrNumber: string): Promise<Parcel | null> {
  const cleanId = decodeURIComponent(idOrNumber).trim().toLowerCase();
  const all = await getAllParcels();

  return (
    all.find(
      (p) =>
        p.id.toLowerCase() === cleanId ||
        p.parcelNumber.toLowerCase() === cleanId ||
        (p.dagNumber && p.dagNumber.toLowerCase() === cleanId)
    ) || null
  );
}

/**
 * Filter parcels accessible by the current user session
 */
export async function getAccessibleParcels(session: UserSession | null): Promise<Parcel[]> {
  const all = await getAllParcels();

  if (!session) {
    // Public guests can see all demo parcels in verification directory
    return all;
  }

  if (session.role === "ADMIN" || session.role === "OFFICIAL" || session.permittedPlots === "ALL") {
    return all;
  }

  // Citizens only see their permitted plots
  const permitted = session.permittedPlots.split(",").map((p) => p.trim().toUpperCase());
  return all.filter((p) => permitted.includes(p.parcelNumber.toUpperCase()));
}

/**
 * Audits a parcel with the P3 fraud detection engine
 */
export function getParcelAudit(parcel: Parcel): AuditResult {
  return auditParcel(parcel);
}
