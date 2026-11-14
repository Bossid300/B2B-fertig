import LogisticsSheet from '../sheets/LogisticsSheet';
import SheetRouter from '../sheets/SheetRouter';

export default function LogisticsPortfolio(props) {
  return (
    <SheetRouter
      {...props}
      roleLabel="Logistik"
      SheetComponent={LogisticsSheet}
    />
  );
}
