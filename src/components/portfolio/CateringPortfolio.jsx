import CateringSheet from '../sheets/CateringSheet';
import PortfolioRouter from '../portfolio/PortfolioRouter';

export default function CateringPortfolio(props) {
  return (
    <PortfolioRouter
      {...props}
      roleLabel="Catering"
      SheetComponent={CateringSheet}
    />
  );
}
