import MaterialSheet from '../sheets/MaterialSheet';
import SheetRouter from '../sheets/SheetRouter';

export default function MaterialPortfolio(props) {
  return (
    <SheetRouter
      {...props}
      roleLabel="Material"
      SheetComponent={MaterialSheet}
    />
  );
}
