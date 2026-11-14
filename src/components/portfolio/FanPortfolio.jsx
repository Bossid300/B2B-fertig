import FanSheet from '../sheets/FanSheet';
import SheetRouter from '../sheets/SheetRouter';

export default function FanPortfolio(props) {
  return (
    <SheetRouter
      {...props}
      roleLabel="Fan"
      SheetComponent={FanSheet}
    />
  );
}
