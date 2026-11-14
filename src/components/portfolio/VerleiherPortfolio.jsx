import VerleiherSheet from '../sheets/VerleiherSheet';
import SheetRouter from '../sheets/SheetRouter';

export default function VerleiherPortfolio(props) {
  return (
    <SheetRouter
      {...props}
      roleLabel="Verleiher"
      SheetComponent={VerleiherSheet}
    />
  );
}
