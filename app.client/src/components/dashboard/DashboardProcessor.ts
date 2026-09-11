import { BankTransactionListVM } from "@/api/models/BankTransactionListVM";
import { ApprovalListVM } from "@/api/models/ApprovalListVM";
import { DebtorListVM } from "@/api/models/DebtorListVM";
import { DistributorListVM } from "@/api/models/DistributorListVM";
import { VendorListVM } from "@/api/models/VendorListVM";
import { parseISO, isAfter, isBefore, startOfDay, endOfDay, subDays, format, isValid } from "date-fns";

export interface EntityStatItem {
  id: string;
  name: string;
  amount: number;
  count: number;
  email?: string | null;
  phone?: string | null;
}

export interface DashboardMetrics {
  totalFunds: number;
  fundsInProgress: number;
  totalCredit: number;
  totalDebit: number;
  debtorReceiptsTotal: number;
  vendorPaymentsTotal: number;
  distributorDisbursementsTotal: number;
  approvalStats: {
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
  };
  entityStats: {
    debtors: { totalAmount: number; count: number; items: EntityStatItem[] };
    distributors: { totalAmount: number; count: number; items: EntityStatItem[] };
    vendors: { totalAmount: number; count: number; items: EntityStatItem[] };
  };
  statusDistribution: { name: string; value: number; amount: number; color: string }[];
  approvalTypeDistribution: { name: string; value: number; amount: number }[];
  transactionsByBank: { name: string; value: number }[];
  transactionTrends: { date: string; credit: number; debit: number }[];
  recentTransactions: BankTransactionListVM[];
  typeDistribution: { name: string; value: number }[];
  balanceTrends: { date: string; [bankName: string]: any }[];
  bankNames: string[];
  filteredApprovals: ApprovalListVM[];
  filteredTransactions: BankTransactionListVM[];
}

export class DashboardProcessor {
  /**
   * Processes the raw API data into aggregated metrics based on active filters
   */
  public static processData(
    transactions: BankTransactionListVM[],
    approvals: ApprovalListVM[],
    dateRange: { start: Date | null; end: Date | null },
    selectedBankId: string | "all",
    selectedApprovalType: string = "all",
    selectedVendorId: string = "all",
    activeFilter: string | null = null,
    debtors: DebtorListVM[] = [],
    distributors: DistributorListVM[] = [],
    vendors: VendorListVM[] = []
  ): DashboardMetrics {
    // 1. Filter Approvals (Date, Bank, ApprovalType, Vendor)
    let filteredApprovals = approvals.filter((a) => {
      if (a.createdDate) {
        const aDate = parseISO(a.createdDate);
        if (isValid(aDate)) {
          if (dateRange.start && isBefore(aDate, startOfDay(dateRange.start))) return false;
          if (dateRange.end && isAfter(aDate, endOfDay(dateRange.end))) return false;
        }
      }
      if (selectedBankId !== "all" && a.fromBankId !== selectedBankId && a.toBankId !== selectedBankId) {
        return false;
      }
      if (selectedApprovalType !== "all" && a.approvalType?.toLowerCase() !== selectedApprovalType.toLowerCase()) {
        return false;
      }
      if (selectedVendorId !== "all" && a.vendorId !== selectedVendorId) {
        return false;
      }
      return true;
    });

    // 2. Filter Transactions (Date, Bank, ApprovalType)
    let filteredTransactions = transactions.filter((t) => {
      if (t.createdDate) {
        const tDate = parseISO(t.createdDate);
        if (isValid(tDate)) {
          if (dateRange.start && isBefore(tDate, startOfDay(dateRange.start))) return false;
          if (dateRange.end && isAfter(tDate, endOfDay(dateRange.end))) return false;
        }
      }
      if (selectedBankId !== "all" && t.bankId !== selectedBankId) return false;
      return true;
    });

    if (selectedApprovalType !== "all" || selectedVendorId !== "all") {
       filteredTransactions = filteredTransactions.filter(t => {
          if (!t.approvalId) return false;
          const matchingApproval = approvals.find(a => a.approvalID === t.approvalId);
          
          let typeMatch = true;
          if (selectedApprovalType !== "all") {
              typeMatch = matchingApproval?.approvalType?.toLowerCase() === selectedApprovalType.toLowerCase();
          }
          
          let vendorMatch = true;
          if (selectedVendorId !== "all") {
              vendorMatch = matchingApproval?.vendorId === selectedVendorId;
          }
          
          return typeMatch && vendorMatch;
       });
    }

    // 3. Calculate Approval Stats (ALWAYS on full date-filtered approvals)
    const approvalStats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      completed: 0,
    };
    
