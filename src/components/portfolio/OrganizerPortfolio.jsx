import OrganizerSheet from '../sheets/OrganizerSheet';
import SheetRouter from '../sheets/SheetRouter';

export default function OrganizerPortfolio(props) {
  return (
    <SheetRouter
      {...props}
      roleLabel="Veranstalter"
      SheetComponent={OrganizerSheet}
    />
  );
}
