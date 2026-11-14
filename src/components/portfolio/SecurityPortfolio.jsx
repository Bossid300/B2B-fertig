import SecuritySheet from '../sheets/SecuritySheet';
import SheetRouter from '../sheets/SheetRouter';

export default function SecurityPortfolio(props) {
  return (
    <SheetRouter
      {...props}
      roleLabel="Security"
      SheetComponent={SecuritySheet}
    />
  );
}