    filteredApprovals.forEach((a) => {
      const statusName = (a.approvalStatusName || "").toLowerCase();
      if (statusName.includes("pending")) approvalStats.pending++;
      else if (statusName.includes("approved")) approvalStats.approved++;
      else if (statusName.includes("rejected")) approvalStats.rejected++;
      else if (statusName.includes("completed")) approvalStats.completed++;
    });

    // 4. Entity Aggregations (Debtors, Distributors, Vendors)
    const debtorMap = new Map<string, string>();
    debtors.forEach(d => { if (d.debtorId) debtorMap.set(d.debtorId, d.name || "Unknown Debtor"); });

    const distributorMap = new Map<string, string>();
    distributors.forEach(d => { if (d.distributorId) distributorMap.set(d.distributorId, d.name || "Unknown Distributor"); });

    const vendorMap = new Map<string, string>();
    vendors.forEach(v => { if (v.vendorID) vendorMap.set(v.vendorID, v.name || "Unknown Vendor"); });

    const debtorAmounts: Record<string, EntityStatItem> = {};
    const distributorAmounts: Record<string, EntityStatItem> = {};
    const vendorAmounts: Record<string, EntityStatItem> = {};

    debtors.forEach(d => {
      if (d.debtorId) {
        debtorAmounts[d.debtorId] = { id: d.debtorId, name: d.name || 'Unnamed', amount: 0, count: 0, email: d.email, phone: d.phone };
      }
    });
    distributors.forEach(d => {
      if (d.distributorId) {
        distributorAmounts[d.distributorId] = { id: d.distributorId, name: d.name || 'Unnamed', amount: 0, count: 0, email: d.email, phone: d.phone };
      }
    });
    vendors.forEach(v => {
      if (v.vendorID) {
        vendorAmounts[v.vendorID] = { id: v.vendorID, name: v.name || 'Unnamed', amount: 0, count: 0, email: v.email, phone: v.phone };
      }
    });

    let debtorReceiptsTotal = 0;
    let distributorDisbursementsTotal = 0;
    let vendorPaymentsTotal = 0;

    filteredApprovals.forEach((a) => {
      const amt = a.transactionAmount || 0;
      if (a.debtorId) {
        debtorReceiptsTotal += amt;
        if (!debtorAmounts[a.debtorId]) {
          debtorAmounts[a.debtorId] = { id: a.debtorId, name: debtorMap.get(a.debtorId) || "Debtor #" + a.debtorId, amount: 0, count: 0 };
        }
        debtorAmounts[a.debtorId].amount += amt;
        debtorAmounts[a.debtorId].count += 1;
      }
      if (a.distributorId) {
        distributorDisbursementsTotal += amt;
        if (!distributorAmounts[a.distributorId]) {
          distributorAmounts[a.distributorId] = { id: a.distributorId, name: distributorMap.get(a.distributorId) || "Distributor #" + a.distributorId, amount: 0, count: 0 };
        }
        distributorAmounts[a.distributorId].amount += amt;
        distributorAmounts[a.distributorId].count += 1;
      }
      if (a.vendorId) {
        vendorPaymentsTotal += amt;
        if (!vendorAmounts[a.vendorId]) {
          vendorAmounts[a.vendorId] = { id: a.vendorId, name: vendorMap.get(a.vendorId) || "Vendor #" + a.vendorId, amount: 0, count: 0 };
        }
        vendorAmounts[a.vendorId].amount += amt;
        vendorAmounts[a.vendorId].count += 1;
      }
    });

