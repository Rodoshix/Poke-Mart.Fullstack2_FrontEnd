import ReportSummaryCards from "@/components/productReports/ReportSummaryCards.jsx";
import ReportCategoryBreakdown from "@/components/productReports/ReportCategoryBreakdown.jsx";
import ReportRiskList from "@/components/productReports/ReportRiskList.jsx";
import ReportFilteredProducts from "@/components/productReports/ReportFilteredProducts.jsx";

const ReportResults = ({ summary, categoryStats = [], atRisk = [], filteredProducts = [] }) => (
  <div className="admin-product-reports__results">
    <ReportSummaryCards summary={summary} />

    <div className="admin-product-reports__grid">
      <ReportCategoryBreakdown categoryStats={categoryStats} />
      <ReportRiskList atRisk={atRisk} />
    </div>

    <ReportFilteredProducts filteredProducts={filteredProducts} />
  </div>
);

export default ReportResults;

