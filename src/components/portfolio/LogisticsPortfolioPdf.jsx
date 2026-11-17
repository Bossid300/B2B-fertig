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

const getSafeImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('/')) {
    return typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (typeof window !== 'undefined' && !url.startsWith(window.location.origin)) {
      return `${window.location.origin}/api/pdf_image.php?url=${encodeURIComponent(url)}`;
    }
    return url;
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
    fontSize: 32,
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
  // Logistik-Balken Grafik
  logiRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 34,
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
  coverName: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: -0.5
  },
  coverTeaser: {
    fontSize: 10,
    color: '#e4e4e7',
    lineHeight: 1.45,
    marginTop: 8,
    maxWidth: 420
  },
  coverKpiBar: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3f3f46'
  },
  coverKpiItem: {
    fontSize: 8,
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
  profileTopRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14
  },
  portraitImg: {
    width: 112,
    height: 140,
    objectFit: 'cover',
    backgroundColor: '#e4e4e7'
  },
  factsCol: {
    flex: 1,
    justifyContent: 'space-between'
  },
  factItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingBottom: 4,
    marginBottom: 5
  },
  factLabel: {
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#71717a'
  },
  factValue: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
    marginTop: 1
  },
  bodyText: {
    fontSize: 8.8,
    lineHeight: 1.48,
    color: '#27272a',
    marginBottom: 8
  },
  wideImg: {
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
  serviceCard: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#3f3f46',
    padding: 8,
    marginBottom: 6
  },
  cardTitle: {
    fontSize: 7.5,
    color: '#fbbf24',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2
  },
  cardDetail: {
    fontSize: 8.5,
    color: '#ffffff',
    lineHeight: 1.35
  },
  rateBox: {
    width: '47%',
    backgroundColor: '#f4f4f5',
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#000000'
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

export function LogistikPortfolioDocument({ profile, references = [] }) {
  const companyName = profile?.Klarname || profile?.name || 'STAGEFLOW EVENT LOGISTICS';
  const heroImage = getSafeImageUrl(profile?.slide1_url || profile?.gallery_slot1_url);
  
  const galleryImages = [1, 2, 3, 4]
    .map((num) => ({
      url: getSafeImageUrl(profile?.[`gallery_slot${num}_url`]),
      title: profile?.[`gallery_slot${num}_title`] || `Logistics 0${num}`
    }))
    .filter((item) => Boolean(item.url));

  const barHeights = [25, 36, 18, 40, 28, 32, 14, 35, 22, 38, 16, 30];

  return (
    <Document title={`${companyName} - Logistics Portfolio`}>
      {/* =========================================================
          SEITE 1: EDITORIAL COVER (A4 Querformat)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        <View style={styles.coverSpine}>
          <View style={styles.coverHeaderRow}>
            <Text>GIGSDA // {profile?.id || 'LOGI'}</Text>
            <Text>LOGISTICS EPK</Text>
          </View>

          <View style={styles.coverTypoBlock}>
            <Text style={styles.coverTitleBig}>EVENT</Text>
            <Text style={styles.coverSubtitle}>LOGISTICS</Text>

            {/* Logistik-Balken Raster */}
            <View style={styles.logiRow}>
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
              {profile?.genre || 'Tour- & Event-Logistik'}
            </Text>
            <Text style={styles.coverMeta}>
              {profile?.city ? `${profile.city} • ` : ''}
              {profile?.logistics_fleet_kpi || '6 Fahrzeuge'}
            </Text>
          </View>
        </View>

        <View style={styles.coverHero}>
          {heroImage && <Image src={heroImage} style={styles.coverHeroImg} />}
          <View style={styles.coverOverlay}>
            <Text style={styles.coverCategory}>
              {profile?.category || 'Produktionslogistik & Stagehands'}
            </Text>
            <Text style={styles.coverName}>{companyName}</Text>
            {profile?.description && (
              <Text style={styles.coverTeaser}>{profile.description}</Text>
            )}

            <View style={styles.coverKpiBar}>
              <Text style={styles.coverKpiItem}>FUHRPARK: {profile?.logistics_fleet_kpi || '6 Fahrzeuge'}</Text>
              <Text style={styles.coverKpiItem}>CREW: {profile?.logistics_personnel_pool_kpi || '45'} Hands</Text>
              <Text style={styles.coverKpiItem}>HOTLINE: {profile?.logistics_hotline_kpi || '24/7'}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 2: PROFILE & STORY (Heller Kontrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: Portrait & Story */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Profile</Text>
              <Text style={styles.tagLight}>01 // LOGISTICS</Text>
            </View>

            <View style={styles.profileTopRow}>
              {(galleryImages[0]?.url || heroImage) && (
                <Image
                  src={galleryImages[0]?.url || heroImage}
                  style={styles.portraitImg}
                />
              )}
              <View style={styles.factsCol}>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Unternehmen</Text>
                  <Text style={styles.factValue}>{companyName}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Logistikleitung</Text>
                  <Text style={styles.factValue}>{profile?.name || '-'}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Standort & Base</Text>
                  <Text style={styles.factValue}>{profile?.city || '-'}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Aktionsradius</Text>
                  <Text style={styles.factValue}>
                    {profile?.logistics_operating_radius_kpi || 'DACH / Europa'}
                  </Text>
                </View>
              </View>
            </View>

            {profile?.bio_einleitung && (
              <Text style={styles.bodyText}>{profile.bio_einleitung}</Text>
            )}
            {profile?.logistics_fleet_capacity && (
              <Text style={styles.bodyText}>Fuhrpark: {profile.logistics_fleet_capacity}</Text>
            )}
            {profile?.logistics_transport_insurance && (
              <Text style={styles.bodyText}>Versicherung: {profile.logistics_transport_insurance}</Text>
            )}
          </View>

          <View style={styles.footerLight}>
            <Text>{companyName}</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>

        {/* Rechts: Visual & Contents */}
        <View style={styles.halfRightLight}>
          <View>
            {(galleryImages[1]?.url || heroImage) && (
              <Image
                src={galleryImages[1]?.url || heroImage}
                style={styles.wideImg}
              />
            )}

            <View style={styles.sectionHeaderLight}>
              <Text style={[styles.h2Light, { fontSize: 18 }]}>Contents</Text>
              <Text style={styles.tagLight}>INDEX</Text>
            </View>

            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>01. Logistik-Profil & Fuhrpark</Text>
              <Text style={styles.tocPage}>P. 02</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>02. Support-Leistungen & Stagehands</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>03. Qualifikationen & Arbeitsschutz</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>04. Stundensätze, Tarife & Kontakt</Text>
              <Text style={styles.tocPage}>P. 04</Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>LOGISTICS PORTFOLIO</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 3: LEISTUNGEN & QUALIFIKATIONEN (Dark Contrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        {/* Links: Logistik- & Supportleistungen */}
        <View style={styles.halfLeftDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Services</Text>
              <Text style={styles.tagDark}>02 // SUPPORT</Text>
            </View>

            {profile?.logistics_equipment_backline_transport && (
              <View style={styles.serviceCard}>
                <Text style={styles.cardTitle}>Equipment- & Backline-Transporte</Text>
                <Text style={styles.cardDetail}>{profile.logistics_equipment_backline_transport}</Text>
              </View>
            )}
            {profile?.logistics_stagehands_setup && (
              <View style={styles.serviceCard}>
                <Text style={styles.cardTitle}>Stagehands & Aufbauhilfe</Text>
                <Text style={styles.cardDetail}>{profile.logistics_stagehands_setup}</Text>
              </View>
            )}
            {profile?.logistics_forklift_handling && (
              <View style={styles.serviceCard}>
                <Text style={styles.cardTitle}>Stapler- & Flurförderzeug-Logistik</Text>
                <Text style={styles.cardDetail}>{profile.logistics_forklift_handling}</Text>
              </View>
            )}
          </View>

          <View style={styles.footerDark}>
            <Text>LOGISTICS SERVICES</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>

        {/* Rechts: Lizenzen, Zertifikate & Arbeitsschutz */}
        <View style={styles.halfRightDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Standards & Safety</Text>
              <Text style={styles.tagDark}>03 // QUALIFICATIONS</Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 3 }}>
                FAHRER- & BEDIENERSCHEINE
              </Text>
              <Text style={{ fontSize: 8.5, color: '#ffffff', marginBottom: 6 }}>
                {profile?.logistics_licenses_certificates || 'Führerscheinklassen B, BE, C1, C, CE (inkl. Schlüsselzahl 95), Staplerschein'}
              </Text>

              <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 3 }}>
                SICHERHEIT & ARBEITSSCHUTZ (PSA)
              </Text>
              <Text style={{ fontSize: 8.5, color: '#ffffff', marginBottom: 6 }}>
                {profile?.logistics_safety_occupational || 'Unterweisung VDI 2700, S3-Sicherheitsschuhe, Warnwesten, Helme'}
              </Text>

              <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 3 }}>
                VERLADE- & TRANSPORTMITTEL
              </Text>
              <Text style={{ fontSize: 8.5, color: '#ffffff', marginBottom: 6 }}>
                {profile?.logistics_loading_transport_equipment || 'Schwerlast-Auffahrrampen, Niederhubwagen, Möbelhunde, Zurrgurte'}
              </Text>

              <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 3 }}>
                KOMMUNIKATION VOR ORT
              </Text>
              <Text style={{ fontSize: 8.5, color: '#ffffff' }}>
                {profile?.logistics_on_site_communication || 'Eigene Funkgeräte für Laderampen-Koordination'}
              </Text>
            </View>
          </View>

          <View style={styles.footerDark}>
            <Text>SAFETY & LICENSES</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 4: RATES & DISPATCH CONTACT
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: Stundensätze & Tarife */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Rates & Terms</Text>
              <Text style={styles.tagLight}>04 // FINANCIALS</Text>
            </View>

            <Text style={styles.bodyText}>
              Transparente B2B-Konditionen für Stagehands, Crew-Chiefs und Fuhrpark-Einsätze:
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Stagehand / Helfer</Text>
                <Text style={[styles.factValue, { fontSize: 11, marginTop: 2 }]}>
                  {profile?.logistics_rate_stagehand || '31,00 EUR / Std.'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Crew-Chief / Stapler</Text>
                <Text style={[styles.factValue, { fontSize: 11, marginTop: 2 }]}>
                  {profile?.logistics_rate_crew_chief || '39,00 EUR / Std.'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>3,5t Sprinter inkl. Fahrer</Text>
                <Text style={[styles.factValue, { fontSize: 10, marginTop: 2 }]}>
                  {profile?.logistics_rate_sprinter || '290,00 EUR Tagessatz'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>7,5t / 12t LKW inkl. Fahrer</Text>
                <Text style={[styles.factValue, { fontSize: 10, marginTop: 2 }]}>
                  {profile?.logistics_rate_truck || '480 - 590 EUR'}
                </Text>
              </View>
            </View>

            <View style={{ backgroundColor: '#f4f4f5', padding: 8, borderLeftWidth: 3, borderLeftColor: '#000000' }}>
              <Text style={styles.factLabel}>Abrechnung & Zahlungsziel</Text>
              <Text style={{ fontSize: 8.5, color: '#27272a', marginTop: 2 }}>
                Zahlungsziel: 14 Tage rein netto. Regelbesteuerung (zzgl. MwSt.). UID: {profile?.company_uid || 'ATIJ12345678'}.
              </Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>RATES & FINANCIALS</Text>
            <Text>PAGE 04</Text>
          </View>
        </View>

        {/* Rechts: Dispatch Contact */}
        <View style={styles.halfRightDark}>
          <View>
            <Text style={{ fontSize: 8, color: '#fbbf24', letterSpacing: 2, marginBottom: 4 }}>
              TOUR- & PRODUKTIONS-DISPATCH
            </Text>
            <Text style={[styles.h2Dark, { fontSize: 24, marginBottom: 12 }]}>
              Booking Contact
            </Text>
            <Text style={{ fontSize: 9, color: '#a1a1aa', lineHeight: 1.5, marginBottom: 16 }}>
              {profile?.logistics_transport_crew_inquiries || 'Für ein schnelles Angebot senden Sie bitte Ladeadresse, Zielort, Zeitfenster und Ladevolumen.'}
            </Text>

            <View style={{ borderTopWidth: 1, borderTopColor: '#27272a', paddingTop: 12 }}>
              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>UNTERNEHMEN</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {companyName}<br />
                  {profile?.street}, {profile?.plz} {profile?.city}
                </Text>
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>E-MAIL</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.email || 'logi@stick.at'}
                </Text>
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>TELEFON</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.phone || '1234567'}
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

export function DownloadLogistikPdfButton({ profile, references }) {
  const companyName = profile?.Klarname || profile?.name || 'Logistics';
  const safeName = companyName
    .replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '_')
    .replace(/_+/g, '_');

  return (
    <PDFDownloadLink
      document={<LogistikPortfolioDocument profile={profile} references={references} />}
      fileName={`${safeName}_Logistics_Portfolio.pdf`}
      className="px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition"
    >
      {({ loading }) => (loading ? 'Generiere PDF...' : 'Logistik-PDF herunterladen')}
    </PDFDownloadLink>
  );
}