    const debtorList = Object.values(debtorAmounts).sort((a, b) => b.amount - a.amount);
    const distributorList = Object.values(distributorAmounts).sort((a, b) => b.amount - a.amount);
    const vendorList = Object.values(vendorAmounts).sort((a, b) => b.amount - a.amount);

    const entityStats = {
      debtors: { totalAmount: debtorReceiptsTotal, count: debtors.length, items: debtorList },
      distributors: { totalAmount: distributorDisbursementsTotal, count: distributors.length, items: distributorList },
      vendors: { totalAmount: vendorPaymentsTotal, count: vendors.length, items: vendorList }
    };

    // 5. Status & Approval Type Distributions
    const statusMap: Record<string, { count: number; amount: number }> = {
      Pending: { count: 0, amount: 0 },
      Approved: { count: 0, amount: 0 },
      Rejected: { count: 0, amount: 0 },
      Completed: { count: 0, amount: 0 },
    };

    const typeMap: Record<string, { count: number; amount: number }> = {};

    filteredApprovals.forEach((a) => {
      const statusName = (a.approvalStatusName || "Pending").trim();
      const amt = a.transactionAmount || 0;
      let key = "Pending";
      if (statusName.toLowerCase().includes("approved")) key = "Approved";
      else if (statusName.toLowerCase().includes("rejected")) key = "Rejected";
      else if (statusName.toLowerCase().includes("completed")) key = "Completed";

      if (!statusMap[key]) statusMap[key] = { count: 0, amount: 0 };
      statusMap[key].count += 1;
      statusMap[key].amount += amt;

      const typeName = a.approvalType || a.category || "General";
      if (!typeMap[typeName]) typeMap[typeName] = { count: 0, amount: 0 };
      typeMap[typeName].count += 1;
      typeMap[typeName].amount += amt;
    });

    const statusColors: Record<string, string> = {
      Pending: "#f59e0b",
      Approved: "#10b981",
      Rejected: "#ef4444",
      Completed: "#3b82f6",
    };

    const statusDistribution = Object.entries(statusMap).map(([name, data]) => ({
      name,
      value: data.count,
      amount: data.amount,
      color: statusColors[name] || "#6b7280",
    }));

    const approvalTypeDistribution = Object.entries(typeMap).map(([name, data]) => ({
      name,
      value: data.count,
      amount: data.amount,
    }));

    // 6. Calculate Aggregates (BEFORE activeFilter clears them)
    let totalCredit = 0;
    let totalDebit = 0;
    
    const bankAggregates: Record<string, number> = {};
    const typeAggregates: Record<string, number> = {};
    const trends: Record<string, { credit: number; debit: number }> = {};

    filteredTransactions.forEach((t) => {
      const amount = t.amount || 0;
      
      if (t.transactionType === "Credit" || t.deposit > 0) {
         totalCredit += amount;
      } else if (t.transactionType === "Debit" || t.withdrawal > 0) {
         totalDebit += amount;
      }

      const bankName = t.bankName || "Unknown Bank";
      bankAggregates[bankName] = (bankAggregates[bankName] || 0) + amount;

      const type = t.transactionType || "Unknown";
      typeAggregates[type] = (typeAggregates[type] || 0) + 1;

      if (t.createdDate) {
        const dayStr = format(parseISO(t.createdDate), "MMM dd");
        if (!trends[dayStr]) trends[dayStr] = { credit: 0, debit: 0 };
        
        if (t.transactionType === "Credit" || t.deposit > 0) {
           trends[dayStr].credit += amount;
        } else if (t.transactionType === "Debit" || t.withdrawal > 0) {
           trends[dayStr].debit += amount;
        }
      }
    });

    // 7. Apply Active Filter to lists for Tables
    if (activeFilter === 'pendingApprovals') {
        filteredApprovals = filteredApprovals.filter(a => (a.approvalStatusName || '').toLowerCase() === 'pending');
        filteredTransactions = [];
    } else if (activeFilter === 'approvedApprovals') {
        filteredApprovals = filteredApprovals.filter(a => (a.approvalStatusName || '').toLowerCase() === 'approved');
        filteredTransactions = [];
    } else if (activeFilter === 'rejectedApprovals') {
        filteredApprovals = filteredApprovals.filter(a => (a.approvalStatusName || '').toLowerCase() === 'rejected');
        filteredTransactions = [];
    } else if (activeFilter === 'completedTransactions') {
        filteredApprovals = [];
    }

