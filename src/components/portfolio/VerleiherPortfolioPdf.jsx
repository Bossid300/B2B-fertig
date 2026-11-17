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
    fontSize: 30,
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
  // Tech-Grid Balken Grafik
  techRow: {
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
  portfolioCard: {
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
    color: '#ffffff'
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  gridCellImg: {
    width: '48.5%',
    height: 112,
    objectFit: 'cover'
  },
  rateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14
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

export function VerleiherPortfolioDocument({ profile, references = [] }) {
  const companyName = profile?.Klarname || profile?.name || 'STAGE & TECH RENTAL';
  const heroImage = getSafeImageUrl(profile?.avatarUrl || profile?.slide1_url || profile?.gallery_slot1_url);
  
  const galleryImages = [1, 2, 3, 4]
    .map((num) => ({
      url: getSafeImageUrl(profile?.[`gallery_slot${num}_url`]),
      title: profile?.[`gallery_slot${num}_title`] || `Rental 0${num}`
    }))
    .filter((item) => Boolean(item.url));

  const equipment = Array.isArray(profile?.equipment) ? profile.equipment.filter(Boolean) : [];
  const barHeights = [20, 32, 18, 36, 24, 30, 14, 28, 22, 34, 16, 26];

  return (
    <Document title={`${companyName} - Rental Portfolio`}>
      {/* =========================================================
          SEITE 1: EDITORIAL COVER (A4 Querformat)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        <View style={styles.coverSpine}>
          <View style={styles.coverHeaderRow}>
            <Text>GIGSDA // {profile?.id || 'RENTAL'}</Text>
            <Text>MATERIAL EPK</Text>
          </View>

          <View style={styles.coverTypoBlock}>
            <Text style={styles.coverTitleBig}>MATERIALVERLEIH</Text>
            <Text style={styles.coverSubtitle}>DRY-HIRE</Text>

            {/* Tech-Balken Raster */}
            <View style={styles.techRow}>
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
              {profile?.genre || 'Ton, Licht, Video & Rigging'}
            </Text>
            <Text style={styles.coverMeta}>
              {profile?.city ? `${profile.city} • ` : ''}
              {profile?.verleiher_storage_area || '1500'} m² Lagerfläche
            </Text>
          </View>
        </View>

        <View style={styles.coverHero}>
          {heroImage && <Image src={heroImage} style={styles.coverHeroImg} />}
          <View style={styles.coverOverlay}>
            <Text style={styles.coverCategory}>
              {profile?.category || 'Professioneller Materialverleih'}
            </Text>
            <Text style={styles.coverName}>{companyName}</Text>
            {profile?.description && (
              <Text style={styles.coverTeaser}>{profile.description}</Text>
            )}

            <View style={styles.coverKpiBar}>
              <Text style={styles.coverKpiItem}>SERVICE: {profile?.verleiher_service_model || 'Dry-Hire'}</Text>
              <Text style={styles.coverKpiItem}>FUHRPARK: {profile?.verleiher_own_fleet || 'Eigene LKW'}</Text>
              <Text style={styles.coverKpiItem}>SUPPORT: {profile?.verleiher_24_7_support || '24/7 Hotline'}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 2: PROFILE & STORY (Heller Kontrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: Portrait & Bio */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Profile</Text>
              <Text style={styles.tagLight}>01 // RENTAL</Text>
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
                  <Text style={styles.factLabel}>Ansprechpartner</Text>
                  <Text style={styles.factValue}>{profile?.name || '-'}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Standort & Base</Text>
                  <Text style={styles.factValue}>{profile?.city || '-'}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Lagerfläche</Text>
                  <Text style={styles.factValue}>
                    {profile?.verleiher_storage_area ? `${profile.verleiher_storage_area} m²` : '1.500 m²'}
                  </Text>
                </View>
              </View>
            </View>

            {profile?.bio_einleitung && (
              <Text style={styles.bodyText}>{profile.bio_einleitung}</Text>
            )}
            {profile?.bio_karriere && (
              <Text style={styles.bodyText}>{profile.bio_karriere}</Text>
            )}
            {profile?.bio_privates && (
              <Text style={styles.bodyText}>{profile.bio_privates}</Text>
            )}
            {!profile?.bio_einleitung && profile?.description && (
              <Text style={styles.bodyText}>{profile.description}</Text>
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
              <Text style={styles.tocTitle}>01. Verleih-Profil & Unternehmen</Text>
              <Text style={styles.tocPage}>P. 02</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>02. Mietpark-Portfolio & Equipment</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>03. Dry-Hire-Staffelung & Logistik</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>04. Tarife, Konditionen & Kontakt</Text>
              <Text style={styles.tocPage}>P. 04</Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>RENTAL & TECH PORTFOLIO</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 3: MIETPARK-PORTFOLIO & DRY-HIRE (Dark Contrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        {/* Links: Mietpark-Portfolio */}
        <View style={styles.halfLeftDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Inventory</Text>
              <Text style={styles.tagDark}>02 // MIETPARK</Text>
            </View>

            <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 6 }}>
              HAUPTGEBIETE & GERÄTESPECS
            </Text>
            
            {profile?.verleiher_portfolio_ton && (
              <View style={styles.portfolioCard}>
                <Text style={styles.cardTitle}>Tontechnik</Text>
                <Text style={styles.cardDetail}>{profile.verleiher_portfolio_ton}</Text>
              </View>
            )}
            {profile?.verleiher_portfolio_licht && (
              <View style={styles.portfolioCard}>
                <Text style={styles.cardTitle}>Lichttechnik</Text>
                <Text style={styles.cardDetail}>{profile.verleiher_portfolio_licht}</Text>
              </View>
            )}
            {profile?.verleiher_portfolio_pulte && (
              <View style={styles.portfolioCard}>
                <Text style={styles.cardTitle}>Mischpulte</Text>
                <Text style={styles.cardDetail}>{profile.verleiher_portfolio_pulte}</Text>
              </View>
            )}
            {profile?.verleiher_portfolio_video && (
              <View style={styles.portfolioCard}>
                <Text style={styles.cardTitle}>Videotechnik & LED</Text>
                <Text style={styles.cardDetail}>{profile.verleiher_portfolio_video}</Text>
              </View>
            )}
            {profile?.verleiher_portfolio_rigging && (
              <View style={styles.portfolioCard}>
                <Text style={styles.cardTitle}>Rigging & Truss</Text>
                <Text style={styles.cardDetail}>{profile.verleiher_portfolio_rigging}</Text>
              </View>
            )}
          </View>

          <View style={styles.footerDark}>
            <Text>RENTAL INVENTORY</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>

        {/* Rechts: Dry-Hire-Staffelung & Standards */}
        <View style={styles.halfRightDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Dry-Hire Rates</Text>
              <Text style={styles.tagDark}>03 // STAFFELUNG</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#27272a', paddingBottom: 4, marginBottom: 4 }}>
                <Text style={{ fontSize: 7.5, color: '#fbbf24', fontFamily: 'Helvetica-Bold' }}>DAUER</Text>
                <Text style={{ fontSize: 7.5, color: '#fbbf24', fontFamily: 'Helvetica-Bold' }}>FAKTOR & BEDINGUNGEN</Text>
              </View>

              <View style={{ borderBottomWidth: 1, borderBottomColor: '#18181b', paddingVertical: 4 }}>
                <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: '#ffffff' }}>1 Einsatztag (1,0 × Tagessatz)</Text>
                <Text style={{ fontSize: 8, color: '#a1a1aa' }}>Standard Dry-Hire Abholung ab 14:00 Uhr am Vortag.</Text>
              </View>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#18181b', paddingVertical: 4 }}>
                <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: '#ffffff' }}>2 Einsatztage (1,5 × Tagessatz)</Text>
                <Text style={{ fontSize: 8, color: '#a1a1aa' }}>Wochenend-Spezialtarif (Fr. – Mo.).</Text>
              </View>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#18181b', paddingVertical: 4 }}>
                <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: '#ffffff' }}>3-4 Einsatztage (2,0 × Tagessatz)</Text>
                <Text style={{ fontSize: 8, color: '#a1a1aa' }}>Inklusive Kabelbäume & Verteiler-Zubehör.</Text>
              </View>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#18181b', paddingVertical: 4 }}>
                <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: '#ffffff' }}>1 Woche (3,0 × Tagessatz)</Text>
                <Text style={{ fontSize: 8, color: '#a1a1aa' }}>Attraktiver Langzeit-Mietfaktor für Festival-Touren.</Text>
              </View>
            </View>

            <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginTop: 6, marginBottom: 4 }}>
              PRÜF- & LOGISTIKSTANDARDS
            </Text>
            <Text style={{ fontSize: 8.5, color: '#d4d4d8', marginBottom: 2 }}>• Elektrische Prüfung: {profile?.verleiher_electrical_inspection || 'DGUV-V3'}</Text>
            <Text style={{ fontSize: 8.5, color: '#d4d4d8', marginBottom: 2 }}>• Motoren & Hebezeuge: {profile?.verleiher_motors_hoists || 'DGUV-V17/18'}</Text>
            <Text style={{ fontSize: 8.5, color: '#d4d4d8', marginBottom: 2 }}>• Verpackung: {profile?.verleiher_packaging || 'Standard-Truckmass Cases'}</Text>
          </View>

          <View style={styles.footerDark}>
            <Text>DRY-HIRE CONDITIONS</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 4: RATES & RENTAL CONDITIONS
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: Honorare & Bedingungen */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Rates & Terms</Text>
              <Text style={styles.tagLight}>04 // FINANCIALS</Text>
            </View>

            <Text style={styles.bodyText}>
              B2B-Konditionen für Materialverleih, Dry-Hire-Abwicklungen und projektbezogene Logistik:
            </Text>

            <View style={styles.rateGrid}>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Stundensatz</Text>
                <Text style={[styles.factValue, { fontSize: 13, marginTop: 3 }]}>
                  {profile?.rate_hour ? `${profile.rate_hour} €` : '65 €'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Tagessatz</Text>
                <Text style={[styles.factValue, { fontSize: 13, marginTop: 3 }]}>
                  {profile?.rate_day ? `${profile.rate_day} €` : '500 €'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Gage Min. / Max.</Text>
                <Text style={[styles.factValue, { fontSize: 11, marginTop: 3 }]}>
                  {profile?.gage_min || profile?.gage_max
                    ? `${profile?.gage_min || '400'} € – ${profile?.gage_max || '1200'} €`
                    : 'Auf Anfrage'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Materialausgabe</Text>
                <Text style={[styles.factValue, { fontSize: 10, marginTop: 3 }]}>
                  {profile?.verleiher_material_handover || 'Mo.–Fr. 08:00–17:00'}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: '#f4f4f5',
                borderLeftWidth: 3,
                borderLeftColor: '#000000',
                padding: 10
              }}
            >
              <Text style={styles.factLabel}>Mietbedingungen & Abrechnung</Text>
              <Text style={{ fontSize: 8.5, color: '#27272a', marginTop: 3, lineHeight: 1.4 }}>
                Zahlungsziel: {profile?.verleiher_payment_terms || '14 Tage rein netto'}. USt-ID: {profile?.company_uid || 'ATU12345678'}. Kaution: {profile?.verleiher_deposit || 'Entfällt für GIGSDA-Pro'}.
              </Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>RATES & RENTAL TERMS</Text>
            <Text>PAGE 04</Text>
          </View>
        </View>

        {/* Rechts: Booking Contact */}
        <View style={styles.halfRightDark}>
          <View>
            <Text style={{ fontSize: 8, color: '#fbbf24', letterSpacing: 2, marginBottom: 4 }}>
                RENTAL DISPATCH & DISPOSITION
            </Text>
            <Text style={[styles.h2Dark, { fontSize: 24, marginBottom: 12 }]}>
              Booking Contact
            </Text>
            <Text style={{ fontSize: 9, color: '#a1a1aa', lineHeight: 1.5, marginBottom: 20 }}>
              Für Dry-Hire-Anfragen, Verfügbarkeits-Checks, Dispositions-Absprachen und Materialabholungen:
            </Text>

            <View style={{ borderTopWidth: 1, borderTopColor: '#27272a', paddingTop: 12 }}>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>ADRESSE & FIRMA</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {companyName}<br />
                  {profile?.street}, {profile?.plz} {profile?.city}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>E-MAIL</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.email || 'maxl@gigsda.at'}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>TELEFON</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.phone || '6766766001'}
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

export function DownloadVerleiherPdfButton({ profile, references }) {
  const companyName = profile?.Klarname || profile?.name || 'Rental';
  const safeName = companyName
    .replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '_')
    .replace(/_+/g, '_');

  return (
    <PDFDownloadLink
      document={<VerleiherPortfolioDocument profile={profile} references={references} />}
      fileName={`${safeName}_Rental_Portfolio.pdf`}
      className="px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition"
    >
      {({ loading }) => (loading ? 'Generiere PDF...' : 'Verleiher-PDF herunterladen')}
    </PDFDownloadLink>
  );
}