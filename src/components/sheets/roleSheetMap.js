import ArtistSheet from './ArtistSheet';
import CateringSheet from './CateringSheet';
import DesignSheet from './DesignSheet';
import FanSheet from './FanSheet';
import LocationSheet from './LocationSheet';
import LogisticsSheet from './LogisticsSheet';
import MaterialSheet from './MaterialSheet';
import OrganizerSheet from './OrganizerSheet';
import SecuritySheet from './SecuritySheet';
import TechnicianSheet from './TechnicianSheet';
import VerleiherSheet from './VerleiherSheet';

const roleSheets = {
  artist: ArtistSheet,
  'künstler': ArtistSheet,
  kuenstler: ArtistSheet,
  catering: CateringSheet,
  caterer: CateringSheet,
  design: DesignSheet,
  deko: DesignSheet,
  'deko/stage': DesignSheet,
  fan: FanSheet,
  location: LocationSheet,
  halle: LocationSheet,
  venue: LocationSheet,
  logistik: LogisticsSheet,
  logistics: LogisticsSheet,
  material: MaterialSheet,
  veranstalter: OrganizerSheet,
  organizer: OrganizerSheet,
  security: SecuritySheet,
  techniker: TechnicianSheet,
  technician: TechnicianSheet,
  verleiher: VerleiherSheet,
  rental: VerleiherSheet,
};

export function getRoleSheet(role) {
  const normalizedRole = String(role || '').trim().toLowerCase();
  return roleSheets[normalizedRole] || null;
}