    // If an approval filter is active, project approvals onto KPIs and charts
    let fundsInProgress = 0;
    if (filteredTransactions.length === 0 && filteredApprovals.length > 0 && activeFilter && activeFilter !== 'completedTransactions') {
        filteredApprovals.forEach(a => {
            const amount = a.transactionAmount || 0;
            totalDebit += amount; // Treat approvals as debit/expenses for visualization
            fundsInProgress += amount;

            const category = a.category || "Uncategorized";
            typeAggregates[category] = (typeAggregates[category] || 0) + 1;

            if (a.createdDate) {
                const dayStr = format(parseISO(a.createdDate), "MMM dd");
                if (!trends[dayStr]) trends[dayStr] = { credit: 0, debit: 0 };
                trends[dayStr].debit += amount;
            }
        });
    } else {
        // Standard funds in progress logic (if any)
        approvals.forEach(a => {
            if ((a.approvalStatusName || "").toLowerCase().includes("pending")) {
                fundsInProgress += (a.transactionAmount || 0);
            }
        });
    }

    // 8. Format outputs for Recharts
    const transactionsByBank = Object.entries(bankAggregates).map(([name, value]) => ({ name, value }));
    const typeDistribution = Object.entries(typeAggregates).map(([name, value]) => ({ name, value }));
    const transactionTrends = Object.entries(trends)
      .map(([date, data]) => ({ date, ...data }))
      .reverse(); 

    const recentTransactions = [...filteredTransactions]
      .sort((a, b) => new Date(b.createdDate || "").getTime() - new Date(a.createdDate || "").getTime())
      .slice(0, 50);

    // 9. Calculate Balance Trends (Requires historical chronological context)
    const balancesByDate = new Map<string, Record<string, number>>();
    const bankNamesSet = new Set<string>();
    transactions.forEach(t => { if (t.bankName) bankNamesSet.add(t.bankName); });
    const bankNames = Array.from(bankNamesSet);
    
    const sortedAllTx = [...transactions].sort((a, b) => 
        new Date(a.createdDate || "").getTime() - new Date(b.createdDate || "").getTime()
    );

    const currentBalances: Record<string, number> = {};
    bankNames.forEach(name => currentBalances[name] = 0);

    sortedAllTx.forEach(t => {
        if (!t.createdDate) return;
        const dateObj = parseISO(t.createdDate);
        if (!isValid(dateObj)) return;
        
        const dayStr = format(dateObj, "yyyy-MM-dd");
        const bankName = t.bankName || "Unknown Bank";
        
        currentBalances[bankName] = t.runningBalance || 0;
        
        balancesByDate.set(dayStr, { ...currentBalances });
    });

    const balanceTrends: { date: string; [bankName: string]: any }[] = [];
    balancesByDate.forEach((balances, dateStr) => {
        const dateObj = parseISO(dateStr);
        if (dateRange.start && isBefore(dateObj, startOfDay(dateRange.start))) return;
        if (dateRange.end && isAfter(dateObj, endOfDay(dateRange.end))) return;
        
        balanceTrends.push({
            date: format(dateObj, "MMM dd"),
            ...balances
        });
    });

    return {
      totalFunds: totalCredit - totalDebit,
      fundsInProgress,
      totalCredit,
      totalDebit,
      debtorReceiptsTotal,
      vendorPaymentsTotal,
      distributorDisbursementsTotal,
      approvalStats,
      entityStats,
      statusDistribution,
      approvalTypeDistribution,
      transactionsByBank,
      transactionTrends,
      recentTransactions,
      typeDistribution,
      balanceTrends,
      bankNames,
      filteredApprovals,
      filteredTransactions
    };
  }

  /**
   * Helper to get default date range (Last 30 days)
   */
  public static getDefaultDateRange() {
    const end = new Date();
    const start = subDays(end, 30);
    return { start, end };
  }
}

