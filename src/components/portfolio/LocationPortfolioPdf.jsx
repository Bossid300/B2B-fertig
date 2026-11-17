import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink
} from '@react-pdf/renderer';

const POWER_SUPPLY_LABELS = {
  'cee 63a': 'CEE 63A (Großbühne)',
  'cee 32a': 'CEE 32A (Mittelbühne / Club)',
  'cee 16a': 'CEE 16A (Kleine Bühne)',
  schuko: '230V Schuko (Standard)'
};

const getPowerSupplyLabel = (value) => {
  const normalizedValue = String(value || '').trim().toLowerCase();
  return POWER_SUPPLY_LABELS[normalizedValue] || value || 'Keine Angabe';
};

const getSafeImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${url}`;
  }
  return url;
};

const styles = StyleSheet.create({
  pageDark: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    fontFamily: 'Helvetica',
    padding: 0
  },
  pageLight: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    color: '#111111',
    fontFamily: 'Helvetica',
    padding: 0
  },
  // Cover Spine (Links)
  coverSpine: {
    width: '34%',
    backgroundColor: '#080808',
    borderRightWidth: 1,
    borderRightColor: '#27272a',
    padding: 28,
    justifyContent: 'space-between'
  },
  coverHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    letterSpacing: 2,
    color: '#a1a1aa',
    textTransform: 'uppercase'
  },
  coverTypoBlock: {
    marginVertical: 14
  },
  coverTitleBig: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -1,
    color: '#ffffff',
    textTransform: 'uppercase',
    lineHeight: 0.95
  },
  coverSubtitle: {
    fontSize: 12,
    letterSpacing: 6,
    color: '#fbbf24',
    textTransform: 'uppercase',
    marginTop: 6
  },
  // Architektonische Raum-Linien (statt Soundwave)
  blueprintRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 32,
    gap: 4,
    marginTop: 18
  },
  coverThumbRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16
  },
  coverThumb: {
    width: 58,
    height: 58,
    objectFit: 'cover',
    borderWidth: 1,
    borderColor: '#3f3f46'
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 10
  },
  coverGenre: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#ffffff'
  },
  coverMeta: {
    fontSize: 8,
    color: '#a1a1aa',
    marginTop: 3
  },
  // Cover Hero (Rechts)
  coverHero: {
    width: '66%',
    position: 'relative',
    backgroundColor: '#18181b',
    justifyContent: 'flex-end'
  },
  coverHeroImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  coverOverlay: {
    backgroundColor: 'rgba(0,0,0,0.72)',
    padding: 32
  },
  coverCategory: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
    color: '#fbbf24',
    textTransform: 'uppercase',
    marginBottom: 6
  },
  coverVenueName: {
    fontSize: 34,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: -0.5
  },
  coverAddress: {
    fontSize: 10,
    color: '#e4e4e7',
    marginTop: 6
  },
  coverKpiBar: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3f3f46'
  },
  coverKpiItem: {
    fontSize: 8.5,
    color: '#fbbf24',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1
  },

  // Standard 50/50 Doppelseite
  halfLeftLight: {
    width: '50%',
    padding: 32,
    borderRightWidth: 1,
    borderRightColor: '#e4e4e7',
    justifyContent: 'space-between'
  },
  halfRightLight: {
    width: '50%',
    padding: 32,
    backgroundColor: '#fafafa',
    justifyContent: 'space-between'
  },
  halfLeftDark: {
    width: '50%',
    padding: 32,
    backgroundColor: '#0d0d0d',
    borderRightWidth: 1,
    borderRightColor: '#27272a',
    justifyContent: 'space-between'
  },
  halfRightDark: {
    width: '50%',
    padding: 32,
    backgroundColor: '#050505',
    justifyContent: 'space-between'
  },

  // Typografie & Sektionen
  sectionHeaderLight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 6,
    marginBottom: 14
  },
  sectionHeaderDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
    paddingBottom: 6,
    marginBottom: 14
  },
  h2Light: {
    fontSize: 21,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: '#000000'
  },
  h2Dark: {
    fontSize: 21,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: '#ffffff'
  },
  tagLight: {
    fontSize: 8,
    color: '#71717a',
    letterSpacing: 1.5
  },
  tagDark: {
    fontSize: 8,
    color: '#fbbf24',
    letterSpacing: 1.5
  },
  bodyText: {
    fontSize: 8.8,
    lineHeight: 1.48,
    color: '#27272a',
    marginBottom: 10
  },
  capGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6
  },
  capBox: {
    width: '31%',
    backgroundColor: '#f4f4f5',
    padding: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#000000'
  },
  capLabel: {
    fontSize: 6.5,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#71717a'
  },
  capValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#000000',
    marginTop: 2
  },
  wideRoomImg: {
    width: '100%',
    height: 185,
    objectFit: 'cover',
    marginBottom: 16
  },
  tocRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d8',
    paddingVertical: 6
  },
  tocTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  tocPage: {
    fontSize: 8.5,
    color: '#71717a'
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  gridCellImg: {
    width: '48.5%',
    height: 115,
    objectFit: 'cover'
  },
  factLabelLight: {
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#71717a'
  },
  factValueLight: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
    marginTop: 2
  },
  footerLight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
    paddingTop: 8,
    fontSize: 7.5,
    color: '#a1a1aa'
  },
  footerDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 8,
    fontSize: 7.5,
    color: '#71717a'
  }
});

export function LocationPortfolioDocument({ profile, references = [] }) {
  const venueName = profile?.Klarname || profile?.name || 'Event Location';
  const heroImage = getSafeImageUrl(profile?.slide1_url || profile?.room1_img || profile?.gallery_slot1_url);
  const roomImage = getSafeImageUrl(profile?.room1_img || profile?.gallery_slot1_url || profile?.slide1_url);
  const techPlanIsImage =
    profile?.room1_tech_plan && profile.room1_tech_plan.includes('/api/media.php?preview=');
  const techPlanImage = techPlanIsImage ? getSafeImageUrl(profile.room1_tech_plan) : null;

  const galleryImages = [1, 2, 3, 4]
    .map((num) => ({
      url: getSafeImageUrl(profile?.[`gallery_slot${num}_url`]),
      title: profile?.[`gallery_slot${num}_title`] || `Impression 0${num}`
    }))
    .filter((item) => Boolean(item.url));

  const powerSupply = getPowerSupplyLabel(profile?.room1_power_supply);
  const barHeights = [14, 28, 20, 32, 16, 26, 30, 18, 24, 12, 28, 22];

  return (
    <Document title={`${venueName} - Venue Portfolio`}>
      {/* =========================================================
          SEITE 1: EDITORIAL COVER (A4 Querformat)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        <View style={styles.coverSpine}>
          <View style={styles.coverHeaderRow}>
            <Text>GIGSDA // {profile?.id || 'VENUE'}</Text>
            <Text>VENUE EXPOSÉ</Text>
          </View>

          <View style={styles.coverTypoBlock}>
            <Text style={styles.coverTitleBig}>VENUE</Text>
            <Text style={styles.coverSubtitle}>PORTFOLIO</Text>

            {/* Architektonisches Balken-Raster */}
            <View style={styles.blueprintRow}>
              {barHeights.map((h, i) => (
                <View
                  key={i}
                  style={{
                    width: 3,
                    height: h,
                    backgroundColor: '#fbbf24'
                  }}
                />
              ))}
            </View>

            {/* Mini-Thumbnails */}
            {galleryImages.length > 0 && (
              <View style={styles.coverThumbRow}>
                {galleryImages.slice(0, 2).map((img, idx) => (
                  <Image key={idx} src={img.url} style={styles.coverThumb} />
                ))}
              </View>
            )}
          </View>

          <View style={styles.coverFooter}>
            <Text style={styles.coverGenre}>
              {profile?.city || 'Event & Live Location'}
            </Text>
            <Text style={styles.coverMeta}>
              {profile?.room1_area ? `${profile.room1_area} m² • ` : ''}
              {profile?.room1_steh ? `Bis zu ${profile.room1_steh} Pers.` : 'Flexible Kapazität'}
            </Text>
          </View>
        </View>

        <View style={styles.coverHero}>
          {heroImage && <Image src={heroImage} style={styles.coverHeroImg} />}
          <View style={styles.coverOverlay}>
            <Text style={styles.coverCategory}>
              {profile?.category || 'Event Location / Club / Veranstaltungshalle'}
            </Text>
            <Text style={styles.coverVenueName}>{venueName}</Text>
            <Text style={styles.coverAddress}>
              {[profile?.street, `${profile?.plz || ''} ${profile?.city || ''}`.trim()]
                .filter(Boolean)
                .join(' • ')}
            </Text>

            <View style={styles.coverKpiBar}>
              {profile?.room1_area && (
                <Text style={styles.coverKpiItem}>FLÄCHE: {profile.room1_area} M²</Text>
              )}
              {profile?.room1_steh && (
                <Text style={styles.coverKpiItem}>MAX. KAPAZITÄT: {profile.room1_steh} PAX</Text>
              )}
              {profile?.room1_curfew_time && (
                <Text style={styles.coverKpiItem}>SPERRSTUNDE: {profile.room1_curfew_time} UHR</Text>
              )}
            </View>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 2: VENUE PORTRAIT & KAPAZITÄTEN (Heller Kontrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: Portrait & Bestuhlungsvarianten */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Venue Portrait</Text>
              <Text style={styles.tagLight}>01 // OVERVIEW</Text>
            </View>

            <Text style={styles.bodyText}>
              {profile?.description ||
                'Vielseitige Veranstaltungs-Location für Konzerte, Club-Nächte, Galas, Workshops und exklusive Eventformate.'}
            </Text>

            <Text
              style={{
                fontSize: 8,
                fontFamily: 'Helvetica-Bold',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginTop: 6,
                marginBottom: 4
              }}
            >
              Fläche & Kapazitäten nach Bestuhlung
            </Text>

            <View style={styles.capGrid}>
              <View style={styles.capBox}>
                <Text style={styles.capLabel}>Gesamtfläche</Text>
                <Text style={styles.capValue}>
                  {profile?.room1_area ? `${profile.room1_area} m²` : '-'}
                </Text>
              </View>
              <View style={styles.capBox}>
                <Text style={styles.capLabel}>Stehempfang</Text>
                <Text style={styles.capValue}>
                  {profile?.room1_steh ? `${profile.room1_steh} Pers.` : '-'}
                </Text>
              </View>
              <View style={styles.capBox}>
                <Text style={styles.capLabel}>Bankett / Gala</Text>
                <Text style={styles.capValue}>
                  {profile?.room1_bankett ? `${profile.room1_bankett} Pers.` : '-'}
                </Text>
              </View>
              <View style={styles.capBox}>
                <Text style={styles.capLabel}>Theater-Reihen</Text>
                <Text style={styles.capValue}>
                  {profile?.room1_theater ? `${profile.room1_theater} Pers.` : '-'}
                </Text>
              </View>
              <View style={styles.capBox}>
                <Text style={styles.capLabel}>U-Form</Text>
                <Text style={styles.capValue}>
                  {profile?.room1_uform ? `${profile.room1_uform} Pers.` : '-'}
                </Text>
              </View>
              <View style={styles.capBox}>
                <Text style={styles.capLabel}>Sperrstunde</Text>
                <Text style={styles.capValue}>
                  {profile?.room1_curfew_time ? `${profile.room1_curfew_time} Uhr` : '-'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>{venueName}</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>

        {/* Rechts: Raumfoto & Inhaltsverzeichnis */}
        <View style={styles.halfRightLight}>
          <View>
            {roomImage && <Image src={roomImage} style={styles.wideRoomImg} />}

            <View style={styles.sectionHeaderLight}>
              <Text style={[styles.h2Light, { fontSize: 18 }]}>Contents</Text>
              <Text style={styles.tagLight}>INDEX</Text>
            </View>

            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>01. Venue Portrait & Kapazitäten</Text>
              <Text style={styles.tocPage}>P. 02</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>02. Inhouse-Technik & Infrastruktur</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>03. Impressionen & Referenzen</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>04. Mietkonditionen, Anfahrt & Kontakt</Text>
              <Text style={styles.tocPage}>P. 04</Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>VENUE & EVENT PORTFOLIO</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 3: TECHNIK, INFRASTRUKTUR & GALERIE (Dark Contrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        {/* Links: Technik & Ausstattung */}
        <View style={styles.halfLeftDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Tech & Stage</Text>
              <Text style={styles.tagDark}>02 // INFRASTRUCTURE</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
              <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#27272a', paddingBottom: 6 }}>
                <Text style={{ fontSize: 7, color: '#a1a1aa', letterSpacing: 1 }}>STROMVERSORGUNG</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {powerSupply}
                </Text>
              </View>
              <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#27272a', paddingBottom: 6 }}>
                <Text style={{ fontSize: 7, color: '#a1a1aa', letterSpacing: 1 }}>ÖFFNUNGSZEITEN</Text>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.room1_opening_hours || 'Nach Vereinbarung'}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 4 }}>
              INHOUSE-TECHNIK & AUSSTATTUNG
            </Text>
            <Text style={{ fontSize: 8.5, color: '#d4d4d8', lineHeight: 1.48, marginBottom: 12 }}>
              {profile?.room1_equipment ||
                'Flexible technische Infrastruktur für Live-Bands, DJs, Sprachbeschallung und Lichtinszenierungen.'}
            </Text>

            {techPlanImage && (
              <View>
                <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 4 }}>
                  BÜHNEN- & RAUMPLAN
                </Text>
                <Image
                  src={techPlanImage}
                  style={{ width: '100%', height: 110, objectFit: 'contain', backgroundColor: '#18181b' }}
                />
              </View>
            )}
          </View>

          <View style={styles.footerDark}>
            <Text>TECHNICAL SPECIFICATIONS</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>

        {/* Rechts: Visual Gallery & GIGSDA Referenzen */}
        <View style={styles.halfRightDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Atmosphere</Text>
              <Text style={styles.tagDark}>03 // GALLERY & EVENTS</Text>
            </View>

            {galleryImages.length > 0 && (
              <View style={styles.grid2x2}>
                {galleryImages.slice(0, 4).map((img, i) => (
                  <Image key={i} src={img.url} style={styles.gridCellImg} />
                ))}
              </View>
            )}

            <Text style={{ fontSize: 8, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 6 }}>
              VERANSTALTUNGEN & GIGSDA REFERENZEN
            </Text>
            {references.length > 0 ? (
              references.slice(0, 4).map((ref) => (
                <View
                  key={ref.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: '#27272a',
                    paddingVertical: 4
                  }}
                >
                  <Text style={{ fontSize: 8.5, color: '#ffffff', fontFamily: 'Helvetica-Bold' }}>
                    {ref.title}
                  </Text>
                  <Text style={{ fontSize: 8, color: '#a1a1aa' }}>{ref.date}</Text>
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 8.5, color: '#a1a1aa', lineHeight: 1.45 }}>
                Geeignet für Konzerte, Club-Events, Hochzeiten, Firmenfeiern, Tanzkurse und Vereinsveranstaltungen.
              </Text>
            )}
          </View>

          <View style={styles.footerDark}>
            <Text>IMPRESSIONS & CREDITS</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 4: KONDITIONEN, LOGISTIK & LOCATION CONTACT
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: Mietkonditionen & Anfahrt */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Booking & Access</Text>
              <Text style={styles.tagLight}>04 // LOGISTICS</Text>
            </View>

            <View style={{ marginBottom: 14 }}>
              <Text style={styles.factLabelLight}>Preise, Konditionen & Mietbedingungen</Text>
              <Text style={[styles.bodyText, { marginTop: 3 }]}>
                {profile?.room1_konditionen || 'Individuelle Mietpakete und Konditionen auf Anfrage.'}
              </Text>
            </View>

            <View style={{ marginBottom: 14 }}>
              <Text style={styles.factLabelLight}>Parken & ÖPNV-Anbindung</Text>
              <Text style={[styles.bodyText, { marginTop: 3 }]}>
                {profile?.room1_opnv || 'Gute Erreichbarkeit und Parkmöglichkeiten direkt vor Ort.'}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: '#f4f4f5',
                borderLeftWidth: 3,
                borderLeftColor: '#000000',
                padding: 10
              }}
            >
              <Text style={styles.factLabelLight}>Veranstaltungsadresse</Text>
              <Text style={[styles.factValueLight, { marginTop: 3 }]}>{venueName}</Text>
              <Text style={{ fontSize: 9, color: '#27272a', marginTop: 2 }}>
                {profile?.street || ''}
              </Text>
              <Text style={{ fontSize: 9, color: '#27272a' }}>
                {`${profile?.plz || ''} ${profile?.city || ''}`.trim()}
              </Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>CONDITIONS & LOGISTICS</Text>
            <Text>PAGE 04</Text>
          </View>
        </View>

        {/* Rechts: Location Contact (Dunkel abgesetzt) */}
        <View style={styles.halfRightDark}>
          <View>
            <Text style={{ fontSize: 8, color: '#fbbf24', letterSpacing: 2, marginBottom: 4 }}>
              VENUE MANAGEMENT & BOOKING
            </Text>
            <Text style={[styles.h2Dark, { fontSize: 24, marginBottom: 12 }]}>
              Location Contact
            </Text>
            <Text style={{ fontSize: 9, color: '#a1a1aa', lineHeight: 1.5, marginBottom: 20 }}>
              Für Terminanfragen, Besichtigungen, technische Rückfragen und Buchungskonditionen kontaktieren Sie bitte direkt:
            </Text>

            <View style={{ borderTopWidth: 1, borderTopColor: '#27272a', paddingTop: 12 }}>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>E-MAIL</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.email || '-'}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>TELEFON</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.phone || '-'}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>WEBSEITE / GIGSDA</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#fbbf24', marginTop: 2 }}>
                  {profile?.website || 'https://www.gigsda.com'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footerDark}>
            <Text>POWERED BY GIGSDA.COM</Text>
            <Text>{new Date().getFullYear()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export function DownloadLocationPdfButton({ profile, references }) {
  const venueName = profile?.Klarname || profile?.name || 'Location';
  const safeName = venueName
    .replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '_')
    .replace(/_+/g, '_');

  return (
    <PDFDownloadLink
      document={<LocationPortfolioDocument profile={profile} references={references} />}
      fileName={`${safeName}_Venue_Portfolio.pdf`}
      className="px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition"
    >
      {({ loading }) => (loading ? 'Generiere PDF...' : 'Location-PDF herunterladen')}
    </PDFDownloadLink>
  );
}