import DesignSheet from '../sheets/DesignSheet';
import SheetRouter from '../sheets/SheetRouter';

export default function DesignPortfolio(props) {
  return (
    <SheetRouter
      {...props}
      roleLabel="Design & Deko"
      SheetComponent={DesignSheet}
    />
  );
}
