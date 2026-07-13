// ─── API response shapes ────────────────────────────────────────────────────

export type CoordinateVM = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  word?: string | null;
};

export type DocumentPageDetail = {
  imageBlobUrl?: string | null;
  pageNum?: number;
  documentUrlId?: string | null;
  documentUrlTextId?: string | null;
  isStared?: boolean;
  coordinates?: CoordinateVM[] | null;
};

export type TagVM = {
  tagId?: string | null;
  name?: string | null;
};

export type DocumentFileViewItem = {
  documentUrlID?: string | null;
  name?: string | null;
  description?: string | null;
  documentType?: string | null;
  documentTypeID?: string | null;
  extension?: string | null;
  documentDate?: string | null;
  tags?: TagVM[] | null;
  documentPageDetailList?: DocumentPageDetail[] | null;
};

// ─── Filter state ────────────────────────────────────────────────────────────

export type FileSystemFilters = {
  startDate: string;   // yyyy-MM-dd
  endDate: string;     // yyyy-MM-dd
  documentType: string;
  searchText: string;
  isStared: boolean;
  tags: string[];      // tag IDs
};

// ─── Document type options per category ──────────────────────────────────────
// Mirrors the C# switch in Index.cshtml / DocumentUrlController

export const DOCUMENT_TYPE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  Proposal: [
    { value: "Document",     label: "Proposal Documents" },
    { value: "OtherDocument",label: "Other Documents" },
  ],
  Tender: [
    { value: "Document",       label: "Tender Document" },
    { value: "TechnicalBid",   label: "Technical Bid" },
    { value: "FinancialBid",   label: "Financial Bid" },
    { value: "Proposal",       label: "Proposal Documents" },
    { value: "OtherDocument",  label: "Other Documents" },
  ],
  EAuction: [
    { value: "Document",       label: "EAuction Document" },
    { value: "TechnicalBid",   label: "Technical Bid" },
    { value: "FinancialBid",   label: "Financial Bid" },
    { value: "Proposal",       label: "Proposal Documents" },
    { value: "OtherDocument",  label: "Other Documents" },
  ],
  Contract: [
    { value: "LetterSent",            label: "Letter Sent" },
    { value: "LetterReceived",        label: "Letter Received" },
    { value: "NocCertification",      label: "Noc & Certifications" },
    { value: "Document",              label: "Contract Document" },
    { value: "TenderEAuctionProposal",label: "Tender/Proposal Documents" },
    { value: "TechnicalBid",          label: "Technical Bid" },
    { value: "FinancialBid",          label: "Financial Bid" },
    { value: "LegalDocument",         label: "Legal Document" },
    { value: "OtherDocument",         label: "Other Documents" },
  ],
  Project: [
    { value: "Document",       label: "Project Document" },
    { value: "Technical",      label: "Technical Document" },
    { value: "Financial",      label: "Financial Document" },
    { value: "Legal",          label: "Legal Document" },
    { value: "OtherDocument",  label: "Other Documents" },
  ],
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Convert a Date → "yyyy-MM-dd" (for <input type="date">) */
export function toInputDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Convert "yyyy-MM-dd" → "MM/dd/yyyy" (for API) */
export function toApiDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${m}/${d}/${y}`;
}

/** Format a date string for display */
export function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}

// ─── Default filter factory ───────────────────────────────────────────────────

export function defaultFilters(): FileSystemFilters {
  const today = new Date();
  return {
    startDate: "2000-01-01",
    endDate: toInputDate(today),
    documentType: "",
    searchText: "",
    isStared: false,
    tags: [],
  };
}
